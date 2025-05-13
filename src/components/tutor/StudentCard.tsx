import React from 'react';

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
}

interface StudentCardProps {
  student: Student;
}

export default function StudentCard({ student }: StudentCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl flex-shrink-0 shadow-md">
          {student.name.charAt(0)}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-1">{student.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{student.summary}</p>
          
          {/* Progress bar */}
          <div className="mt-3 mb-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-gray-500">{student.progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${student.progress}%` }}
              />
            </div>
          </div>
          
          {/* Schedule information */}
          <div className="flex items-center text-sm text-gray-600 mt-3 pt-3 bg-gray-50/50 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {student.schedule}
          </div>
        </div>
      </div>
    </div>
  );
} 