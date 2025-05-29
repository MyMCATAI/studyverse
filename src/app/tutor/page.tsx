'use client'

import { useState, useEffect, useCallback } from 'react'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import StudentActions from '@/components/tutor/StudentActions'
import Dashboard from '@/components/tutor/Dashboard'
import TutorNavbar from '@/components/tutor/TutorNavbar'
import KalypsoChat from '@/components/kalypso/KalypsoChat'
import { Menu } from 'lucide-react'
import { KalypsoPageContext, WhiteboardContext, WhiteboardBlock, WhiteboardAction } from '@/types/kalypso'

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

// --- DEFINE STATIC DATA OUTSIDE THE COMPONENT ---
const UPCOMING_SESSIONS_DATA: Session[] = [
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

const STUDENTS_DATA: Student[] = [
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
// --- END OF STATIC DATA DEFINITION ---

export default function TutorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<null | Student>(null);
  const [isDashboardActive, setIsDashboardActive] = useState(true);
  const [kalypsoPageContext, setKalypsoPageContext] = useState<KalypsoPageContext>(() => {
    const now = new Date();
    return {
      whiteboard: {
        greeting: `Welcome back, Evan!`,
        subtitle: `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        mainDescription: "Loading your dashboard details...",
        blocks: []
      },
      ai: "Evan is currently on the tutor platform."
    };
  });

  // Use the stable references from outside the component
  const upcomingSessions = UPCOMING_SESSIONS_DATA;
  const students = STUDENTS_DATA;

  // Update Kalypso's page context when view changes
  useEffect(() => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    if (isDashboardActive) {
      const dashboardBlocks: WhiteboardBlock[] = upcomingSessions.slice(0, 3).map((session, index) => ({
        id: `session-${session.id}`,
        title: `Session: ${session.studentName} - ${session.topic}`,
        description: `Scheduled for ${session.date} at ${session.time} (${session.duration}).\nThis is block ${index + 1} for the dashboard view.`,
        action: {
          text: 'View Session Details',
          type: 'callback', // Or 'link' if you have a direct URL: e.g., `/tutor/sessions/${session.id}`
          value: `session_details_${session.id}`
        }
      }));
      
      if (upcomingSessions.length === 0) {
        dashboardBlocks.push({
            id: 'no-sessions',
            title: "No Upcoming Sessions",
            description: "Your schedule is clear for now! Consider planning new sessions or reviewing student progress.",
            action: {
                text: "Go to Calendar",
                type: "callback", // or link to /calendar
                value: "navigate_calendar"
            }
        });
      }

      setKalypsoPageContext({
        whiteboard: {
          greeting: `Welcome back, Evan!`,
          subtitle: formattedDate,
          mainDescription: `You have ${upcomingSessions.length} upcoming session${upcomingSessions.length !== 1 ? 's' : ''}. Here are the next few:`, 
          blocks: dashboardBlocks,
        },
        ai: `Evan is viewing the main tutor dashboard. Date: ${formattedDate}. There are ${upcomingSessions.length} upcoming sessions. Key sessions: ${upcomingSessions.slice(0, 2).map(s => `${s.studentName} - ${s.topic}`).join('; ')}. Evan can see an overview of students and schedules.`
      });
    } else if (selectedStudent) {
      const studentBlocks: WhiteboardBlock[] = [
        {
          id: 'student-summary',
          title: `${selectedStudent.name}'s Current Focus`,
          description: selectedStudent.summary,
          action: { text: 'View Full Profile', type: 'callback', value: `navigate_student_${selectedStudent.id}` }
        },
        {
          id: 'student-progress',
          title: 'Progress Report',
          description: `Current progress is at ${selectedStudent.progress}%. Next session: ${selectedStudent.schedule}.`,
          action: { text: 'Update Progress', type: 'callback', value: `update_progress_${selectedStudent.id}` }
        }
      ];
      setKalypsoPageContext({
        whiteboard: {
          greeting: `Viewing ${selectedStudent.name}'s Profile`,
          subtitle: formattedDate,
          mainDescription: `Details for ${selectedStudent.name}:`,
          blocks: studentBlocks,
        },
        ai: `Evan is viewing the detailed profile for student: ${selectedStudent.name}. Date: ${formattedDate}. Summary: ${selectedStudent.summary}. Progress: ${selectedStudent.progress}%. Next session: ${selectedStudent.schedule}. Evan might be looking to understand this student's needs, plan a session, or update their information.`
      });
    } else {
      setKalypsoPageContext({
        whiteboard: {
          greeting: "Tutor Platform",
          subtitle: formattedDate,
          mainDescription: "Please select a student or navigate to the dashboard.",
          blocks: []
        },
        ai: "Evan is on the tutor page, but no specific view (dashboard or student) is active. Date: " + formattedDate
      });
    }
  }, [isDashboardActive, selectedStudent, upcomingSessions]); // Add upcomingSessions to dependencies

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
    const student = students.find(s => s.name === studentName);
    if (student) {
      setSelectedStudent(student);
      setIsDashboardActive(false);
    }
  };

  // Callback handler for whiteboard actions
  const handleWhiteboardAction = useCallback((action: WhiteboardAction) => {
    console.log("Whiteboard action triggered:", action);
    if (action.type === 'callback') {
      if (action.value.startsWith('session_details_')) {
        const sessionId = action.value.replace('session_details_', '');
        // TODO: Implement navigation or modal display for session details
        alert(`Placeholder: View details for session ID: ${sessionId}`);
      } else if (action.value.startsWith('navigate_student_')) {
        const studentId = parseInt(action.value.replace('navigate_student_', ''));
        const student = students.find(s => s.id === studentId);
        if (student) {
            setSelectedStudent(student);
            setIsDashboardActive(false);
        }
      } else if (action.value === 'navigate_calendar') {
        // TODO: Implement navigation to a calendar page if it exists
        alert("Placeholder: Navigate to Calendar page");
      } else if (action.value.startsWith('update_progress_')) {
        const studentId = action.value.replace('update_progress_', '');
        alert(`Placeholder: Update progress for student ID: ${studentId}`);
      }
      // Add more callback handling as needed
    }
    // Link actions are handled directly by KalypsoWhiteboardMessage
  }, [students]); // Ensure `students` is in dependency array if used like this

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
          className="bg-blue-500 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] hover:bg-blue-600 group"
          style={{ boxShadow: '0 0 10px rgba(59,130,246,0.3)' }}
        >
          <Menu size={22} className="text-white transition-all duration-300 group-hover:scale-110 menu-pulse" strokeWidth={2.5}/>
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
      <KalypsoChat 
        pageContext={kalypsoPageContext} 
        tutorName="Evan" 
        onWhiteboardAction={handleWhiteboardAction}
      />
    </div>
  );
} 