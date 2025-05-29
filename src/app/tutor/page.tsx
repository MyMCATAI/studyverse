'use client'

import { useState, useEffect } from 'react'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import StudentActions from '@/components/tutor/StudentActions'
import Dashboard from '@/components/tutor/Dashboard'
import TutorNavbar from '@/components/tutor/TutorNavbar'
import KalypsoChat from '@/components/kalypso/KalypsoChat'
import { Menu } from 'lucide-react'

// Student and session types
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

export default function TutorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<null | Student>(null);
  const [isDashboardActive, setIsDashboardActive] = useState(true);

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

  // Sample student data
  const students: Student[] = [
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
  ];

  // Apply blur effect to main content when sidebar is open
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (isSidebarOpen) {
        mainContent.classList.add('content-blurred');
      } else {
        mainContent.classList.remove('content-blurred');
      }
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle navigation to student profile from Dashboard
  const handleNavigateToStudent = (studentName: string) => {
    // Find the student by name
    const student = students.find(s => s.name === studentName);
    if (student) {
      setSelectedStudent(student);
      setIsDashboardActive(false); // Switch to student view
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Navbar at the top */}
      <TutorNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Menu icon below navbar */}
      <div 
        className="fixed left-4 top-20 z-30 cursor-pointer"
        onMouseEnter={() => setIsSidebarOpen(true)}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <div 
          className="bg-[#10b981] p-2.5 rounded-full shadow-lg transition-all duration-300 
                    hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] 
                    hover:bg-[#059669] group"
          style={{
            boxShadow: '0 0 10px rgba(16,185,129,0.3)'
          }}
        >
          <Menu 
            size={22} 
            className="text-white transition-all duration-300 
                      group-hover:scale-110 menu-pulse" 
            strokeWidth={2.5}
          />
        </div>
      </div>
      
      {/* Sidebar - appears on hover or click */}
      <div 
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-20 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-0'}`}
        onMouseOver={() => setIsSidebarOpen(true)} 
        onMouseLeave={() => setIsSidebarOpen(false)}
        style={{
          backgroundColor: '#ffffff',
          opacity: '1 !important',
          boxShadow: '0 0 1.5rem rgba(10, 22, 70, 0.1)',
        }}
      >
        <div 
          className="h-full w-full pt-8" 
          style={{ 
            backgroundColor: '#ffffff', 
            opacity: 1,
            backdropFilter: 'none'
          }}
        >
          <div className="relative h-full z-10">
            <TutorSidebar 
              onStudentSelect={setSelectedStudent}
              onDashboardToggle={setIsDashboardActive}
              isMobile={true}
            />
          </div>
        </div>
      </div>
      
      {/* Main content area - takes full width with top padding for navbar */}
      <div id="main-content" className="flex-1 flex flex-col h-full pt-16 overflow-auto bg-background">
        {isDashboardActive ? (
          <Dashboard 
            sessions={upcomingSessions} 
            onNavigateToStudent={handleNavigateToStudent}
          />
        ) : (
          <StudentActions 
            selectedStudent={selectedStudent}
          />
        )}
      </div>

      {/* Kalypso Chat Widget - Bottom Right */}
      <KalypsoChat />
    </div>
  );
} 