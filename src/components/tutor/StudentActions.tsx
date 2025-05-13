import React, { useState } from 'react';
import { FileText, BookOpen, Calendar, Home } from 'lucide-react';
import ChatPanel from './ChatPanel';
import DesignSessionView from './views/DesignSessionView';
import ReportView from './views/ReportView';
import ResourcesView from './views/ResourcesView';
import OverviewView from './views/OverviewView';

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
}

type ActiveView = 'overview' | 'design' | 'report' | 'resources';

interface StudentActionsProps {
  selectedStudent: Student | null;
}

export default function StudentActions({ selectedStudent }: StudentActionsProps) {
  const [activeView, setActiveView] = useState<ActiveView>('overview');

  const handleActionClick = (viewType: ActiveView) => {
    console.log(`Switching to view: ${viewType} for student:`, selectedStudent?.name);
    setActiveView(viewType);
  };

  // Function to render the current view
  const renderCurrentView = () => {
    if (!selectedStudent) return null;

    switch (activeView) {
      case 'overview':
        return (
          <div className="p-6 flex-grow overflow-y-auto">
            <OverviewView studentName={selectedStudent.name} />
          </div>
        );
      case 'design':
        return (
          <div className="p-6 flex-grow overflow-y-auto">
            <DesignSessionView studentName={selectedStudent.name} />
          </div>
        );
      case 'report':
        return (
          <div className="p-6 flex-grow overflow-y-auto">
            <ReportView studentName={selectedStudent.name} />
          </div>
        );
      case 'resources':
        return (
          <div className="p-6 flex-grow overflow-y-auto">
            <ResourcesView studentName={selectedStudent.name} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-sm">
      {/* Main content area - renders the current view */}
      {selectedStudent && renderCurrentView()}

      {/* Navigation buttons - with lighter blue background */}
      <div className="px-6 pb-6 pt-2 flex-shrink-0 bg-gradient-to-t from-background/50 to-transparent">
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => handleActionClick('overview')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-[#4c84c3] active:scale-95 min-w-[11rem] shadow-sm
              ${activeView === 'overview' ? 'bg-primary text-black' : 'bg-[#3b75b4] text-white'}`}
            disabled={!selectedStudent}
          >
            <Home size={20} className={activeView === 'overview' ? 'text-black' : 'text-white'} />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => handleActionClick('design')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-[#4c84c3] active:scale-95 min-w-[11rem] shadow-sm
              ${activeView === 'design' ? 'bg-primary text-black' : 'bg-[#3b75b4] text-white'}`}
            disabled={!selectedStudent}
          >
            <Calendar size={20} className={activeView === 'design' ? 'text-black' : 'text-white'} />
            <span>Design Session</span>
          </button>
          
          <button 
            onClick={() => handleActionClick('report')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-[#4c84c3] active:scale-95 min-w-[11rem] shadow-sm
              ${activeView === 'report' ? 'bg-primary text-black' : 'bg-[#3b75b4] text-white'}`}
            disabled={!selectedStudent}
          >
            <FileText size={20} className={activeView === 'report' ? 'text-black' : 'text-white'} />
            <span>Write Report</span>
          </button>
          
          <button 
            onClick={() => handleActionClick('resources')}
            className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-[#4c84c3] active:scale-95 min-w-[11rem] shadow-sm
              ${activeView === 'resources' ? 'bg-primary text-black' : 'bg-[#3b75b4] text-white'}`}
            disabled={!selectedStudent}
          >
            <BookOpen size={20} className={activeView === 'resources' ? 'text-black' : 'text-white'} />
            <span>Assign Resources</span>
          </button>
        </div>
      </div>
    </div>
  );
} 