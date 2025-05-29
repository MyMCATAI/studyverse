'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import kalypsoGif from './kalypsoend.gif';

interface ChatMessage {
  id: string; // Unique ID for each message, useful for streaming updates
  sender: 'user' | 'ai';
  text: string;
  audio?: string; // base64 encoded audio
  isLoading?: boolean; // To show a loading state for the AI message before content arrives
}

export default function KalypsoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // For overall send button state
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null); // For auto-scrolling

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = { id: userMessageId, sender: 'user', text: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');
    setIsLoading(true);

    // Prepare AI message placeholder
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessagePlaceholder: ChatMessage = { id: aiMessageId, sender: 'ai', text: '', isLoading: true };
    setChatHistory(prev => [...prev, aiMessagePlaceholder]);

    if (eventSourceRef.current) {
      eventSourceRef.current.close(); // Close any existing connection
    }

    eventSourceRef.current = new EventSource(`/api/chat?message=${encodeURIComponent(newUserMessage.text)}${threadId ? `&threadId=${threadId}` : ''}&generateAudio=true`);
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
          message: newUserMessage.text,
          threadId: threadId,
          generateAudio: true, // Request audio for AI responses
          // context: "Some context",
          // assistantId: "your-assistant-id"
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
                    msg.id === aiMessageId ? { ...msg, text: msg.text + jsonData.value, isLoading: false } : msg
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-0 bg-transparent border-none rounded-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
          aria-label="Open Kalypso Chat"
        >
          <Image
            src={kalypsoGif}
            alt="Kalypso Chat Icon"
            width={200}
            height={200}
            className="rounded-full shadow-lg transition-shadow duration-300"
            unoptimized
          />
        </button>
      )}

      {isOpen && (
        <div className="w-80 md:w-96 h-[28rem] md:h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-emerald-500 p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="text-white font-semibold text-lg">Chat with Kalypso</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                if (eventSourceRef.current) {
                  eventSourceRef.current.close();
                  eventSourceRef.current = null;
                }
                if (currentAudio) {
                  currentAudio.pause();
                  setCurrentAudio(null);
                }
              }}
              className="text-white hover:text-emerald-100"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] p-2.5 rounded-xl text-sm break-words ${
                    chat.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {chat.isLoading ? 'Kalypso is thinking...' : chat.text}
                  {chat.sender === 'ai' && chat.audio && !chat.isLoading && (
                    <button 
                      onClick={() => playAudio(chat.audio!)} 
                      className="ml-2 mt-1 text-xs text-emerald-700 hover:text-emerald-900 underline block"
                      aria-label="Play audio response"
                    >
                      Play Audio
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                placeholder="Ask Kalypso..."
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="p-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 