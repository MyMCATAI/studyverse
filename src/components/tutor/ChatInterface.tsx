import React, { useState } from 'react';
import StudentCard from './StudentCard';

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  selectedStudent: Student | null;
  welcomeMessage: string;
}

export default function ChatInterface({ selectedStudent, welcomeMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: welcomeMessage 
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I'm here to help with your tutoring for ${selectedStudent ? selectedStudent.name : 'your students'}. What specific aspect would you like assistance with?`
        }]);
      }, 1000);
      
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {/* Student card when student is selected */}
        {selectedStudent && (
          <div className="mb-6">
            <StudentCard student={selectedStudent} />
          </div>
        )}
        
        {/* Messages */}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`
                max-w-3/4 rounded-2xl px-4 py-3
                ${message.role === 'user' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-800 shadow-sm bg-gray-50/90'
                }
              `}
              style={{ maxWidth: '75%' }}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs mr-2 shadow-sm">
                    K
                  </div>
                  <span className="font-semibold text-sm">Kalypso</span>
                </div>
              )}
              <div>
                {message.content}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="p-4 bg-white shadow-inner">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow py-3 px-4 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white shadow-sm transition-all duration-200"
          />
          <button 
            type="submit" 
            className="primary-button ml-2 p-3 rounded-full flex items-center justify-center shadow-sm"
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