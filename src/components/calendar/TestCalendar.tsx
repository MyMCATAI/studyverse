"use client"

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps, View } from 'react-big-calendar';
import { format, isToday, isTomorrow } from 'date-fns';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/components/styles/CustomCalendar.css";
import WeeklyCalendarModal from '@/components/calendar/WeeklyCalendarModal';
import TestSummaryModal from '@/components/calendar/TestSummaryModal';
import TutoringSessionModal from '@/components/calendar/TutoringSessionModal';
import toast from 'react-hot-toast';
import { CalendarEvent } from '@/types/calendar';
import { cn } from '@/lib/utils';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Utility function to check if there are any upcoming non-exam activities
const hasUpcomingNonExamActivities = (events: CalendarEvent[]): boolean => {
  const now = new Date();
  return events.some(event => {
    const isUpcoming = new Date(event.start) >= now;
    const isNonExam = event.activityType !== 'Exam' && 
                       event.activityType !== 'MCAT' &&
                       event.activityType !== 'Full Length' &&
                       event.activityType !== 'Practice Test';
    return isUpcoming && isNonExam;
  });
};

interface TestCalendarProps {
  events: CalendarEvent[];
  date: Date;
  onNavigate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  chatbotRef?: React.MutableRefObject<{
    sendMessage: (message: string, messageContext?: string) => void;
  }>;
  handleSetTab?: (tab: string) => void;
  onEventUpdate?: () => void;
  buttonLabels?: {
    generate?: string;
    summarize?: string;
    hideSummarize?: boolean;
  };
  selectedStudent?: string | null;
  onStudentSelect?: (studentId: string) => void;
  students?: Array<{id: string, name: string, color: string}>;
  viewMode?: 'tutoring' | 'student';
  onViewModeChange?: (mode: 'tutoring' | 'student') => void;
  selectedStudents?: string[];
  onStudentsChange?: (studentIds: string[]) => void;
}

interface ToolbarWithEventsProps {
  label: string;
  onNavigate: (action: 'PREV' | 'NEXT') => void;
  events: CalendarEvent[];
  chatbotRef?: React.MutableRefObject<{
    sendMessage: (message: string) => void;
  }>;
  onSummarize: () => void;
  onGenerate: () => void;
  buttonLabels?: {
    generate?: string;
    summarize?: string;
    hideSummarize?: boolean;
  };
  selectedStudent?: string | null;
  onStudentSelect?: (studentId: string) => void;
  students?: Array<{id: string, name: string, color: string}>;
  viewMode?: 'tutoring' | 'student';
  onViewModeChange?: (mode: 'tutoring' | 'student') => void;
  selectedStudents?: string[];
  onStudentsChange?: (studentIds: string[]) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
}

interface EnhancedStudent {
  id: string;
  name: string;
  color: string;
  colorVars?: {
    bg: string;
    border: string;
    text: string;
  };
}

const getNextTestDate = (events: CalendarEvent[]): Date | null => {
  const futureTests = events
    .map(event => event.start)
    .filter(date => date > new Date())
    .sort((a, b) => a.getTime() - b.getTime());
  
  return futureTests.length > 0 ? futureTests[0] : null;
};

// Base toolbar component that accepts only ToolbarProps
const BaseToolbar: React.FC<ToolbarProps<CalendarEvent, object>> = (props) => {
  const { onNavigate, label } = props;

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onNavigate('PREV')}
        className="p-1.5 hover:bg-[--theme-hover-color] hover:text-[--theme-hover-text] rounded-lg transition-all duration-200"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-sm font-medium">{label}</span>
      <button 
        onClick={() => onNavigate('NEXT')}
        className="p-1.5 hover:bg-[--theme-hover-color] hover:text-[--theme-hover-text] rounded-lg transition-all duration-200"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// Wrapper component that adds the countdown
const CustomToolbarWithEvents: React.FC<ToolbarWithEventsProps> = ({ 
  label, 
  onNavigate, 
  events,
  chatbotRef,
  onSummarize,
  onGenerate,
  buttonLabels,
  selectedStudent,
  onStudentSelect,
  students,
  viewMode,
  onViewModeChange,
  selectedStudents = [],
  onStudentsChange,
  isDropdownOpen,
  setIsDropdownOpen
}) => {
  const generateText = buttonLabels?.generate || "Student Calendar";
  const summarizeText = buttonLabels?.summarize || "Sessions Calendar";
  const showSummarize = buttonLabels?.hideSummarize !== true;
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const shouldShowGenerateIndicator = !hasUpcomingNonExamActivities(events);
  
  // Toggle student selection
  const toggleStudent = (studentId: string) => {
    if (onStudentsChange) {
      const newSelection = selectedStudents.includes(studentId)
        ? selectedStudents.filter(id => id !== studentId)
        : [...selectedStudents, studentId];
      
      onStudentsChange(newSelection.length > 0 ? newSelection : []);
    }
  };
  
  // Get formatted student names for display
  const getSelectedStudentsText = () => {
    if (!selectedStudents || selectedStudents.length === 0) return "Select Students";
    
    if (selectedStudents.length === 1) {
      const student = students?.find(s => s.id === selectedStudents[0]);
      return student?.name || "Select Students";
    }
    
    return `${selectedStudents.length} Students Selected`;
  };

  return (
    <div className="rbc-toolbar">
      <div className="header-content flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('PREV')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--theme-button-color)] hover:bg-[color:var(--theme-hover-color)] transition-all duration-200 text-[color:var(--text-secondary)] hover:text-[color:var(--text-color)] shadow hover:shadow-lg hover:translate-y-[-1px]"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5px] flex-shrink-0" />
          </button>
          <span className="rbc-toolbar-label text-lg font-medium">{label}</span>
          <button
            onClick={() => onNavigate('NEXT')}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[color:var(--theme-button-color)] hover:bg-[color:var(--theme-hover-color)] transition-all duration-200 text-[color:var(--text-secondary)] hover:text-[color:var(--text-color)] shadow hover:shadow-lg hover:translate-y-[-1px]"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5px] flex-shrink-0" />
          </button>
        </div>
        <div className="flex-1 flex justify-center gap-4">
          {showSummarize && (
            <button
              onClick={() => {
                if (onViewModeChange) onViewModeChange('tutoring');
                onSummarize();
              }}
              className={`transition-all duration-200 px-5 py-2 rounded-md text-sm font-medium 
                ${viewMode === 'tutoring' 
                  ? 'bg-secondary text-[color:var(--hover-text)] shadow-md' 
                  : 'bg-[color:var(--theme-button-color)] text-[color:var(--text-secondary)] hover:bg-[color:var(--theme-hover-color)] hover:text-[color:var(--text-color)] shadow hover:shadow-lg hover:translate-y-[-1px]'}`}
            >
              {summarizeText}
            </button>
          )}
          
          {/* Student Calendar Button with hover-activated dropdown */}
          <div 
            className="relative" 
            ref={dropdownRef}
            onMouseEnter={() => {
              // When hovering, open dropdown and switch to student mode if needed
              setIsDropdownOpen(true);
              if (viewMode !== 'student' && onViewModeChange) {
                onViewModeChange('student');
              }
            }}
            onMouseLeave={() => {
              // When mouse leaves, close dropdown but keep student mode active
              setIsDropdownOpen(false);
            }}
          >
            <div
              className={`transition-all duration-200 px-5 py-2 rounded-md text-sm font-medium cursor-pointer
                ${viewMode === 'student' || isDropdownOpen
                  ? 'bg-secondary text-[color:var(--hover-text)] shadow-md' 
                  : 'bg-[color:var(--theme-button-color)] text-[color:var(--text-secondary)] hover:bg-[color:var(--theme-hover-color)] hover:text-[color:var(--text-color)] shadow hover:shadow-lg hover:translate-y-[-1px]'}`}
            >
              {viewMode === 'student' ? getSelectedStudentsText() : generateText}
            </div>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-card-bg shadow-lg rounded-md overflow-hidden z-50 border border-[--theme-border-color] student-dropdown">
                <div className="p-3 border-b border-[--theme-border-color]">
                  <div className="text-xs font-medium mb-2 text-text-secondary">Select MCAT students to view:</div>
                  {students?.map(student => (
                    <div key={student.id} className="flex items-center py-1.5">
                      <label className="flex items-center cursor-pointer w-full">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="mr-2 h-3.5 w-3.5 rounded border-[--theme-border-color] text-[--theme-hover-color] focus:ring-[--theme-emphasis-color]"
                        />
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ 
                            backgroundColor: (student as EnhancedStudent).colorVars?.bg || 
                                             student.color.startsWith('--') ?
                                             `var(${student.color})` :
                                             `var(--${student.color})`
                          }}
                        ></div>
                        <span className="text-sm">{student.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="p-3 flex justify-between">
                  <button
                    onClick={() => {
                      if (onStudentsChange && students) {
                        onStudentsChange(students.map(s => s.id));
                      }
                    }}
                    className="text-xs text-[--theme-hover-color] hover:underline font-medium"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      if (onStudentsChange) {
                        onStudentsChange([]);
                      }
                    }}
                    className="text-xs text-[--theme-hover-color] hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TestCalendar: React.FC<TestCalendarProps> = ({ 
  events, 
  date, 
  onNavigate, 
  onSelectEvent,
  chatbotRef,
  handleSetTab,
  onEventUpdate,
  buttonLabels,
  selectedStudent,
  onStudentSelect,
  students,
  viewMode = 'tutoring',
  onViewModeChange,
  selectedStudents = [],
  onStudentsChange
}) => {
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isTestSummaryModalOpen, setIsTestSummaryModalOpen] = useState(false);
  const [isTutoringSessionModalOpen, setIsTutoringSessionModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Auto-select all students when the component mounts
  useEffect(() => {
    if (students && students.length > 0 && onStudentsChange && 
        (!selectedStudents || selectedStudents.length === 0)) {
      console.log('Auto-selecting all students');
      onStudentsChange(students.map(s => s.id));
    }
  }, [students, onStudentsChange, selectedStudents]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Use useMemo to calculate filtered events only when dependencies change
  const filteredEvents = useMemo(() => {
    console.log(`Filtering events for mode: ${viewMode}, selected students: ${selectedStudents.length}`);
    
    return events.filter(event => {
      // Extract event type from resource or title if available
      const eventType = event.resource?.eventType?.toLowerCase() || '';
      const eventTitle = event.title?.toLowerCase() || '';
      const studentName = event.resource?.studentName || '';
      
      // Check for tutoring session indicators
      const isTutoringSession = 
        eventType === 'session' || 
        eventType.includes('tutoring') ||
        eventTitle.includes('tutoring session');
      
      // In tutoring mode, only show tutoring sessions
      if (viewMode === 'tutoring') {
        return isTutoringSession;
      } 
      // In student mode, show everything except tutoring sessions
      else if (viewMode === 'student') {
        // Only show events for selected students
        if (selectedStudents && selectedStudents.length > 0) {
          // Find if this event belongs to any selected student
          const belongsToSelectedStudent = students?.some(student => 
            selectedStudents.includes(student.id) && 
            (studentName.includes(student.name) || 
             eventTitle.includes(student.name) ||
             event.resource?.studentId === student.id)
          );
          
          return !isTutoringSession && belongsToSelectedStudent;
        }
        
        // If no students selected or no student data, show all non-tutoring events
        return !isTutoringSession;
      }
      
      // Fallback - show all events if no view mode specified
      return true;
    });
  }, [events, viewMode, selectedStudents, students]);

  const createCalendarContext = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Create array of next 7 days
    const nextWeekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });

    // Helper function to format events for a specific date
    const formatEventsForDate = (dateToCheck: Date) => {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === dateToCheck.toDateString();
      });

      return dayEvents.map(event => {
        const resource = event.resource;
        if (resource.eventType === 'exam' || resource.eventType === 'mcat') {
          // Format MCAT exam events with scores if available
          const scoreInfo = resource.fullLengthExam?.dataPulses?.reduce((acc: any, pulse: any) => {
            if (pulse.name.includes("Chemical and Physical") || pulse.name.includes("CP")) acc.cp = pulse.positive;
            else if (pulse.name.includes("Critical Analysis") || pulse.name.includes("CARS")) acc.cars = pulse.positive;
            else if (pulse.name === "Biological and Biochemical Foundations" || pulse.name.includes("BB")) acc.bb = pulse.positive;
            else if (pulse.name === "Psychological, Social, and Biological Foundations" || pulse.name.includes("PS")) acc.ps = pulse.positive;
            return acc;
          }, { cp: 0, cars: 0, bb: 0, ps: 0 });

          const scoreText = resource.status === "Completed" && scoreInfo
            ? ` - Score: ${Object.values(scoreInfo as Record<string, number>).reduce((sum: number, score: number) => sum + score, 0)} (CP: ${scoreInfo.cp}/CARS: ${scoreInfo.cars}/BB: ${scoreInfo.bb}/PS: ${scoreInfo.ps})`
            : '';

          return `MCAT Practice: ${resource.activityTitle} (${resource.activityText || 'Full Length'}, ${resource.hours}h, ${resource.status}${scoreText})`;
        } else {
          // Format MCAT study events
          const activityTypeMap: Record<string, string> = {
            'content': 'Content Review',
            'passage': 'Passage Practice',
            'drill': 'Question Drill',
            'anki': 'Anki Review',
            'skill': 'MCAT Skill',
            'section': 'Section Practice',
            'qa': 'Q&A Session',
            'review': 'Review Session'
          };
          
          const activityType = activityTypeMap[resource.eventType?.toLowerCase()] || resource.eventType || 'Study Session';
          
          return `${resource.activityTitle} (${activityType}, ${resource.hours}h, ${resource.status})`;
        }
      }).join("\n") || "No MCAT activities scheduled";
    };

    const context = `
      Here's my personal MCAT study calendar:

      Yesterday (${yesterday.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}):
      ${formatEventsForDate(yesterday)}

      ${nextWeekDays.map((date) => {
        const dayLabel = isToday(date)
          ? "Today"
          : date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

        return `${dayLabel}:\n${formatEventsForDate(date)}`;
      }).join("\n\n")}
    `.trim();

    return {
      contentTitle: "MCAT Study Calendar",
      context: context
    };
  };

  const handleSummarizeWeek = () => {
    if (onViewModeChange) onViewModeChange('tutoring');
    const contextData = createCalendarContext();
    if (chatbotRef?.current) {
      const visibleMessage = "Summarize my MCAT study week";
      const hiddenContext = `Here's my MCAT study calendar context:\n\n${contextData.context}\n\nBased on this calendar, please provide a summary of my MCAT study schedule for this week. Include details about upcoming full-length practice tests, section tests, content review sessions, and completed assessments. Also provide suggestions for balancing my time across the four MCAT sections (CP, CARS, BB, PS) based on my calendar.`;
      
      // Just switch the sidebar to Insights tab
      const sidebarInsightsTab = document.querySelector('[data-tab="tab1"]');
      if (sidebarInsightsTab instanceof HTMLElement) {
        sidebarInsightsTab.click();
      }
      
      // Add delay before sending message
      setTimeout(() => {
        chatbotRef.current.sendMessage(visibleMessage, hiddenContext);
      }, 2000);
    }
  };

  const handleGenerateSchedule = () => {
    try {
      console.log('Handling MCAT Schedule Generation');
      
      // Open the dropdown first
      setIsDropdownOpen(true);
      
      // First ensure we have the view mode change function
      if (!onViewModeChange) {
        console.warn('onViewModeChange callback is not provided');
        return;
      }
      
      // Only change if we're not already in student mode
      if (viewMode !== 'student') {
        console.log('Changing to MCAT student mode');
        // Change mode to student - use setTimeout to avoid batched updates
        setTimeout(() => {
          onViewModeChange('student');
          
          // After changing mode, select a student if needed
          setTimeout(() => {
            // Select all students by default if none are selected
            if (onStudentsChange && students && students.length > 0) {
              if (!selectedStudents || selectedStudents.length === 0) {
                console.log('No MCAT students selected, selecting first student as default');
                onStudentsChange([students[0].id]);
              }
            }
            
            // Optionally, we could show a toast notification here
            toast.success('MCAT Study Plan mode activated', {
              duration: 3000,
              position: 'bottom-center',
              className: 'bg-card-bg text-text-color',
              icon: '📊'
            });
            
          }, 0);
        }, 0);
      } else {
        // If already in student mode and no students selected, select one
        if (onStudentsChange && students && students.length > 0) {
          if (!selectedStudents || selectedStudents.length === 0) {
            console.log('Already in MCAT student mode but no students selected, selecting first student');
            onStudentsChange([students[0].id]);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleGenerateSchedule:', error);
    }
  };

  // Custom event styling based on event type and selected student
  const eventStyleGetter = (event: CalendarEvent) => {
    const isExam = event.activityType === 'Exam' || event.activityType === 'MCAT' || 
                   event.activityType === 'Full Length' || 
                   (event.resource?.eventType?.toLowerCase() === 'exam') || 
                   (event.resource?.eventType?.toLowerCase() === 'mcat');
    const isTutoring = event.activityType === 'Tutoring';
    const isContentReview = event.activityType === 'Content' || 
                            (event.resource?.eventType?.toLowerCase() === 'content');
    const isPassage = event.activityType === 'Passage' || 
                      (event.resource?.eventType?.toLowerCase() === 'passage');
    const isAssignment = event.activityType === 'Assignment';
    const isSkill = event.activityType === 'Skill' || 
                    (event.resource?.eventType?.toLowerCase() === 'skill');
    const isDrill = event.activityType === 'Drill' || 
                    (event.resource?.eventType?.toLowerCase() === 'drill');
    const isAnki = event.activityType === 'Anki' || 
                   (event.resource?.eventType?.toLowerCase() === 'anki');
    const isSection = event.activityType === 'Section' || 
                      (event.resource?.eventType?.toLowerCase() === 'section');
    const isComplete = event.status === 'completed';
    
    // If event has a custom color, use that
    if (event.color) {
      return {
        className: `student-event ${isComplete ? 'completed-event' : ''}`,
        style: {
          backgroundColor: event.color.bg || 'var(--theme-info-bg)',
          borderColor: event.color.border || 'var(--theme-info-border)',
          color: event.color.text || 'var(--theme-info-text)',
          borderLeft: `0.125rem solid ${event.color.border || 'var(--theme-info-border)'}`,
        }
      };
    }
    
    const baseStyle = {
      style: {
        backgroundColor: isExam 
          ? 'var(--theme-warning-bg)' 
          : isContentReview
            ? 'var(--theme-success-bg)'
            : isPassage
              ? 'var(--theme-accent-bg)'
            : isSkill
              ? 'var(--theme-primary-bg)'
            : isSection
              ? 'var(--theme-error-bg)'
            : isDrill
              ? 'var(--theme-neutral-bg)'
            : isAnki
              ? 'var(--theme-info-bg)'
            : 'var(--theme-info-bg)',
        borderColor: isExam 
          ? 'var(--theme-warning-border)' 
          : isContentReview
            ? 'var(--theme-success-border)'
            : isPassage
              ? 'var(--theme-accent-border)'
            : isSkill
              ? 'var(--theme-primary-border)'
            : isSection
              ? 'var(--theme-error-border)'
            : isDrill
              ? 'var(--theme-neutral-border)'
            : isAnki
              ? 'var(--theme-info-border)'
            : 'var(--theme-info-border)',
        color: isExam 
          ? 'var(--theme-warning-text)' 
          : isContentReview
            ? 'var(--theme-success-text)'
            : isPassage
              ? 'var(--theme-accent-text)'
            : isSkill
              ? 'var(--theme-primary-text)'
            : isSection
              ? 'var(--theme-error-text)'
            : isDrill
              ? 'var(--theme-neutral-text)'
            : isAnki
              ? 'var(--theme-info-text)'
            : 'var(--theme-info-text)',
        borderLeft: isExam 
          ? '0.125rem solid var(--theme-warning-border)' 
          : isContentReview
            ? '0.125rem solid var(--theme-success-border)'
            : isPassage
              ? '0.125rem solid var(--theme-accent-border)'
            : isSkill
              ? '0.125rem solid var(--theme-primary-border)'
            : isSection
              ? '0.125rem solid var(--theme-error-border)'
            : isDrill
              ? '0.125rem solid var(--theme-neutral-border)'
            : isAnki
              ? '0.125rem solid var(--theme-info-border)'
            : '0.125rem solid var(--theme-info-border)',
      },
      className: `${isExam ? 'mcat-exam-event' : ''} ${isComplete ? 'completed-event' : ''} ${isTutoring ? 'tutoring-event' : ''} 
                  ${isContentReview ? 'content-review-event' : ''} ${isPassage ? 'passage-event' : ''} 
                  ${isSection ? 'section-event' : ''}`
    };
    
    return baseStyle;
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    
    // Check if this is a tutoring session
    const eventType = event.resource?.eventType?.toLowerCase() || '';
    const eventTitle = event.title?.toLowerCase() || '';
    
    // Check for MCAT-specific keywords in the event type or title
    const isMcatExam = 
      eventType === 'mcat' || 
      eventType === 'fl' || 
      eventType === 'fullength' || 
      eventType === 'full-length' ||
      eventType.includes('practice test') ||
      eventTitle.includes('mcat') ||
      eventTitle.includes('full length') ||
      eventTitle.includes('fl ');
    
    if (eventType === 'session') {
      // For tutoring sessions, show the TutoringSessionModal
      setIsTutoringSessionModalOpen(true);
    }
    // Check if this is an MCAT exam or quiz
    else if (
      (viewMode === 'student' && 
       (eventType.includes('quiz') || eventType.includes('test') || 
        eventType.includes('exam') || isMcatExam ||
        eventTitle.includes('quiz') || eventTitle.includes('test') || 
        eventTitle.includes('exam'))) ||
      (event.resource?.eventType === 'exam') ||
      isMcatExam
    ) {
      // For MCAT exams, show the TestSummaryModal
      setIsTestSummaryModalOpen(true);
    } else {
      // For other events, just select them without showing a modal
      onSelectEvent(event);
    }
  };

  // Custom event content component to simplify session display
  const eventContentComponent = ({ event }: { event: any }) => {
    const eventData = event.resource || {};
    const eventType = eventData.eventType?.toLowerCase() || '';
    const title = event.title || '';
    
    // For session events, just show the student name
    if (eventType === 'session') {
      const studentName = eventData.studentName || "Student";
      return <div title={event.title}>{studentName}</div>;
    }
    
    // For MCAT exam events, show a more specific format
    if (eventType === 'exam' || eventType === 'mcat' || title.toLowerCase().includes('mcat') || 
        title.toLowerCase().includes('fl ') || title.toLowerCase().includes('full length')) {
      // Show more details for MCAT exams
      const examType = eventData.examType || 'FL';
      const examNumber = eventData.examNumber || '';
      const displayTitle = examNumber ? `${examType} ${examNumber}` : title;
      return (
        <div title={eventData.fullTitle || title} className="mcat-exam-title">
          {displayTitle}
          {eventData.score && (
            <div className="text-xs mt-1">
              Score: {eventData.score}
            </div>
          )}
        </div>
      );
    }
    
    // For MCAT content review, show the subject
    if (eventType === 'content' || title.toLowerCase().includes('content')) {
      const subject = eventData.subject || '';
      return (
        <div title={eventData.fullTitle || title}>
          {subject ? `${subject}` : title}
        </div>
      );
    }
    
    // Default display for other events
    return <div title={event.resource?.fullTitle || event.title}>{event.title}</div>;
  };

  // Add custom popup component for more details
  const components = {
    toolbar: (toolbarProps: any) => (
      <CustomToolbarWithEvents
        {...toolbarProps}
        events={events}
        chatbotRef={chatbotRef}
        onSummarize={handleSummarizeWeek}
        onGenerate={handleGenerateSchedule}
        buttonLabels={buttonLabels}
        selectedStudent={selectedStudent}
        onStudentSelect={onStudentSelect}
        students={students}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        selectedStudents={selectedStudents}
        onStudentsChange={onStudentsChange}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
    ),
    eventContent: eventContentComponent
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        className="custom-calendar w-full h-full min-h-[31.25rem] bg-transparent"
        views={['month']}
        defaultView="month"
        date={date}
        onNavigate={onNavigate}
        toolbar={true}
        popup
        selectable
        onSelectEvent={handleEventClick}
        eventPropGetter={eventStyleGetter}
        components={components}
        style={{ height: '100%' }}
      />
      {isWeeklyModalOpen && (
        <div className="fixed inset-0 bg-[--theme-shadow-color-darker] flex items-center justify-center z-50 custom-calendar-modal">
          <div className="w-[90vw] max-w-6xl h-full bg-[--theme-mainbox-color] rounded-xl overflow-hidden shadow-xl">
            <WeeklyCalendarModal
              onComplete={async (result: { success: boolean; action?: 'generate' | 'save' | 'reset' }) => {
                if (result.success) {
                  if (onEventUpdate) {
                    await onEventUpdate();
                  }
                  // Only close the modal if it's not a reset action
                  if (result.action !== 'reset') {
                    setIsWeeklyModalOpen(false);
                  }
                  return true;
                }
                return false;
              }}
              onClose={() => setIsWeeklyModalOpen(false)}
            />
          </div>
        </div>
      )}
      <TestSummaryModal
        isOpen={isTestSummaryModalOpen}
        onClose={() => {
          setIsTestSummaryModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
      <TutoringSessionModal
        isOpen={isTutoringSessionModalOpen}
        onClose={() => {
          setIsTutoringSessionModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </>
  );
};

export default TestCalendar; 