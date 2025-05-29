import React, { useState, useEffect } from 'react';
import { Home, Users } from 'lucide-react';
import { Student } from '@/data/students'; // Import Student type

interface TutorSidebarProps {
  students: Student[];
  onStudentSelect: (studentId: number | null) => void;
  isMobile?: boolean;
}

export default function TutorSidebar({ students, onStudentSelect, isMobile = false }: TutorSidebarProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  
  const handleStudentClick = (student: Student) => {
    const newSelectedId = selectedStudentId === student.id ? null : student.id;
    setSelectedStudentId(newSelectedId);
    onStudentSelect(newSelectedId);
  };
  
  const handleHomeClick = () => {
    setSelectedStudentId(null);
    onStudentSelect(null);
  };

  useEffect(() => {
    if (isMobile) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        if (selectedStudentId !== null) {
          mainContent.classList.add('content-blurred');
        } else {
          mainContent.classList.remove('content-blurred');
        }
      }
    }
  }, [selectedStudentId, isMobile]);

  return (
    <aside 
      className="h-full w-full flex flex-col pt-4 z-20" 
      style={{ 
        backgroundColor: '#ffffff', 
        opacity: '1 !important'
      }}
    >
      {/* Home/Dashboard button */}
      <div className="p-4">
        <button 
          className="w-full py-3 px-4 rounded-lg flex items-center gap-3 transition-all duration-200 bg-primary text-hover-text hover:bg-secondary shadow-md"
          onClick={handleHomeClick}
        >
          <Home size={20} />
          <span className="font-medium text-base">Home</span>
        </button>
      </div>

      {/* Students section */}
      <div 
        className="flex-grow overflow-y-auto py-3"
      >
        <div className="px-5 mb-3 flex items-center justify-between">
          <h2 className="text-base font-medium text-text-secondary flex items-center gap-2">
            <Users size={16} />
            Your Students
          </h2>
          <button className="text-sm text-primary hover:text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </button>
        </div>
        
        <ul className="space-y-2 px-3">
          {students.map(student => (
            <li 
              key={student.id} 
              className={`
                rounded-lg cursor-pointer text-base transition-all duration-200
                ${selectedStudentId === student.id 
                  ? 'bg-hover-color text-text-color shadow-md' 
                  : 'student-item'
                }
              `}
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-base font-medium
                  ${selectedStudentId === student.id 
                    ? 'bg-primary text-hover-text' 
                    : 'bg-card-accent text-text-color'
                  }
                `}>
                  {student.name.charAt(0)}
                </div>
                <div className="flex-grow">
                  <div className={`font-medium ${selectedStudentId === student.id ? 'text-text-color' : ''}`}>
                    {student.name}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* User section with theme toggle */}
      <div className="border-t border-border-color p-4">
        <div className="flex items-center justify-between p-2 sidebar-item">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-hover-text">
              SV
            </div>
            <span className="text-base">Studyverse User</span>
          </div>
        </div>
      </div>
    </aside>
  );
} 