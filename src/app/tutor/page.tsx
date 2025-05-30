'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import StudentActions from '@/components/tutor/StudentActions'
import Dashboard from '@/components/tutor/Dashboard'
import TutorNavbar from '@/components/tutor/TutorNavbar'
import KalypsoChat, { KalypsoChatRef } from '@/components/kalypso/KalypsoChat'
import { Menu } from 'lucide-react'
import { KalypsoPageContext, WhiteboardBlock, WhiteboardAction } from '@/types/kalypso'
import { Student, StudentHiddenInsights, STUDENTS_DATA } from '@/data/students'

// Student and session types
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

export default function TutorPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const kalypsoChatRef = useRef<KalypsoChatRef>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [focusedSessionId, setFocusedSessionId] = useState<number | null>(null);
  
  // Derive view state from URL path and query parameters
  const { isDashboardActive, selectedStudentId } = useMemo(() => {
    const studentIdParam = searchParams?.get('studentId') || null
    if (pathname === '/tutor' && studentIdParam) {
      const id = parseInt(studentIdParam);
      return { isDashboardActive: false, selectedStudentId: isNaN(id) ? null : id };
    }
    // If on /tutor without studentId, or any other /tutor path (e.g. /tutor/some-other-page considered dashboard for now)
    // or if not on a /tutor path at all (though this component is for /tutor)
    return { isDashboardActive: true, selectedStudentId: null }; 
  }, [pathname, searchParams]);

  // Clear focused session if not on dashboard or if a student is selected via query param
  useEffect(() => {
    if (!isDashboardActive || selectedStudentId !== null) {
        setFocusedSessionId(null);
    }
  }, [isDashboardActive, selectedStudentId]);

  const selectedStudent = useMemo(() => {
    if (selectedStudentId === null) return null;
    return STUDENTS_DATA.find(s => s.id === selectedStudentId) || null;
  }, [selectedStudentId]);

  const [kalypsoPageContext, setKalypsoPageContext] = useState<KalypsoPageContext>(() => {
    const now = new Date();
    return {
      whiteboard: {
        greeting: `Welcome back, Evan!`,
        subtitle: `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
        mainDescription: "Loading page details...",
        blocks: []
      },
      ai: "Evan is currently on the tutor platform."
    };
  });

  const upcomingSessions = UPCOMING_SESSIONS_DATA;
  const students = STUDENTS_DATA;

  // Update Kalypso's page context when view changes (derived from URL or focused session)
  useEffect(() => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    if (isDashboardActive) {
      if (focusedSessionId !== null) {
        const session = upcomingSessions.find(s => s.id === focusedSessionId);
        if (session) {
          const student = students.find(st => st.name === session.studentName);
          // AI context now also includes a hint about hidden insights if they exist.
          let aiContextForFocusedSession = student ? 
            `Evan is focusing on a session with ${student.name} about ${session.topic}. Student Bio: ${student.bio}. Last session summary: ${student.lastSessionSummary || 'N/A'}. Upcoming session on ${session.date} at ${session.time}.`:
            `Evan is focusing on a session about ${session.topic} scheduled on ${session.date} at ${session.time}. Student details not found.`;
          if (student && student.hiddenInsights) {
            aiContextForFocusedSession += ` Confidential insights are also available for ${student.name}. Ask Kalypso to provide an overview and suggest key areas for this session, considering all available information.`;
          }

          // Whiteboard block description remains the same (no hidden insights here)
          const sessionDetailBlocks: WhiteboardBlock[] = [
            {
              id: `focused_session_${session.id}`,
              title: `Details for Session: ${session.studentName} - ${session.topic}`,
              description: `Date: ${session.date}\nTime: ${session.time}\nDuration: ${session.duration}\nStudent: ${session.studentName}\nTopic: ${session.topic}${student ? '\n\nStudent Insights (Public):\n' + student.bio + (student.lastSessionSummary ? '\n\nLast Session: ' + student.lastSessionSummary : '') : ''}`,
              action: student ? { // Add action to navigate to student profile
                text: 'View Student Profile', // Button text (won't be visible if whole block is clickable)
                type: 'callback',
                value: `navigate_student_profile_from_session_${student.id}`
              } : undefined
            },
            { id: 'back_to_sessions_list', title: "View All Upcoming Sessions", description: "Return to the list of all your upcoming sessions.", action: { text: "Back to List", type: 'callback', value: 'clear_focused_session'}}
          ];
          setKalypsoPageContext({
            whiteboard: { greeting: `Focusing on Session with ${session.studentName}`, subtitle: formattedDate, blocks: sessionDetailBlocks },
            ai: aiContextForFocusedSession
          });
        } else {
          setFocusedSessionId(null); // Session not found, clear focus
        }
      } else {
        // Default Dashboard View (list of sessions)
        const dashboardBlocks: WhiteboardBlock[] = upcomingSessions.slice(0, 5).map((session, index) => ({
          id: `session-${session.id}`,
          title: `Session: ${session.studentName} - ${session.topic}`,
          description: `Scheduled for ${session.date} at ${session.time} (${session.duration}).`,
          action: {
            text: 'View Session Details',
            type: 'callback',
            value: `session_details_${session.id}`
          }
        }));
        
        if (upcomingSessions.length === 0) {
          dashboardBlocks.push({
              id: 'no-sessions',
              title: "No Upcoming Sessions",
              description: "Your schedule is clear for now! Consider planning new sessions or reviewing student progress.",
              action: { text: "Go to Calendar", type: "callback", value: "navigate_calendar" }
          });
        }

        setKalypsoPageContext({
          whiteboard: {
            greeting: `Welcome back, Evan!`,
            subtitle: formattedDate,
            mainDescription: `You have ${upcomingSessions.length} upcoming session${upcomingSessions.length !== 1 ? 's' : ''} today. Here are the next few:`, 
            blocks: dashboardBlocks,
          },
          ai: `Evan is viewing the main tutor dashboard. Date: ${formattedDate}. There are ${upcomingSessions.length} upcoming sessions. Key sessions: ${upcomingSessions.slice(0, 2).map(s => `${s.studentName} - ${s.topic}`).join('; ')}. Evan can see an overview of students and schedules.`
        });
      }
    } else if (selectedStudent) { // Now uses derived selectedStudent
      const studentBlocks: WhiteboardBlock[] = [
        {
          id: 'student-summary',
          title: `${selectedStudent.name}'s Current Focus`,
          description: selectedStudent.summary,
          action: { 
            text: 'Get Details on Focus', 
            type: 'callback', 
            value: `student_focus_details_${selectedStudent.id}` 
          }
        },
        {
          id: 'student-progress',
          title: 'Progress Report',
          description: `Current progress is at ${selectedStudent.progress}%. Next session: ${selectedStudent.schedule}.`,
          action: { 
            text: 'Get Detailed Progress', 
            type: 'callback', 
            value: `student_progress_details_${selectedStudent.id}` 
          }
        }
      ];
      let aiContextForStudentProfile = `Evan is viewing the detailed profile for student: ${selectedStudent.name}. Date: ${formattedDate}. Summary: ${selectedStudent.summary}. Progress: ${selectedStudent.progress}%. Bio: ${selectedStudent.bio}. Last Session: ${selectedStudent.lastSessionSummary || 'N/A'}. Evan can click whiteboard blocks to get detailed AI insights on focus or progress.`;
      if (selectedStudent.hiddenInsights) {
        aiContextForStudentProfile += ` Confidential insights for ${selectedStudent.name} are also available and will be used by the AI.`;
      }
      setKalypsoPageContext({
        whiteboard: {
          greeting: `Viewing ${selectedStudent.name}'s Profile`,
          subtitle: formattedDate,
          mainDescription: `Details for ${selectedStudent.name}:`,
          blocks: studentBlocks,
        },
        ai: aiContextForStudentProfile
      });
    } else {
      // This case handles when path is not /tutor and not a valid /tutor/student/:id
      // Or if selectedStudentId from URL doesn't match any student
      setKalypsoPageContext({
        whiteboard: {
          greeting: "Page Not Found",
          subtitle: formattedDate,
          mainDescription: "The requested student or page could not be found. Please check the URL or navigate using the sidebar.",
          blocks: [{id: 'back-to-dash', title: 'Return to Dashboard', description: '', action: {text: 'Go to Dashboard', type: 'callback', value: 'navigate_dashboard'}}]
        },
        ai: "Evan is on an unrecognized tutor page URL. Date: " + formattedDate
      });
    }
  }, [isDashboardActive, selectedStudent, upcomingSessions, focusedSessionId, students]); // Added `students` to dependency array as it's used for AI context

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

  // Navigate to student profile page (used by Dashboard component)
  const handleNavigateToStudent = useCallback((studentName: string) => {
    const studentToNav = students.find(s => s.name === studentName);
    if (studentToNav) {
      router.push(`/tutor?studentId=${studentToNav.id}`);
    }
  }, [router, students]);

  // Helper function to format hidden insights for the AI prompt
  const formatHiddenInsightsForPrompt = (insights: StudentHiddenInsights): string => {
    let insightsText = "\n\n--- Confidential Insights for AI Consideration ---";
    if (insights.recentCommunications && insights.recentCommunications.length > 0) {
      insightsText += "\nRecent Communications:";
      insights.recentCommunications.forEach(comm => { insightsText += `\n- ${comm}`; });
    }
    if (insights.performanceMetrics) {
      insightsText += "\nPerformance Metrics:";
      if (insights.performanceMetrics.latestMCATScore) {
        const mcat = insights.performanceMetrics.latestMCATScore;
        insightsText += `\n  - Latest MCAT Score: ${mcat.score} (on ${mcat.date})${mcat.trend ? `, Trend: ${mcat.trend}` : ''}`;
      }
      if (insights.performanceMetrics.strengths && insights.performanceMetrics.strengths.length > 0) {
        insightsText += `\n  - Strengths: ${insights.performanceMetrics.strengths.join(', ')}`;
      }
      if (insights.performanceMetrics.areasForImprovement && insights.performanceMetrics.areasForImprovement.length > 0) {
        insightsText += `\n  - Areas for Improvement: ${insights.performanceMetrics.areasForImprovement.join(', ')}`;
      }
    }
    if (insights.personalNotes && insights.personalNotes.length > 0) {
      insightsText += "\nPersonal Notes:";
      insights.personalNotes.forEach(note => { insightsText += `\n- ${note}`; });
    }
    insightsText += "\n---------------------------------------------";
    return insightsText;
  };

  // Callback handler for whiteboard actions
  const handleWhiteboardAction = useCallback((action: WhiteboardAction) => {
    console.log("Whiteboard action triggered:", action);
    if (action.type === 'callback') {
      if (action.value.startsWith('session_details_')) {
        const sessionId = parseInt(action.value.replace('session_details_', ''));
        setFocusedSessionId(sessionId);
        const session = UPCOMING_SESSIONS_DATA.find(s => s.id === sessionId);
        const student = session ? STUDENTS_DATA.find(st => st.name === session.studentName) : null;
        if (session && student && kalypsoChatRef.current) {
          kalypsoChatRef.current.clearChatHistory();
          let prompt = `I'm about to have a session with ${student.name} on ${session.topic} (${session.date} at ${session.time}). \nBackground on ${student.name}: ${student.bio}. \nLast session covered: ${student.lastSessionSummary || 'N/A'}.`;
          if (student.hiddenInsights) {
            prompt += formatHiddenInsightsForPrompt(student.hiddenInsights);
          }
          prompt += `\n\nFor the upcoming session on ${session.topic}, what are the key focus areas or discussion points based on ALL available information? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          kalypsoChatRef.current.sendAutomatedMessage(prompt);
        }
      } else if (action.value === 'clear_focused_session') {
        setFocusedSessionId(null);
      } else if (action.value.startsWith('navigate_student_profile_from_session_')) {
        const studentId = parseInt(action.value.replace('navigate_student_profile_from_session_', ''));
        router.push(`/tutor?studentId=${studentId}`);
        setFocusedSessionId(null);
      } else if (action.value.startsWith('navigate_student_profile_')) {
        const studentId = parseInt(action.value.replace('navigate_student_profile_', ''));
        router.push(`/tutor?studentId=${studentId}`);
      } else if (action.value.startsWith('student_focus_details_')) {
        const studentId = parseInt(action.value.replace('student_focus_details_', ''));
        const student = STUDENTS_DATA.find(s => s.id === studentId);
        if (student && kalypsoChatRef.current) {
          kalypsoChatRef.current.clearChatHistory();
          let prompt = `Tell me more about ${student.name}'s current academic focus. \nKey info: ${student.summary}. \nBio: ${student.bio}. \nLast session: ${student.lastSessionSummary || 'N/A'}.`;
          if (student.hiddenInsights) {
            prompt += formatHiddenInsightsForPrompt(student.hiddenInsights);
          }
          prompt += `\n\nBased on all this, what are the most critical areas ${student.name} is working on, any specific challenges, and recent points of discussion or concern? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          kalypsoChatRef.current.sendAutomatedMessage(prompt);
        }
      } else if (action.value.startsWith('student_progress_details_')) {
        const studentId = parseInt(action.value.replace('student_progress_details_', ''));
        const student = STUDENTS_DATA.find(s => s.id === studentId);
        if (student && kalypsoChatRef.current) {
          kalypsoChatRef.current.clearChatHistory();
          let prompt = `Provide a detailed progress report for ${student.name}. \nOverall progress: ${student.progress}%. \nNext session: ${student.schedule}. \nLast session summary: ${student.lastSessionSummary || 'N/A'}.`;
          if (student.hiddenInsights) {
            prompt += formatHiddenInsightsForPrompt(student.hiddenInsights);
          }
          prompt += `\n\nSynthesize this into a progress overview. What are current trends, key strengths, and areas needing urgent attention? Provide a CONCISE, plain text response. Do NOT use markdown.`;
          kalypsoChatRef.current.sendAutomatedMessage(prompt);
        }
      } else if (action.value === 'navigate_calendar') {
        alert("Placeholder: Navigate to Calendar page (e.g., /calendar)");
      } else if (action.value === 'navigate_dashboard'){
        router.push('/tutor');
      }
    }
  }, [router, students, kalypsoChatRef]); // Added kalypsoChatRef to dependencies
  
  // Functions to be passed to TutorSidebar for navigation
  const navigateToDashboard = useCallback(() => {
    setFocusedSessionId(null); // Clear focused session when navigating to dashboard via sidebar
    router.push('/tutor');
  }, [router]);
  const navigateToStudentInSidebar = useCallback((studentId: number | null) => {
    setFocusedSessionId(null); 
    if (studentId !== null) {
        router.push(`/tutor?studentId=${studentId}`); 
    } else {
        router.push('/tutor'); // Navigate to dashboard if studentId is null (deselect)
    }
  }, [router]);

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
              students={students}
              onStudentSelect={navigateToStudentInSidebar}
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
        ) : selectedStudent ? (
          <StudentActions 
            selectedStudent={selectedStudent}
          />
        ) : (
          <div className="p-6 text-center">
            <h1 className="text-xl">Student not found</h1>
            <p>The selected student could not be found. Please select a student from the sidebar or return to the dashboard.</p>
            <button onClick={navigateToDashboard} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Go to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Kalypso Chat Widget - Bottom Right */}
      <KalypsoChat 
        ref={kalypsoChatRef}
        pageContext={kalypsoPageContext} 
        userName="Evan"
        userRole="tutor"
        onWhiteboardAction={handleWhiteboardAction}
      />
    </div>
  );
} 