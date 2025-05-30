import React, { useState, useEffect, useRef } from 'react';
import SessionCard from './SessionCard';
import TestCalendar from '@/components/calendar/TestCalendar';
import { CalendarEvent } from '@/types/calendar';
import { Plus, GripVertical, CalendarIcon, ClipboardList, Trash2, BarChart, Pen, RotateCw, MessageSquare, FileText, Clock, BookOpen } from 'lucide-react';
import TutoringSessionModal from '@/components/calendar/TutoringSessionModal';

interface Session {
  id: number;
  studentName: string;
  date: string;
  time: string;
  duration: string;
  topic: string;
}

interface Report {
  id: string;
  studentName: string;
  title: string;
  dueDate?: string; // For upcoming reports
  submittedDate?: string; // For completed reports
  status: 'upcoming' | 'completed';
  feedback?: string;
}

interface DashboardProps {
  sessions: Session[];
  onNavigateToStudent?: (studentName: string) => void;
}

export default function Dashboard({ sessions: initialSessions, onNavigateToStudent }: DashboardProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2025, 4, 1)); // Set to May 2025
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [studentCalendarEvents, setStudentCalendarEvents] = useState<CalendarEvent[]>([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tutoring' | 'student'>('tutoring');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const isUpdatingEventsRef = useRef(false);
  const [selectedSessionEvent, setSelectedSessionEvent] = useState<CalendarEvent | null>(null);
  const [isTutoringSessionModalOpen, setIsTutoringSessionModalOpen] = useState(false);

  // Sample tutoring sessions if none provided
  // Initial sessions (existing ones) 
  const initialSessionsData = initialSessions && initialSessions.length > 0 ? initialSessions : [
    {
      id: 1,
      studentName: "Emma Thompson",
      date: "Monday, May 20",
      time: "9:00 AM",
      duration: "60 minutes",
      topic: "MCAT Organic Chemistry Review"
    },
    {
      id: 2,
      studentName: "James Wilson",
      date: "Tuesday, May 21",
      time: "3:30 PM",
      duration: "90 minutes",
      topic: "MCAT Physics & Math Skills"
    },
    {
      id: 3,
      studentName: "Sarah Chen", 
      date: "Wednesday, May 22",
      time: "11:00 AM",
      duration: "60 minutes",
      topic: "CARS Strategy & Practice"
    },
    {
      id: 4,
      studentName: "Michael Rodriguez",
      date: "Thursday, May 23",
      time: "2:00 PM", 
      duration: "90 minutes",
      topic: "Psychology & Sociology Content"
    },
    {
      id: 5,
      studentName: "Emma Thompson",
      date: "Friday, May 24",
      time: "10:00 AM",
      duration: "60 minutes", 
      topic: "Biochemistry Metabolic Pathways"
    }
  ];
  
  // May 2025 Tutoring Sessions - 3 per week from May 4-31
  const may2025Sessions = [
    // Week 1 (May 4-10)
    {
      id: 101,
      studentName: "Emma Thompson",
      date: "Monday, May 5, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      topic: "Enzyme Kinetics & Inhibition"
    },
    {
      id: 102,
      studentName: "James Wilson",
      date: "Wednesday, May 7, 2025",
      time: "2:00 PM",
      duration: "90 minutes",
      topic: "Fluid Dynamics & Circulatory System"
    },
    {
      id: 103,
      studentName: "Sarah Chen",
      date: "Friday, May 9, 2025",
      time: "11:30 AM",
      duration: "60 minutes",
      topic: "CARS Passage Analysis Strategies"
    },
    
    // Week 2 (May 11-17)
    {
      id: 104,
      studentName: "Michael Rodriguez",
      date: "Monday, May 12, 2025",
      time: "3:00 PM",
      duration: "90 minutes",
      topic: "Neuroanatomy & Brain Functions"
    },
    {
      id: 105,
      studentName: "Emma Thompson",
      date: "Wednesday, May 14, 2025",
      time: "9:30 AM",
      duration: "60 minutes",
      topic: "Organic Chemistry Reactions"
    },
    {
      id: 106,
      studentName: "James Wilson",
      date: "Friday, May 16, 2025",
      time: "4:00 PM",
      duration: "90 minutes",
      topic: "Thermodynamics & Electrochemistry"
    },
    
    // Week 3 (May 18-24)
    {
      id: 107,
      studentName: "Sarah Chen",
      date: "Tuesday, May 20, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      topic: "Immune System & Inflammation"
    },
    {
      id: 108,
      studentName: "Michael Rodriguez",
      date: "Thursday, May 22, 2025",
      time: "1:00 PM",
      duration: "90 minutes",
      topic: "Endocrine System & Homeostasis"
    },
    {
      id: 109,
      studentName: "Emma Thompson",
      date: "Saturday, May 24, 2025",
      time: "11:00 AM",
      duration: "60 minutes",
      topic: "Molecular Genetics & DNA Replication"
    },
    
    // Week 4 (May 25-31)
    {
      id: 110,
      studentName: "James Wilson",
      date: "Monday, May 26, 2025",
      time: "2:30 PM",
      duration: "90 minutes",
      topic: "Quantum Mechanics & Atomic Structure"
    },
    {
      id: 111,
      studentName: "Sarah Chen",
      date: "Wednesday, May 28, 2025",
      time: "10:30 AM",
      duration: "60 minutes",
      topic: "CARS Timing & Question Strategies"
    },
    {
      id: 112,
      studentName: "Michael Rodriguez",
      date: "Friday, May 30, 2025",
      time: "3:30 PM",
      duration: "90 minutes",
      topic: "Social Psychology & Behavior"
    }
  ];

  // June 2025 Tutoring Sessions - 3 per week from June 1-28
  const june2025Sessions = [
    // Week 1 (June 1-7)
    {
      id: 201,
      studentName: "Emma Thompson",
      date: "Monday, June 2, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      topic: "Biochemistry Review & Practice"
    },
    {
      id: 202,
      studentName: "James Wilson",
      date: "Wednesday, June 4, 2025",
      time: "2:00 PM",
      duration: "90 minutes",
      topic: "Physics Practice Problems"
    },
    {
      id: 203,
      studentName: "Sarah Chen",
      date: "Friday, June 6, 2025",
      time: "11:30 AM",
      duration: "60 minutes",
      topic: "CARS Full Length Practice"
    },
    
    // Week 2 (June 8-14)
    {
      id: 204,
      studentName: "Michael Rodriguez",
      date: "Monday, June 9, 2025",
      time: "3:00 PM",
      duration: "90 minutes",
      topic: "Biology Systems Review"
    },
    {
      id: 205,
      studentName: "Emma Thompson",
      date: "Wednesday, June 11, 2025",
      time: "9:30 AM",
      duration: "60 minutes",
      topic: "Chemistry Practice Questions"
    },
    {
      id: 206,
      studentName: "James Wilson",
      date: "Friday, June 13, 2025",
      time: "4:00 PM",
      duration: "90 minutes",
      topic: "Physics & Math Review"
    },
    
    // Week 3 (June 15-21)
    {
      id: 207,
      studentName: "Sarah Chen",
      date: "Tuesday, June 17, 2025",
      time: "10:00 AM",
      duration: "60 minutes",
      topic: "CARS Strategy Review"
    },
    {
      id: 208,
      studentName: "Michael Rodriguez",
      date: "Thursday, June 19, 2025",
      time: "1:00 PM",
      duration: "90 minutes",
      topic: "Psychology & Sociology Practice"
    },
    {
      id: 209,
      studentName: "Emma Thompson",
      date: "Saturday, June 21, 2025",
      time: "11:00 AM",
      duration: "60 minutes",
      topic: "Biology Practice Questions"
    },
    
    // Week 4 (June 22-28)
    {
      id: 210,
      studentName: "James Wilson",
      date: "Monday, June 23, 2025",
      time: "2:30 PM",
      duration: "90 minutes",
      topic: "Physics & Chemistry Review"
    },
    {
      id: 211,
      studentName: "Sarah Chen",
      date: "Wednesday, June 25, 2025",
      time: "10:30 AM",
      duration: "60 minutes",
      topic: "CARS Full Length Practice"
    },
    {
      id: 212,
      studentName: "Michael Rodriguez",
      date: "Friday, June 27, 2025",
      time: "3:30 PM",
      duration: "90 minutes",
      topic: "Psychology & Sociology Review"
    }
  ];
  // Combine existing and new May 2025 sessions
  const [sessions, setSessions] = useState<Session[]>([...initialSessionsData, ...may2025Sessions, ...june2025Sessions]);

  // Sample student data with enhanced color coding
  const students = [
    { 
      id: '1', 
      name: 'Emma Thompson', 
      color: '--theme-info-bg', // Keep for backward compatibility
      colorVars: {
        bg: 'var(--theme-info-bg)',
        border: 'var(--theme-info-border)',
        text: 'var(--theme-info-text)'
      } 
    },
    { 
      id: '2', 
      name: 'James Wilson', 
      color: '--theme-success-bg', // Keep for backward compatibility
      colorVars: {
        bg: 'var(--theme-success-bg)',
        border: 'var(--theme-success-border)',
        text: 'var(--theme-success-text)'
      } 
    },
    { 
      id: '3', 
      name: 'Sarah Chen', 
      color: '--theme-warning-bg', // Keep for backward compatibility
      colorVars: {
        bg: 'var(--theme-warning-bg)',
        border: 'var(--theme-warning-border)',
        text: 'var(--theme-warning-text)'
      } 
    },
    { 
      id: '4', 
      name: 'Michael Rodriguez', 
      color: '--theme-accent-bg', // Keep for backward compatibility
      colorVars: {
        bg: 'var(--theme-accent-bg)',
        border: 'var(--theme-accent-border)',
        text: 'var(--theme-accent-text)'
      } 
    },
  ];

  // Sample student exam data
  const studentExams = {
    '1': [ // Emma Thompson's exams
      {
        id: 'emma-exam-1',
        title: 'MCAT Full Length Practice Test 1',
        start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'mcat', 
          studentName: 'Emma Thompson',
          activityTitle: 'MCAT Full Length Practice Test 1',
          activityText: 'AAMC FL1',
          examType: 'FL',
          examNumber: '1',
          status: 'Upcoming',
          hours: 7.5
        }
      },
      {
        id: 'emma-exam-2',
        title: 'CARS Section Practice',
        start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'section', 
          studentName: 'Emma Thompson',
          activityTitle: 'CARS Section Practice',
          subject: 'CARS',
          status: 'Upcoming',
          hours: 2
        }
      }
    ],
    '2': [ // James Wilson's exams
      {
        id: 'james-exam-1',
        title: 'MCAT Full Length Practice Test 2',
        start: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        end: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'mcat', 
          studentName: 'James Wilson',
          activityTitle: 'MCAT Full Length Practice Test 2',
          activityText: 'Blueprint FL2',
          examType: 'FL',
          examNumber: '2',
          status: 'Upcoming',
          hours: 7.5
        }
      },
      {
        id: 'james-exam-2',
        title: 'Chemical & Physical Foundations Practice',
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'section', 
          studentName: 'James Wilson',
          activityTitle: 'CP Section Practice',
          subject: 'Chemical & Physical Foundations',
          status: 'Upcoming',
          hours: 2
        }
      }
    ],
    '3': [ // Sarah Chen's exams
      {
        id: 'sarah-exam-1',
        title: 'Biological Foundations Content Review',
        start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'content', 
          studentName: 'Sarah Chen',
          activityTitle: 'Biological Foundations Content Review',
          subject: 'Biochemistry & Cell Biology',
          status: 'Upcoming',
          hours: 3
        }
      },
      {
        id: 'sarah-exam-2',
        title: 'MCAT Question Bank - CARS',
        start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'drill', 
          studentName: 'Sarah Chen',
          activityTitle: 'MCAT Question Bank - CARS',
          subject: 'CARS',
          status: 'Upcoming',
          hours: 1.5
        }
      }
    ],
    '4': [ // Michael Rodriguez's exams
      {
        id: 'michael-exam-1',
        title: 'MCAT Full Length Practice Test 3',
        start: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'mcat', 
          studentName: 'Michael Rodriguez',
          activityTitle: 'MCAT Full Length Practice Test 3',
          activityText: 'AAMC FL3',
          examType: 'FL',
          examNumber: '3',
          status: 'Upcoming',
          hours: 7.5
        }
      },
      {
        id: 'michael-exam-2',
        title: 'Psychological & Social Foundations Review',
        start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        allDay: true,
        resource: { 
          eventType: 'content', 
          studentName: 'Michael Rodriguez',
          activityTitle: 'Psychological & Social Foundations Review',
          subject: 'Psychology & Sociology',
          status: 'Upcoming',
          hours: 2.5
        }
      }
    ]
  };

  // Add this line after studentExams definition
  const studentExamsRef = useRef(studentExams);

  // Sample report data
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      studentName: 'Emma Thompson',
      title: 'Weekly MCAT Progress Report',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'upcoming'
    },
    {
      id: '2',
      studentName: 'James Wilson',
      title: 'MCAT Full Length Analysis',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'upcoming'
    },
    {
      id: '3',
      studentName: 'Sarah Chen',
      title: 'CARS Section Performance',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'upcoming'
    },
    {
      id: '4',
      studentName: 'Michael Rodriguez',
      title: 'Biological Sciences Review Feedback',
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'completed',
      feedback: 'Excellent progress on biochemistry content mastery. Recommend more practice with amino acid structures and metabolic pathways.'
    },
    {
      id: '5',
      studentName: 'Emma Thompson',
      title: 'MCAT Study Schedule Evaluation',
      submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'completed',
      feedback: 'Strong understanding of core concepts. Focus needed on CARS timing and passage analysis. Consider adjusting schedule to dedicate more time to practice passages.'
    }
  ]);

  useEffect(() => {
    // Convert sessions to calendar events
    const events: CalendarEvent[] = sessions.map(session => {
      // Parse date and time strings - handle different date formats
      let eventDate: Date;
      
      if (session.date.includes("2025")) {
        // Parse date format with year "Day, Month DD, YYYY"
        const dateParts = session.date.match(/(\w+), (\w+) (\d+), (\d+)/);
        if (dateParts) {
          const [_, dayOfWeek, month, day, year] = dateParts;
          const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
          eventDate = new Date(parseInt(year), monthIndex, parseInt(day));
        } else {
          eventDate = new Date(); // Fallback
        }
      } else {
        // Parse original format "Day, Month DD"
        const [dayOfWeek, monthDay] = session.date.split(', ');
        eventDate = new Date();
      // Set day of week (this is simplified - in a real app, you'd use a proper date library)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOffset = daysOfWeek.indexOf(dayOfWeek) - eventDate.getDay();
      eventDate.setDate(eventDate.getDate() + dayOffset);
      }
      
      // Parse time
      const [hours, minutes] = session.time.split(':');
      const isPM = session.time.toLowerCase().includes('pm');
      const hourValue = parseInt(hours);
      const hourIn24 = isPM && hourValue < 12 ? hourValue + 12 : hourValue;
      
      // Set time
      eventDate.setHours(hourIn24, parseInt(minutes.split(' ')[0]), 0);
      
      // Parse duration
      const [durationValue, durationUnit] = session.duration.split(' ');
      
      // Calculate end time based on duration
      const endDate = new Date(eventDate);
      endDate.setMinutes(endDate.getMinutes() + parseInt(durationValue));
      
      return {
        id: session.id.toString(),
        title: `${session.studentName} - ${session.topic}`,
        start: eventDate,
        end: endDate,
        resource: {
          eventType: 'session',
          activityTitle: session.topic,
          status: 'Upcoming',
          hours: parseInt(durationValue) / 60,
          studentName: session.studentName
        }
      };
    });
    
    // Add some example reports as calendar events
    const upcomingReports = reports.filter(report => report.status === 'upcoming');
    
    upcomingReports.forEach(report => {
      if (report.dueDate) {
        const parts = report.dueDate.split('/');
        const reportDate = new Date(
          parseInt(parts[2]), 
          parseInt(parts[0]) - 1, 
          parseInt(parts[1])
        );
        
        events.push({
          id: `report-${report.id}`,
          title: `Report: ${report.title}`,
          start: reportDate,
          end: reportDate,
          resource: {
            eventType: 'report',
            activityTitle: report.title,
            status: 'Due',
            studentName: report.studentName
          }
        });
      }
    });
    
    setCalendarEvents(events);
  }, [sessions, reports]);

  // Initialize student calendar events from exam data
  useEffect(() => {
    try {
      // Skip if we already have events loaded
      if (studentCalendarEvents.length > 0) {
        console.log('Student calendar events already loaded, skipping initialization');
        return;
      }
      
      console.log('Initializing student calendar events');
      // Use the ref instead of direct reference
      const allStudentEvents = Object.values(studentExamsRef.current).flat();
      
      // Add student colors to the exam events
      const coloredStudentEvents = allStudentEvents.map(event => {
        const studentName = event.resource?.studentName || '';
        const student = students.find(s => studentName.includes(s.name));
        
        if (student && student.colorVars) {
          return {
            ...event,
            color: student.colorVars
          };
        }
        return event;
      });
      
      setStudentCalendarEvents(coloredStudentEvents);
    } catch (error) {
      console.error('Error initializing student events:', error);
      setStudentCalendarEvents([]);
    }
  // Run only once on mount with an empty dependency array
  }, [students]); // Add students dependency to ensure we have colors available

  // Main effect for calendar event generation based on view mode and selected students
  useEffect(() => {
    // Skip if already processing an update to prevent loops
    if (isUpdatingEventsRef.current) {
      console.log('Skipping duplicate event generation - update already in progress');
      return;
    }
    
    try {
      isUpdatingEventsRef.current = true;
      console.log(`Generating calendar events. View mode: ${viewMode}, Selected students: ${selectedStudents.length}`);
      
      // Create the base tutoring session events
      const tutoringEvents = sessions.map((session, index) => {
        // Parse the session date
        let sessionDate: Date;
        
        try {
          if (session.date.includes("2025")) {
            const dateParts = session.date.match(/(\w+), (\w+) (\d+), (\d+)/);
            if (dateParts) {
              const [_, dayOfWeek, month, day, year] = dateParts;
              const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
              sessionDate = new Date(parseInt(year), monthIndex, parseInt(day));
            } else {
              sessionDate = new Date(); // Fallback
            }
          } else {
            sessionDate = new Date(); // Fallback
          }
        } catch (parseError) {
          console.error('Error parsing session date:', parseError);
          sessionDate = new Date();
        }
        
        // Parse time
        let start = new Date(sessionDate);
        let end = new Date(sessionDate);
        
        try {
          const timeParts = session.time.split(':');
          const hourPart = parseInt(timeParts[0]);
          const minutePart = parseInt(timeParts[1]?.split(' ')[0] || '0');
          const isPM = session.time.toLowerCase().includes('pm');
          const hour24 = isPM && hourPart < 12 ? hourPart + 12 : hourPart;
          
          // Set time
          start.setHours(hour24, minutePart, 0);
          
          // Calculate end time (add duration)
          const durationMinutes = parseInt(session.duration.split(' ')[0] || '60');
          end = new Date(start);
          end.setMinutes(end.getMinutes() + durationMinutes);
        } catch (timeError) {
          console.error('Error parsing session time:', timeError);
          // Use default one hour duration
          end.setHours(start.getHours() + 1);
        }
        
        return {
          id: `session-${index}`,
          title: `${session.studentName} - ${session.topic}`,
          start,
          end,
          // Use consistent color for all tutoring sessions instead of student-specific colors
          color: {
            bg: 'var(--primary)',
            border: 'var(--secondary)',
            text: 'var(--theme-hover-text)'
          },
          resource: {
            studentName: session.studentName,
            eventType: 'session',  // Mark explicitly as a tutoring session
            topic: session.topic,
            duration: session.duration,
            status: 'upcoming'
          }
        };
      });
      
      // Get student events for selected students
      let visibleStudentEvents: CalendarEvent[] = [];
      
      if (viewMode === 'student') {
        // Only include student events in student view mode
        if (selectedStudents.length > 0) {
          visibleStudentEvents = studentCalendarEvents.filter(event => {
            const eventStudentName = event.resource?.studentName || '';
            return students.some(student => 
              selectedStudents.includes(student.id) && 
              eventStudentName.includes(student.name)
            );
          }).map(event => {
            // Find matching student for this event
            const studentName = event.resource?.studentName || '';
            const student = students.find(s => studentName.includes(s.name));
            
            // Add color if found student
            if (student && student.colorVars) {
              return {
                ...event,
                color: student.colorVars
              };
            }
            return event;
          });
        } else {
          // If no students selected, show all student events with their colors
          visibleStudentEvents = studentCalendarEvents.map(event => {
            const studentName = event.resource?.studentName || '';
            const student = students.find(s => studentName.includes(s.name));
            
            if (student && student.colorVars) {
              return {
                ...event,
                color: student.colorVars
              };
            }
            return event;
          });
        }
      }
      
      // Choose which events to display based on view mode
      const displayEvents = viewMode === 'tutoring' 
        ? [...tutoringEvents] // Only tutoring sessions in tutoring mode
        : [...visibleStudentEvents]; // Only student events in student mode
      
      // Check if the events list would actually change before updating state
      const eventsChanged = 
        calendarEvents.length !== displayEvents.length ||
        JSON.stringify(displayEvents.map(e => e.id).sort()) !== 
        JSON.stringify(calendarEvents.map(e => e.id).sort());
      
      if (eventsChanged) {
        console.log(`Setting ${displayEvents.length} events (${tutoringEvents.length} tutoring, ${visibleStudentEvents.length} student events)`);
        setCalendarEvents(displayEvents);
      } else {
        console.log('Events list unchanged, skipping update');
      }
    } catch (error) {
      console.error('Error generating calendar events:', error);
    } finally {
      // Always reset the ref when done
      isUpdatingEventsRef.current = false;
    }
  }, [viewMode, selectedStudents, sessions, studentCalendarEvents, students]);

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    console.log('Selected event:', event);
    // You can implement event details view here
  };
  
  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
  };
  
  const handleStudentsChange = (studentIds: string[]) => {
    setSelectedStudents(studentIds);
  };
  
  const handleViewModeChange = (mode: 'tutoring' | 'student') => {
    try {
      // Skip if we're already in this mode to avoid unnecessary rerenders
      if (viewMode === mode) {
        console.log(`Already in ${mode} mode, skipping update`);
        return;
      }
      
      console.log(`Changing view mode to: ${mode}`);
      
      // Update the view mode
      setViewMode(mode);
      
      // If switching to student mode and no students are selected, select the first one
      if (mode === 'student') {
        if (selectedStudents.length === 0 && students.length > 0) {
          console.log('No students selected in student mode, selecting first student');
          setSelectedStudents([students[0].id]);
        }
      }
    } catch (error) {
      console.error('Error changing view mode:', error);
    }
  };


  // Filter upcoming sessions (only those in the future)
  const upcomingSessions = sessions.filter(session => {
    // Parse the session date
    let sessionDate: Date;

    if (session.date.includes("2025")) {
      // Parse date format with year "Day, Month DD, YYYY"
      const dateParts = session.date.match(/(\w+), (\w+) (\d+), (\d+)/);
      if (dateParts) {
        const [_, dayOfWeek, month, day, year] = dateParts;
        const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
        sessionDate = new Date(parseInt(year), monthIndex, parseInt(day));
      } else {
        sessionDate = new Date(); // Fallback
        return false;
      }
    } else {
      // For sessions without a year, we'll assume they're past
      return false;
    }

    // Parse time
    const [hours, minutes] = session.time.split(':');
    const isPM = session.time.toLowerCase().includes('pm');
    const hourValue = parseInt(hours);
    const hourIn24 = isPM && hourValue < 12 ? hourValue + 12 : hourValue;

    // Set time
    sessionDate.setHours(hourIn24, parseInt(minutes.split(' ')[0]), 0, 0); // Set seconds and ms to 0

    // Get current date in EST and set to start of day
    const nowEST = new Date(new Date().toLocaleString("en-US", {timeZone: "America/New_York"}));
    const startOfTodayEST = new Date(nowEST);
    startOfTodayEST.setHours(0, 0, 0, 0);

    // Check if the session is today or in the future
    return sessionDate >= startOfTodayEST;
  });

  const upcomingReports = reports.filter(report => report.status === 'upcoming');
  const completedReports = reports.filter(report => report.status === 'completed');

  // Helper function to convert a session to a calendar event
  const convertSessionToCalendarEvent = (session: Session, index: number): CalendarEvent => {
    // Parse the session date
    let sessionDate: Date;
    
    try {
      if (session.date.includes("2025")) {
        const dateParts = session.date.match(/(\w+), (\w+) (\d+), (\d+)/);
        if (dateParts) {
          const [_, dayOfWeek, month, day, year] = dateParts;
          const monthIndex = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(month);
          sessionDate = new Date(parseInt(year), monthIndex, parseInt(day));
        } else {
          sessionDate = new Date(); // Fallback
        }
      } else {
        sessionDate = new Date(); // Fallback
      }
    } catch (parseError) {
      console.error('Error parsing session date:', parseError);
      sessionDate = new Date();
    }
    
    // Parse time
    let start = new Date(sessionDate);
    let end = new Date(sessionDate);
    
    try {
      const timeParts = session.time.split(':');
      const hourPart = parseInt(timeParts[0]);
      const minutePart = parseInt(timeParts[1]?.split(' ')[0] || '0');
      const isPM = session.time.toLowerCase().includes('pm');
      const hour24 = isPM && hourPart < 12 ? hourPart + 12 : hourPart;
      
      // Set time
      start.setHours(hour24, minutePart, 0);
      
      // Calculate end time (add duration)
      const durationMinutes = parseInt(session.duration.split(' ')[0] || '60');
      end = new Date(start);
      end.setMinutes(end.getMinutes() + durationMinutes);
    } catch (timeError) {
      console.error('Error parsing session time:', timeError);
      // Use default one hour duration
      end.setHours(start.getHours() + 1);
    }
    
    return {
      id: `session-${index}`,
      title: `${session.studentName} - ${session.topic}`,
      start,
      end,
      // Use consistent color for all tutoring sessions
      color: {
        bg: 'var(--primary)',
        border: 'var(--secondary)',
        text: 'var(--theme-hover-text)'
      },
      resource: {
        studentName: session.studentName,
        eventType: 'session',  // Mark explicitly as a tutoring session
        activityTitle: session.topic,
        hours: parseInt(session.duration) / 60,
        duration: session.duration,
        status: 'upcoming'
      }
    };
  };

  // Modified function to handle clicking on a session - now navigates to student profile
  const handleSessionClick = (session: Session) => {
    // Find Emma Thompson sessions and navigate to her profile
    if (session.studentName === "Emma Thompson" && onNavigateToStudent) {
      onNavigateToStudent("Emma Thompson");
    } else if (onNavigateToStudent) {
      // For now, all session clicks navigate to Emma Thompson as requested
      onNavigateToStudent("Emma Thompson");
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6 h-full">
      <div className="flex flex-col min-h-full gap-4">
        {/* Main Dashboard Content */}
        <div className="flex-grow overflow-visible rounded-[10px] p-2 flex flex-col">
          <div className="h-full min-h-[500px]">
            <div className="bg-transparent rounded-xl p-2 h-full">
              <div className="grid grid-cols-3 gap-4 h-full min-h-[500px]">
                {/* Calendar Side - Takes 2 columns */}
                <div className="p-2 mr-1 col-span-2 flex flex-col h-full overflow-auto">
                  <div className="flex-1 min-h-[70vh]">
                    <TestCalendar
                      events={calendarEvents}
                      date={currentDate}
                      onNavigate={handleNavigate}
                      onSelectEvent={handleSelectEvent}
                      buttonLabels={{
                        generate: "Student Calendar",
                        summarize: "Sessions Calendar"
                      }}
                      selectedStudent={selectedStudent}
                      onStudentSelect={handleStudentSelect}
                      students={students}
                      viewMode={viewMode}
                      onViewModeChange={handleViewModeChange}
                      selectedStudents={selectedStudents}
                      onStudentsChange={handleStudentsChange}
                    />
                  </div>
                </div>

                {/* Sessions and Reports Side */}
                <div className="bg-card-bg p-3 overflow-y-auto flex flex-col min-h-[70vh]">
                  <div className="flex justify-center mb-4">
                    <div className="w-fit flex gap-4 text-sm">
                      <button
                        className={`py-2 px-6 rounded-lg transition-all duration-200 
                          ${activeTab === 'upcoming' 
                            ? 'bg-primary text-black font-medium shadow-md' 
                            : 'bg-sidebar-bg text-black hover:bg-[--hover-color] shadow-sm hover:shadow'}`}
                        onClick={() => setActiveTab('upcoming')}
                      >
                        Upcoming
                      </button>
                      <button
                        className={`py-2 px-6 rounded-lg transition-all duration-200
                          ${activeTab === 'previous' 
                            ? 'bg-primary text-black font-medium shadow-md' 
                            : 'bg-sidebar-bg text-black hover:bg-[--hover-color] shadow-sm hover:shadow'}`}
                        onClick={() => setActiveTab('previous')}
                      >
                        Previous
                      </button>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && (
                    <>
                      {/* Unified Upcoming Activities Header */}
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs opacity-60 uppercase tracking-wide">
                          Upcoming MCAT Activities
                        </h3>
                      </div>

                      {/* Combined Reports and Sessions - Now with fixed height and scrollable */}
                      <div className="h-[65vh] overflow-y-auto">
                        <div className="space-y-3 pb-2">
                          {/* Tutoring Sessions */}
                          {upcomingSessions.length > 0 && upcomingSessions.map((session, index) => (
                            <div
                              key={session.id}
                              onClick={() => handleSessionClick(session)}
                              className="p-4 rounded-lg cursor-pointer
                                transition-all duration-300 hover:translate-y-[-0.125rem]
                                shadow-[0_0.125rem_0.375rem_rgba(0,0,0,0.04)]
                                hover:shadow-[0_0.25rem_1.5rem_rgba(74,99,218,0.25)]
                                group relative overflow-hidden"
                              style={{
                                background: `linear-gradient(135deg, var(--card-bg) 0%, var(--theme-mainbox-color) 100%)`
                              }}
                            >
                              {/* Session indicator - red for first/overdue session, blue for others */}
                              <div className={`absolute top-0 left-0 h-full ${
                                index === 0 
                                  ? 'w-1 bg-[#ef4444]' 
                                  : 'w-1 bg-primary'
                              } rounded-l-lg`}></div>
                              
                              {/* Glowing border effect on hover */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"
                                style={{
                                  background: index === 0 
                                    ? `linear-gradient(135deg, var(--space-error) 0%, #ff8080 100%)`
                                    : `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
                                  zIndex: 1
                                }}>
                              </div>
                              
                              {/* Light glow on the edges */}
                              <div className="absolute -inset-1 bg-gradient-to-r rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-300"
                                style={{
                                  background: index === 0
                                    ? `linear-gradient(to right, var(--space-error), #ff8080)`  
                                    : `linear-gradient(to right, var(--primary), var(--accent))`
                                }}></div>
                              
                              {/* Content */}
                              <div className="relative z-10 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center">
                                    <h3 className={`text-base font-semibold mb-1 group-hover:text-secondary transition-all duration-300 ${index === 0 ? 'text-[--space-error]' : 'text-primary'}`}>
                                      {session.studentName}
                                    </h3>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <span className="font-medium">{session.date}</span>
                                    <span className="text-xs opacity-70">•</span>
                                    <span className="text-xs">{session.time}</span>
                                    <span className="text-xs opacity-70">•</span>
                                    <span className="text-xs">{session.duration}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Show empty state if no content */}
                          {upcomingSessions.length === 0 && (
                            <div className="flex items-center justify-center h-32 text-text-secondary italic">
                              No upcoming MCAT sessions
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'previous' && (
                    <>
                      {/* Previous Reports Header */}
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs opacity-60 uppercase tracking-wide">
                          Previous MCAT Reports
                        </h3>
                      </div>

                      {/* Previous Reports List - Now with fixed height and scrollable */}
                      <div className="h-[65vh] overflow-y-auto">
                        <div className="space-y-3 pb-2">
                          {completedReports.length > 0 ? (
                            completedReports.map((report) => (
                              <div 
                                key={report.id} 
                                className="p-4 rounded-lg cursor-pointer
                                  transition-all duration-300 hover:translate-y-[-0.125rem]
                                  shadow-[0_0.125rem_0.375rem_rgba(0,0,0,0.04)]
                                  hover:shadow-[0_0.25rem_1.5rem_rgba(74,99,218,0.25)]
                                  group relative overflow-hidden"
                                style={{
                                  background: `linear-gradient(135deg, var(--card-bg) 0%, var(--theme-mainbox-color) 100%)`
                                }}
                              >
                                {/* Success indicator for completed reports */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-theme-success-border rounded-l-lg"></div>
                                
                                {/* Glowing border effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"
                                  style={{
                                    background: `linear-gradient(135deg, var(--theme-success-border) 0%, var(--theme-success-bg) 100%)`,
                                    zIndex: 1
                                  }}>
                                </div>
                                
                                {/* Light glow on the edges */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-theme-success-border to-theme-success-bg rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                                
                                {/* Content */}
                                <div className="relative z-10 flex items-center justify-between">
                                  <div>
                                    <h3 className="text-base font-semibold text-primary group-hover:text-secondary transition-all duration-300">
                                      {report.studentName}
                                    </h3>
                                  </div>
                                  
                                  {/* Date on right */}
                                  <div className="text-text-secondary">
                                    {report.submittedDate && (
                                      <span>{report.submittedDate}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-32 text-text-secondary italic">
                              No completed MCAT reports
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 