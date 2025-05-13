import React from 'react';
import { X, FileText, Calendar, User, Clock, BookOpen, Check } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

interface TestSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

const TestSummaryModal: React.FC<TestSummaryModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const eventData = event.resource || {};
  const studentName = eventData.studentName || "Student";
  const testTitle = eventData.activityTitle || event.title || "Academic Event";
  const testDate = event.start 
    ? format(new Date(event.start), 'EEEE, MMMM d, yyyy')
    : "Upcoming";
  const testTime = event.start 
    ? format(new Date(event.start), 'h:mm a')
    : "TBD";
  const testDuration = eventData.hours
    ? `${eventData.hours} ${eventData.hours === 1 ? 'hour' : 'hours'}`
    : "Not specified";
  const testStatus = eventData.status || "Upcoming";
  
  // Extract subject/course information if available
  const subjectMatch = testTitle.match(/\b(?:Biology|Chemistry|Physics|Math|English|History|Science)\b/i);
  const subject = subjectMatch ? subjectMatch[0] : "General";

  const handleSuggestSession = () => {
    // In a real application, this would open a session scheduling interface
    alert(`Suggest a tutoring session for ${studentName}`);
    // Consider closing the modal after action or showing a confirmation
  };

  const handleAddNotes = () => {
    // In a real application, this would open a notes interface
    alert(`Add notes for ${studentName}`);
    // Consider closing the modal after action or showing a confirmation
  };

  const handleSendMaterials = () => {
    // In a real application, this would open a materials sharing interface
    alert(`Send study materials to ${studentName}`);
    // Consider closing the modal after action or showing a confirmation
  };

  return (
    <div className="fixed inset-0 bg-[--theme-shadow-color-darker] flex items-center justify-center z-50 custom-calendar-modal">
      <div className="w-full max-w-md bg-[--theme-mainbox-color] rounded-xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[--theme-border-color] p-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[--theme-emphasis-color]" />
            <h2 className="text-lg font-semibold">{testTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[--hover-color] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-4">
            <div className="text-sm text-[--text-secondary] mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5" />
              Student
            </div>
            <div className="font-medium">{studentName}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-[--text-secondary] mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Date
              </div>
              <div className="font-medium">{testDate}</div>
            </div>
            
            <div>
              <div className="text-sm text-[--text-secondary] mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                Time
              </div>
              <div className="font-medium">{testTime} ({testDuration})</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-[--text-secondary] mb-1 flex items-center">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Subject
              </div>
              <div className="font-medium">{subject}</div>
            </div>
            
            <div>
              <div className="text-sm text-[--text-secondary] mb-1 flex items-center">
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Status
              </div>
              <div className="font-medium">{testStatus}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSuggestSession}
              className="w-full flex items-center justify-center bg-[--card-bg] hover:bg-[--theme-hover-color] hover:text-[--hover-text] text-[--text-color] font-medium py-2.5 px-4 rounded-lg border border-[--theme-border-color] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Suggest A Tutoring Session
            </button>
            
            <button
              onClick={handleAddNotes}
              className="w-full flex items-center justify-center bg-[--card-bg] hover:bg-[--theme-hover-color] hover:text-[--hover-text] text-[--text-color] font-medium py-2.5 px-4 rounded-lg border border-[--theme-border-color] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Notes for Student
            </button>
            
            <button
              onClick={handleSendMaterials}
              className="w-full flex items-center justify-center bg-[--card-bg] hover:bg-[--theme-hover-color] hover:text-[--hover-text] text-[--text-color] font-medium py-2.5 px-4 rounded-lg border border-[--theme-border-color] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Send Study Materials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[--theme-border-color] p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[--primary] text-[--hover-text] px-4 py-2 rounded-lg hover:bg-[--theme-hover-color] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSummaryModal; 