'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import kalypsoGif from './kalypsoend.gif';
import KalypsoWhiteboardMessage from './KalypsoWhiteboardMessage';
import { KalypsoPageContext, WhiteboardAction } from '../../types/kalypso';

interface ChatMessage {
  id: string; // Unique ID for each message, useful for streaming updates
  sender: 'user' | 'ai';
  text: string;
  audio?: string; // base64 encoded audio
  isLoading?: boolean; // To show a loading state for the AI message before content arrives
}

interface KalypsoChatProps {
  pageContext: KalypsoPageContext;
  tutorName: string;
  onWhiteboardAction?: (action: WhiteboardAction) => void;
}

// Define the type for the methods exposed via the ref
export interface KalypsoChatRef {
  sendAutomatedMessage: (prompt: string, isHidden?: boolean) => void;
  clearChatHistory: () => void; // Added a utility to clear chat if needed
}

const KALYPSO_IMAGE_SIZE = 200; // Define size for reuse
const SCREEN_PADDING = 10; // Define padding from screen edge
const GAP_ABOVE_IMAGE = 8; // Space between top of image and bottom of chat UI
const RIGHT_OFFSET = 200; // Additional offset from right edge

// Wrap component with forwardRef
const KalypsoChat = forwardRef<KalypsoChatRef, KalypsoChatProps>(({ pageContext, tutorName, onWhiteboardAction }, ref) => {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For overall send button state
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field
  const [hasPlayedWelcomeAudio, setHasPlayedWelcomeAudio] = useState(false);
  const [isIconAnimatedIn, setIsIconAnimatedIn] = useState(false);
  const [isWhiteboardAnimatingIn, setIsWhiteboardAnimatingIn] = useState(false); // For delayed whiteboard animation

  // For Draggable Kalypso
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Initial X will be calculated
  const [isDragging, setIsDragging] = useState(false);
  const dragStartCoords = useRef<{ x: number; y: number } | null>(null); // Store initial mouse coords
  const elementStartCoords = useRef<{ x: number; y: number } | null>(null); // Store initial element coords
  const kalypsoRef = useRef<HTMLDivElement>(null);
  const [didDrag, setDidDrag] = useState(false); // Flag to check if dragging occurred

  // State for the new whiteboard message
  const [showWhiteboardMessage, setShowWhiteboardMessage] = useState(true);
  const [whiteboardRightOffset, setWhiteboardRightOffset] = useState('-90px'); // Initial user-set offset

  useEffect(() => {
    // Set initial Y position to be bottom-right after component mounts and window is available
    setPosition({ 
        x: window.innerWidth - KALYPSO_IMAGE_SIZE - SCREEN_PADDING - RIGHT_OFFSET, 
        y: window.innerHeight - KALYPSO_IMAGE_SIZE - SCREEN_PADDING 
    });
    // Trigger icon animation
    const timer = setTimeout(() => setIsIconAnimatedIn(true), 50); // Short delay for effect
    return () => clearTimeout(timer);
  }, []);

  // Play welcome audio on first whiteboard interaction
  const playWelcomeAudioIfNotPlayed = () => {
    if (!hasPlayedWelcomeAudio) {
      const welcomeAudio = new Audio('/audio/welcome-back-evan.mp3');
      welcomeAudio.play().catch(error => console.error("Error playing welcome audio:", error));
      setHasPlayedWelcomeAudio(true);
    }
  };

  const handleDismissWhiteboard = () => {
    playWelcomeAudioIfNotPlayed();
    setShowWhiteboardMessage(false);
  };

  const handleBlockActionWhiteboard = (action: WhiteboardAction) => {
    playWelcomeAudioIfNotPlayed();
    if (onWhiteboardAction) {
      onWhiteboardAction(action);
    }
  };

  // Autofocus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset whiteboard message visibility when pageContext changes
  useEffect(() => {
    setShowWhiteboardMessage(true);
  }, [pageContext]);

  // Effect to control whiteboard appearance animation
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    if (isOpen && showWhiteboardMessage) {
      // If whiteboard should be visible, start animation after a delay
      animationTimer = setTimeout(() => {
        setIsWhiteboardAnimatingIn(true);
      }, 250); // Delay for pop-up, adjust as needed
    } else {
      // If chat is closed or whiteboard dismissed, hide immediately (animation out handled by CSS)
      setIsWhiteboardAnimatingIn(false);
    }
    return () => clearTimeout(animationTimer);
  }, [isOpen, showWhiteboardMessage]);

  // Effect to handle whiteboard position based on chat activity
  useEffect(() => {
    if (chatHistory.length > 0 && showWhiteboardMessage) {
      // Move whiteboard to the left once chat starts and whiteboard is visible
      setWhiteboardRightOffset('350px'); // Adjusted to align right edge of whiteboard with left edge of chat UI
    } else if (chatHistory.length === 0 && showWhiteboardMessage) {
      // If chat is empty and whiteboard is supposed to be shown, reset to initial prominent position
      setWhiteboardRightOffset('-90px');
    }
    // If !showWhiteboardMessage, its position doesn't visually matter for this effect.
  }, [chatHistory.length, showWhiteboardMessage]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Check if the click is on the image part (the direct child of kalypsoRef) or on the chat UI itself
    // If the click is within the chat UI (which is absolutely positioned), do not start drag.
    if (target.closest('.chat-ui-container')) {
        return;
    }
    // Allow drag if clicking on Kalypso image or its immediate wrapper if chat is closed/open
    // Or if it's specifically on the image if chat is open and above it.
    // The current logic seems okay as long as chat UI stops propagation or this check is fine.

    if (!kalypsoRef.current) return;
    // Check if the click is on the whiteboard area
    if (target.closest('.whiteboard-container')) {
        return; // Do not start dragging if click is on whiteboard
    }
    setIsDragging(true);
    setDidDrag(false);
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    const rect = kalypsoRef.current.getBoundingClientRect();
    elementStartCoords.current = { x: rect.left, y: rect.top };
    e.preventDefault(); // Prevent text selection ONLY when a drag is initiated on a draggable area
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragStartCoords.current || !elementStartCoords.current) return;
    setDidDrag(true);
    let newX = elementStartCoords.current.x + (e.clientX - dragStartCoords.current.x);
    let newY = elementStartCoords.current.y + (e.clientY - dragStartCoords.current.y);
    if (kalypsoRef.current && kalypsoRef.current.parentElement) {
        const parentRect = kalypsoRef.current.parentElement.getBoundingClientRect();
        // Use KALYPSO_IMAGE_SIZE for element dimensions as kalypsoRef is now fixed to this size
        newX = Math.max(0, Math.min(newX, parentRect.width - KALYPSO_IMAGE_SIZE));
        newY = Math.max(0, Math.min(newY, parentRect.height - KALYPSO_IMAGE_SIZE));
    }
    setPosition({ x: newX, y: newY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset didDrag only if chat isn't being opened/closed by this interaction
    // If isOpen changed, it was a click, not a drag that should be ignored for toggle
    // The logic for toggling isOpen based on didDrag handles this.
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Cleanup EventSource on component unmount or when chat is closed
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [isOpen, currentAudio]); // Rerun if isOpen changes to close EventSource when chat closes

  const playAudio = (audioBase64: string) => {
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audio.play().catch(err => console.error("Error playing audio:", err));
    setCurrentAudio(audio);
    audio.onended = () => setCurrentAudio(null);
  };

  // Main function to send message, used by both user input and automated calls
  const internalHandleSendMessage = async (textToSend: string, currentThreadId: string | null, isHiddenPrompt: boolean = false) => {
    if (!textToSend.trim()) return;

    if (!isHiddenPrompt) {
      const userMessageId = `user-${Date.now()}`;
      // For automated messages, we might not want to show them as 'user' messages,
      // or we might want a different sender type. For now, keeping it simple.
      // Alternatively, automated messages could skip adding to chatHistory if they are just prompts.
      // For this use case, we DO want to show the AI's response based on the automated prompt.
      const newUserMessage: ChatMessage = { id: userMessageId, sender: 'user', text: textToSend };
      setChatHistory(prev => [...prev, newUserMessage]);
      // No need to clear `message` state here as `textToSend` is passed directly
    }
    
    setIsLoading(true);
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessagePlaceholder: ChatMessage = { id: aiMessageId, sender: 'ai', text: '', isLoading: true };
    // Add AI placeholder regardless of whether the prompt was hidden
    setChatHistory(prev => [...prev, aiMessagePlaceholder]);

    if (eventSourceRef.current) {
      eventSourceRef.current.close(); // Close any existing connection
    }

    eventSourceRef.current = new EventSource(`/api/chat?message=${encodeURIComponent(textToSend)}${currentThreadId ? `&threadId=${currentThreadId}` : ''}&generateAudio=true`);
    // Note: For POST requests with EventSource, a common pattern is to make an initial POST to trigger the process,
    // and that POST returns a URL/ID that the EventSource then connects to via GET.
    // Here, for simplicity in a GET request, we're sending message data via query params.
    // This is NOT suitable for large messages or sensitive data in production.
    // The backend POST route needs to be adapted to accept GET with query params for this EventSource approach
    // OR the client needs to make a POST first, get an ID, then use EventSource with that ID.
    // The current backend is POST only, so this client part needs adjustment to match it OR backend to support GET for EventSource.
    // FOR NOW, I WILL ASSUME A MODIFICATION ON THE BACKEND OR A SEPARATE GET ROUTE FOR EventSource.
    // Let's adjust to a POST-then-EventSource pattern for robustness.

    // First, make a POST request to initiate the chat and get a stream URL or ID
    try {
      const initResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          threadId: currentThreadId,
          generateAudio: true,
          tutorName: tutorName,
          context: pageContext.ai
        }),
      });

      if (!initResponse.ok || !initResponse.body) {
        const errorData = await initResponse.json().catch(() => ({ error: "Failed to initialize stream."}));
        console.error('Error initializing chat stream:', errorData);
        setChatHistory(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: `Error: ${errorData.error || 'Failed to get response'}`, isLoading: false } : msg
        ));
        setIsLoading(false);
        return;
      }
      
      // Assuming the POST directly returns the stream as implemented in the Python overhaul
      const reader = initResponse.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsLoading(false);
            setChatHistory(prev => prev.map(msg => 
              msg.id === aiMessageId ? { ...msg, isLoading: false } : msg
            ));
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || ''; // Keep the last, possibly incomplete part

          for (const part of parts) {
            if (part.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(part.substring(6)); // Remove 'data: '
                if (jsonData.type === 'thread_id') {
                  setThreadId(jsonData.value);
                } else if (jsonData.type === 'text_delta') {
                  setChatHistory(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: msg.text + jsonData.value, isLoading: true } : msg
                  ));
                } else if (jsonData.type === 'audio_data') {
                  playAudio(jsonData.value);
                } else if (jsonData.type === 'audio_status' && jsonData.status === 'error') {
                  console.error('Audio generation error:', jsonData.message);
                  // Optionally display this error to the user in the chat
                } else if (jsonData.type === 'error') {
                  console.error('Stream error from server:', jsonData.message);
                  setChatHistory(prev => prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: `Error: ${jsonData.message}`, isLoading: false } : msg
                  ));
                  setIsLoading(false);
                  return; // Stop processing on stream error
                } else if (jsonData.type === 'stream_end') {
                  if(jsonData.threadId) setThreadId(jsonData.threadId); // Update threadId if sent with end
                  setIsLoading(false);
                  setChatHistory(prev => prev.map(msg => 
                     msg.id === aiMessageId ? { ...msg, isLoading: false } : msg
                  ));
                  return; // End of stream for this message
                }
              } catch (e) {
                console.error("Error parsing SSE event:", e, "Part:", part);
              }
            }
          }
        }
      };
      processStream();

    } catch (error) {
      console.error('Failed to send message or connect to stream:', error);
      setChatHistory(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: 'Error: Could not connect.', isLoading: false } : msg
      ));
      setIsLoading(false);
    }
  };

  // Original handleSendMessage for user input
  const handleSendMessage = () => {
    internalHandleSendMessage(message, threadId, false);
    setMessage(''); // Clear input after sending
  };
  
  // Expose specific methods to the parent component via ref
  useImperativeHandle(ref, () => ({
    sendAutomatedMessage: (prompt: string, isHidden: boolean = true) => {
      if (!isOpen) setIsOpen(true); // Open chat if closed
      // We could choose to clear previous history or not.
      // For this use case, let's clear history to make the new context prominent.
      // setChatHistory([]); 
      // setShowWhiteboardMessage(false); // Optionally hide whiteboard when auto-message starts convo
      internalHandleSendMessage(prompt, threadId, isHidden);
    },
    clearChatHistory: () => {
        setChatHistory([]);
        setThreadId(null); // Also clear the threadId
    }
  }));

  return (
    <>
      {/* Backdrop for blur and darken effect when chat is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main container for Kalypso: Draggable icon + Chat UI */}
      {/* When not open, only the icon is effectively visible and draggable. */}
      {/* When open, the whole unit (icon + chat bubbles + input) conceptually moves together. */}
      <div 
        ref={kalypsoRef} 
        className={`fixed z-50 cursor-grab transform transition-transform transition-opacity duration-300 ease-out ${isIconAnimatedIn ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${KALYPSO_IMAGE_SIZE}px`, // Explicitly set width for the draggable container
          height: `${KALYPSO_IMAGE_SIZE}px`, // Explicitly set height for the draggable container
        }}
        onMouseDown={handleMouseDown} // Drag handle is the whole container
      >
        {/* Chat UI and Whiteboard - Absolutely positioned above the Kalypso image container */}
        {isOpen && (
          <>
            {showWhiteboardMessage && (
              <div
                className={`whiteboard-container transition-all duration-500 ease-in-out transform ${isWhiteboardAnimatingIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
                onClick={(e) => { 
                  playWelcomeAudioIfNotPlayed(); 
                  e.stopPropagation(); // Prevent click from bubbling to Kalypso icon for toggle
                }}
                style={{
                  position: 'absolute',
                  bottom: `calc(100% + ${GAP_ABOVE_IMAGE}px + 100px)`, // Positioned above kalypsoRef (user modified this line)
                  right: whiteboardRightOffset, // Dynamically set from state
                  width: '800px', // Wider than the chat UI (user modified this line)
                  zIndex: 55 // Ensure it's contextually layered
                }}
              >
                <KalypsoWhiteboardMessage
                  tutorName={tutorName}
                  pageContext={pageContext.whiteboard}
                  onDismiss={handleDismissWhiteboard}
                  onBlockAction={handleBlockActionWhiteboard}
                />
              </div>
            )}
            <div 
                className={`chat-ui-container absolute left-1/2 -translate-x-1/2 w-[450px] md:w-[500px] flex flex-col origin-bottom transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-90 pointer-events-none'}`}
                style={{
                    bottom: `calc(100% + ${GAP_ABOVE_IMAGE}px)`, // Position bottom of chat UI above the top of kalypsoRef
                    zIndex: 50 // Lower z-index than whiteboard if they could overlap
                }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside from bubbling to drag or toggle logic
            >
              {/* Whiteboard message is now outside and above this container */}
              <div ref={chatContainerRef} className="flex-1 p-1 space-y-3 overflow-y-auto max-h-[768px] no-scrollbar bg-transparent">
                {chatHistory.map((chat) => (
                  <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3.5 text-lg rounded-3xl shadow-xl break-words transition-all duration-300 ease-in-out transform hover:scale-105 ${
                        chat.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-xl' // Changed to blue, adjusted rounding for tail
                          : 'bg-slate-200 text-slate-800 rounded-bl-xl ml-4' // Adjusted rounding for tail, added ml-4
                      }`}
                    >
                      {chat.isLoading ? ( 
                        <span className="italic text-slate-500">Kalypso is thinking...</span>
                      ) : chat.text}
                      {chat.sender === 'ai' && chat.audio && !chat.isLoading && (
                        <button 
                          onClick={() => playAudio(chat.audio!)} 
                          className="ml-1 mt-1.5 text-xs text-blue-700 hover:text-blue-900 underline block"
                          aria-label="Play audio response"
                        >
                          Play Audio
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 mt-2"> 
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef} // Assign ref to input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder="Ask Kalypso..."
                    className="flex-1 p-3.5 text-lg border-2 border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-2xl bg-white/95 backdrop-blur-md placeholder-slate-500 transition-all duration-300 ease-in-out focus:shadow-blue-400/50"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="p-3.5 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-60 transition-all duration-300 ease-in-out shadow-2xl hover:shadow-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-70"
                    aria-label="Send message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Kalypso Image Container - This is what kalypsoRef refers to for its fixed size */}
        {/* The onClick to toggle chat is now here */} 
        <div
            className={`w-full h-full p-0 bg-transparent border-none rounded-full transition-all duration-300 ease-in-out group ${!isOpen ? 'hover:scale-105 hover:shadow-2xl' : ''}`}
            aria-label={isOpen ? "Close Kalypso Chat" : "Open Kalypso Chat"}
            onClick={(e) => { 
              if (e.target !== e.currentTarget) { 
                  // Click was on a child of this div (e.g. if something was overlaid on image), let it bubble or handle if necessary
                  // For now, assume only direct clicks on this div or its immediate image child should toggle
                  // This check might be overly cautious if image is the only child.
              } 
              if (!didDrag) { 
                setIsOpen(!isOpen);
              }
              // No stopPropagation needed here as this is the intended click target for toggling
            }}
          >
            <Image
              src={kalypsoGif}
              alt="Kalypso Chat Icon"
              width={KALYPSO_IMAGE_SIZE} // Image fills the fixed-size kalypsoRef container
              height={KALYPSO_IMAGE_SIZE} // Image fills the fixed-size kalypsoRef container
              className="rounded-full shadow-2xl transition-shadow duration-300 select-none group-hover:shadow-blue-400/50 pointer-events-none" // Added pointer-events-none to Image
              unoptimized
              draggable="false"
            />
          </div>
      </div>
    </>
  );
});

KalypsoChat.displayName = 'KalypsoChat'; // Setting displayName for better debugging
export default KalypsoChat;
