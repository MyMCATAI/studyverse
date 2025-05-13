import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isEditing?: boolean;
}

interface ChatPanelProps {
  initialMessage: string;
  studentName: string;
  onGeneratePlan?: () => Promise<void>;
  isGenerating?: boolean;
  lastSessionDate?: string;
  lastSessionTopics?: string[];
  nextSessionGoals?: string[];
}

export default function ChatPanel({ 
  initialMessage, 
  studentName, 
  onGeneratePlan, 
  isGenerating = false,
  lastSessionDate,
  lastSessionTopics = [],
  nextSessionGoals = []
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);

  // Update messages when initialMessage changes
  useEffect(() => {
    setMessages([{ role: 'assistant', content: initialMessage }]);
  }, [initialMessage]);

  // Focus on edit area when entering edit mode
  useEffect(() => {
    if (editingMessageIndex !== null && editRef.current) {
      editRef.current.focus();
    }
  }, [editingMessageIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response (replace with actual API call later)
      setTimeout(() => {
        const aiResponse: Message = {
          role: 'assistant',
          content: `Okay, regarding ${studentName}, let's explore that further. What else is on your mind?` // Generic response
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
      
      setInput('');
    }
  };

  const startEditing = (index: number) => {
    setEditingMessageIndex(index);
  };

  const saveEdits = () => {
    setEditingMessageIndex(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingMessageIndex !== null) {
      const updatedMessages = [...messages];
      updatedMessages[editingMessageIndex].content = e.target.value;
      setMessages(updatedMessages);
    }
  };

  // Function to check if content is a session plan
  const isSessionPlan = (content: string) => {
    return content.includes("# Tutoring Session Plan for");
  };

  // Function to render edit button if content is a session plan
  const renderEditButton = (content: string, index: number) => {
    if (isSessionPlan(content) && editingMessageIndex !== index) {
      return (
        <button 
          onClick={() => startEditing(index)}
          className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center group"
          aria-label="Edit session plan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-primary">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
      );
    }
    return null;
  };

  // Function to add spacing between sections and handle indentation
  const formatContent = (content: string) => {
    if (!content) return '';
    
    // Replace main headers with extra spacing
    let formatted = content
      // Add extra spacing before main headers
      .replace(/\n# /g, '\n\n\n# ')
      // Add spacing before section headers 
      .replace(/\n## /g, '\n\n## ')
      // Add additional spacing for bullet points with proper indentation
      .replace(/\n• /g, '\n\n• ')
      // Convert standard markdown bullets to the bullet character for consistency
      .replace(/\n- /g, '\n• ')
      .replace(/\n\* /g, '\n• ');
      
    return formatted;
  };

  // This CSS will be applied to the rendered markdown content
  const markdownStyles = `
    .session-plan h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--primary);
      margin-top: 2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      display: inline-flex;
      align-items: center;
    }
    
    .session-plan h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
      color: var(--text-color);
    }
    
    .session-plan ul {
      padding-left: 1.5rem;
      margin: 1.25rem 0;
    }
    
    .session-plan li {
      margin: 0.75rem 0;
      position: relative;
      padding-left: 0.5rem;
    }
    
    .session-plan p {
      margin: 1rem 0;
      line-height: 1.6;
    }
    
    .session-plan code {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
    }
    
    .session-plan strong {
      font-weight: 600;
    }
  `;

  // Function to toggle summary modal
  const toggleSummaryModal = () => {
    setShowSummaryModal(!showSummaryModal);
  };

  return (
    <div className="flex flex-col h-full">
      <style>{markdownStyles}</style>
      
      {/* Last Session Summary Modal - no title */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" style={{ transition: 'none' }}>
          <div className="bg-white w-full max-w-4xl overflow-y-auto rounded-3xl" 
               style={{ 
                 padding: '2.5rem', 
                 maxHeight: '90vh', 
                 border: 'none', 
                 boxShadow: 'none', 
                 transition: 'none',
                 outline: 'none'
               }}>
            <style jsx global>{`
              /* Override any global transitions or borders */
              .modal-content * {
                transition: none !important;
                border: none !important;
                box-shadow: none !important;
                outline: none !important;
              }
              .modal-content h2, .modal-content h3, .modal-content div {
                border: none !important;
                box-shadow: none !important;
              }
            `}</style>
            
            <div className="modal-content">
              <div className="flex justify-end" style={{ border: 'none' }}>
                <button 
                  onClick={toggleSummaryModal}
                  className="text-gray-400 hover:text-gray-600"
                  style={{ transition: 'none' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div style={{ marginTop: '0', border: 'none' }}>
                <div className="flex items-center" style={{ marginTop: '0', marginBottom: '2rem', border: 'none' }}>
                  <div className="rounded-full bg-primary/10 flex items-center justify-center" style={{ width: '3rem', height: '3rem', flexShrink: 0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div style={{ marginLeft: '1.5rem', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', border: 'none' }}>
                    <span className="text-xl font-semibold text-gray-900">{lastSessionDate}</span>
                    <span className="text-green-600 font-medium">Completed</span>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16" style={{ marginTop: '3rem', border: 'none' }}>
                  <div style={{ border: 'none' }}>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center" style={{ border: 'none', marginBottom: '1.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" style={{ marginRight: '1rem' }}>
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                      Key Topics Covered
                    </h3>
                    <div style={{ border: 'none' }}>
                      {lastSessionTopics.map((item, i) => (
                        <div key={i} className="flex items-start" style={{ marginBottom: '1.25rem', border: 'none' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500" style={{ marginRight: '1rem', marginTop: '0.35rem' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-lg">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ border: 'none' }}>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center" style={{ border: 'none', marginBottom: '1.5rem' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" style={{ marginRight: '1rem' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Goals for Next Session
                    </h3>
                    <div style={{ border: 'none' }}>
                      {nextSessionGoals.map((item, i) => (
                        <div key={i} className="flex items-start" style={{ marginBottom: '1.25rem', border: 'none' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" style={{ marginRight: '1rem', marginTop: '0.35rem' }}>
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          <span className="text-lg">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '3rem', border: 'none' }}>
                  <button 
                    className="w-full py-4 bg-primary text-white rounded-xl text-lg font-medium hover:bg-primary/90"
                    onClick={toggleSummaryModal}
                    style={{ border: 'none', transition: 'background-color 0.2s' }}
                  >
                    Close Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat messages area with improved Kalypso appearance */}
      <div className="flex-grow overflow-y-auto px-6 space-y-16">
        {messages.map((message, index) => (
          <div key={index} className={`${message.role === 'user' ? 'text-right' : ''} max-w-4xl ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            {message.role === 'assistant' && !isSessionPlan(message.content) && (
              <div className="flex items-start mt-6 mb-3">
                <div className="mr-4 h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-primary/5 ring-2 ring-primary/20">
                  <img src="/KalypsoPicture.png" alt="Kalypso" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="text-base font-semibold text-primary">Kalypso</span>
                </div>
              </div>
            )}
            <div className={`${message.role === 'user' ? 'text-primary font-medium' : 'text-gray-800'} ${message.role === 'assistant' && !isSessionPlan(message.content) ? 'pl-16' : ''}`}>
              {editingMessageIndex === index ? (
                <div className="mb-2">
                  <textarea
                    ref={editRef}
                    value={message.content}
                    onChange={handleEditChange}
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[15rem] focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={saveEdits}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`leading-relaxed prose-lg max-w-none ${message.role === 'user' ? 'text-right' : 'session-plan'}`}>
                  {message.content.includes('#') || 
                   message.content.includes('•') ||
                   message.content.includes('*') || 
                   message.content.includes('-') ||
                   (message.content.includes('\n') && message.content.length > 100) ? (
                    <>
                      {isSessionPlan(message.content) && (
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <h3 className="text-primary font-medium text-lg">Session Plan</h3>
                          </div>
                          {editingMessageIndex !== index && (
                            <button 
                              onClick={() => startEditing(index)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center group text-gray-400 hover:text-primary"
                              aria-label="Edit session plan"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                      <ReactMarkdown>
                        {formatContent(message.content)}
                      </ReactMarkdown>
                    </>
                  ) : (
                    <p className="text-lg">{message.content}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area with Generate Plan buttons above */} 
      <div className="p-4 border-t border-gray-200">
        {/* Generate buttons - reordered with Generate Session Plan first */}
        <div className="flex gap-3 mb-4 justify-center">
          <button 
            className="py-2 px-4 bg-blue-50 border border-blue-200 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5"
            onClick={onGeneratePlan}
            disabled={isGenerating || !onGeneratePlan}
          >
            {isGenerating ? (
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            )}
            {isGenerating ? "Generating..." : "Generate Session Plan"}
          </button>

          <button 
            className="py-2 px-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            onClick={toggleSummaryModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Summarize Last Session
          </button>

          <button 
            className="py-2 px-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            onClick={onGeneratePlan}
            disabled={isGenerating || !onGeneratePlan}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Regenerate
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Chat with Kalypso..."
            className="flex-grow py-3 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-base transition-all duration-200"
          />
          <button 
            type="submit" 
            className="p-3 rounded-xl flex items-center justify-center bg-primary text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-primary/90"
            disabled={!input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
} 