'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SidebarProps {
  pageType: 'tutor' | 'firm';
  onStudentSelect?: (student: Student | null) => void;
  onDashboardToggle?: (isActive: boolean) => void;
  isMobile?: boolean;
}

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number; // Progress percentage
  schedule: string;
}

export default function Sidebar({ pageType, onStudentSelect, onDashboardToggle, isMobile = false }: SidebarProps) {
  // Enhanced student data with progress and schedule
  const [students, setStudents] = useState<Student[]>([
    { 
      id: 1, 
      name: "Emma Thompson", 
      summary: "3rd year medical student, focused on cardiology, struggling with ECG interpretation",
      progress: 68,
      schedule: "Next session: Thursday, 3:00 PM"
    },
    { 
      id: 2, 
      name: "James Wilson", 
      summary: "2nd year student, needs help with neurology fundamentals and neuroanatomy",
      progress: 42,
      schedule: "Next session: Monday, 5:30 PM"
    },
    { 
      id: 3, 
      name: "Sarah Chen", 
      summary: "4th year, preparing for pharmacology board exams, strong in theory",
      progress: 85,
      schedule: "Next session: Wednesday, 2:15 PM"
    },
    { 
      id: 4, 
      name: "Michael Rodriguez", 
      summary: "1st year student, building foundational knowledge in anatomy and physiology",
      progress: 31,
      schedule: "Next session: Tuesday, 4:45 PM"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDashboardActive, setIsDashboardActive] = useState(false);

  // Show student list only for tutor pageType
  const showStudents = pageType === 'tutor';
  
  // Handle student click to pass to parent component
  const handleStudentClick = (student: Student) => {
    const newSelectedState = selectedStudent?.id === student.id ? null : student;
    setSelectedStudent(newSelectedState);
    if (onStudentSelect) {
      onStudentSelect(newSelectedState);
    }
    
    // Close dashboard when student is selected
    if (isDashboardActive && newSelectedState) {
      setIsDashboardActive(false);
      if (onDashboardToggle) {
        onDashboardToggle(false);
      }
    }
  };
  
  // Handle dashboard button click
  const handleDashboardClick = () => {
    const newDashboardState = !isDashboardActive;
    setIsDashboardActive(newDashboardState);
    if (onDashboardToggle) {
      onDashboardToggle(newDashboardState);
    }
    
    // Clear selected student when dashboard is activated
    if (newDashboardState && selectedStudent) {
      setSelectedStudent(null);
      if (onStudentSelect) {
        onStudentSelect(null);
      }
    }
  };

  // Apply blur to main content when sidebar is active on mobile
  useEffect(() => {
    if (isMobile) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        if (isDashboardActive || selectedStudent) {
          mainContent.classList.add('content-blurred');
        } else {
          mainContent.classList.remove('content-blurred');
        }
      }
    }
  }, [isDashboardActive, selectedStudent, isMobile]);

  return (
    <aside className="bg-sidebar-bg h-full w-full flex flex-col z-20">
      {/* Home link */}
      <div className="p-3 border-b border-border-color">
        <Link href="/" className="secondary-button w-full py-2 px-4 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </Link>
      </div>
      
      {/* Dashboard button (previously New chat) */}
      <div className="p-3">
        <button 
          className={`${isDashboardActive ? 'secondary-button' : 'primary-button'} w-full py-3 px-4 flex items-center justify-center gap-2`}
          onClick={handleDashboardClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Dashboard</span>
        </button>
      </div>

      {/* Students list for tutor page */}
      {showStudents && (
        <div className="flex-grow overflow-y-auto py-2">
          <h2 className="px-3 mb-2 text-sm text-text-secondary">Your Students</h2>
          <ul className="space-y-1 px-2">
            {students.map(student => (
              <li 
                key={student.id} 
                className={`sidebar-item px-3 py-3 cursor-pointer text-sm ${selectedStudent?.id === student.id ? 'bg-hover-color' : ''}`}
                onClick={() => handleStudentClick(student)}
              >
                <div className="flex items-center gap-2">
                  {/* Student icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {student.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Previous conversations for firm page */}
      {!showStudents && (
        <div className="flex-grow overflow-y-auto py-2">
          <h2 className="px-3 mb-2 text-sm text-text-secondary">Recent case reviews</h2>
          <ul className="space-y-1 px-2">
            {[
              { id: 1, title: "Cardiology Case Review" },
              { id: 2, title: "Neurology Patient Cases" },
              { id: 3, title: "Drug Interaction Analysis" },
              { id: 4, title: "Surgical Approach Review" }
            ].map(chat => (
              <li key={chat.id} className="sidebar-item px-3 py-3 cursor-pointer text-sm">
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="case review">📚</span>
                  {chat.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User section */}
      <div className="border-t border-border-color p-3">
        <div className="sidebar-item flex items-center justify-between p-2 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-hover-text">
              SV
            </div>
            <span className="text-sm">Studyverse User</span>
          </div>
        </div>
      </div>
    </aside>
  );
} 