import React from 'react';

interface Session {
  id: number;
  studentName: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
}

interface SessionCardProps {
  session: Session;
}

export default function SessionCard({ session }: SessionCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-base">{session.studentName}</h4>
          <p className="text-gray-600 text-sm mt-1">Topic: {session.topic}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {session.duration}
          </div>
          <div className="text-sm text-gray-500 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {session.date}, {session.time}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 bg-gray-50/50 flex gap-2 p-2 rounded-lg">
        <button className="text-xs text-primary font-medium px-3 py-1.5 rounded-md hover:bg-primary/5 transition-colors flex-1 bg-white shadow-sm">
          Reschedule
        </button>
        <button className="text-xs bg-primary text-white font-medium px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors flex-1 shadow-sm">
          Join Session
        </button>
      </div>
    </div>
  );
} 