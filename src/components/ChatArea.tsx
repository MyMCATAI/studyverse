'use client'

import { useState } from 'react'

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
}

interface Session {
  id: number;
  studentName: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
}

interface ChatAreaProps {
  toggleSidebar: () => void;
  pageTitle?: string;
  welcomeMessage?: string;
  selectedStudent?: Student | null;
  showDashboard?: boolean;
}

export default function ChatArea({ 
  toggleSidebar,
  pageTitle = "Studyverse Medicine",
  welcomeMessage = "Hello! Welcome to Studyverse Medicine. How can I help you with your medical education needs today?",
  selectedStudent = null,
  showDashboard = false
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: welcomeMessage 
    }
  ]);
  
  // Sample upcoming sessions data
  const upcomingSessions: Session[] = [
    { 
      id: 1, 
      studentName: "Emma Thompson", 
      date: "Thursday", 
      time: "3:00 PM", 
      duration: "45 min",
      topic: "ECG Interpretation"
    },
    { 
      id: 2, 
      studentName: "James Wilson", 
      date: "Monday", 
      time: "5:30 PM", 
      duration: "60 min",
      topic: "Neuroanatomy Review"
    },
    { 
      id: 3, 
      studentName: "Sarah Chen", 
      date: "Wednesday", 
      time: "2:15 PM", 
      duration: "30 min",
      topic: "Pharmacology Quiz Preparation"
    },
    { 
      id: 4, 
      studentName: "Michael Rodriguez", 
      date: "Tuesday", 
      time: "4:45 PM", 
      duration: "45 min",
      topic: "Anatomy Lab Review"
    }
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      // In a real app, you would call an API here and then add the response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Thank you for your message. As ${pageTitle}, we are dedicated to supporting your medical education journey.` 
        }]);
      }, 1000);
      setInput("");
    }
  };

  // Generate progress bar based on student's progress
  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="mt-2 mb-3">
      <div className="h-2 w-full bg-card-accent rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-text-secondary flex justify-between">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative bg-background">
      {/* Header */}
      <header className="border-b border-border-color p-3 flex items-center bg-card-bg">
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-hover-color rounded-md mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="text-lg font-medium">{pageTitle}</h1>
      </header>

      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-background">
        {/* Dashboard view - shows upcoming sessions */}
        {showDashboard && (
          <div className="flex justify-start mb-6">
            <div className="bg-card-bg rounded-lg px-4 py-3 border border-border-color shadow-sm" style={{ width: "75%", minWidth: "32rem" }}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-hover-text mr-2">
                  K
                </div>
                <span className="font-semibold">Kalypso</span>
              </div>
              
              <div>
                <h3 className="font-medium">Upcoming Tutoring Sessions</h3>
                <div className="mt-3 space-y-3">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="border-b border-border-light pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{session.studentName}</span>
                        <span className="text-sm text-text-secondary">{session.date}, {session.time} ({session.duration})</span>
                      </div>
                      <p className="text-sm text-text-secondary mt-1">Topic: {session.topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Student summary card at the top when student is selected */}
        {selectedStudent && (
          <div className="flex justify-start mb-6">
            <div className="bg-card-bg rounded-lg px-4 py-3 border border-border-color shadow-sm" style={{ width: "75%", minWidth: "32rem" }}>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-hover-text mr-2">
                  K
                </div>
                <span className="font-semibold">Kalypso</span>
              </div>
              
              <div>
                <h3 className="font-medium">{selectedStudent.name} - Student Summary</h3>
                <p className="text-sm my-2">{selectedStudent.summary}</p>
                
                {/* Progress visualization */}
                <ProgressBar progress={selectedStudent.progress} />
                
                {/* Schedule information */}
                <div className="flex items-center text-sm mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {selectedStudent.schedule}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Regular chat messages */}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 ${message.role === 'user' ? 'bg-primary text-hover-text' : 'bg-card-bg border border-border-color'} rounded-lg px-4 py-3`}>
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t border-border-color p-4 bg-card-bg">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow py-3 px-4 bg-background border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button 
            type="submit" 
            className="primary-button ml-2 p-3"
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