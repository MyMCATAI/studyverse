import React from 'react';
import { ExternalLink, File, Calendar, FileText, BookOpen, TrendingUp, Award, Clock, AlertTriangle } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
}

interface EditableStudentSummaryProps {
  student: Student;
  onActionClick?: (action: 'design' | 'report' | 'resources') => void;
  expanded?: boolean;
}

export default function EditableStudentSummary({ student, onActionClick, expanded = false }: EditableStudentSummaryProps) {
  // Specific data for Emma Thompson (adjust condition if needed)
  const isEmma = student.name.includes('Emma Thompson');
  
  // Condensed profile text for more graph-focused approach
  const knowledgeProfileText = isEmma ? 
    "Emma Thompson is an 8th grader studying for the SAT. Strengths lie in Reading Comprehension and basic Algebra. Areas for improvement include advanced Geometry concepts and essay writing structure." : 
    "Knowledge profile details not available for this student.";
    
  const googleDriveLink = "https://drive.google.com/drive/u/0/folders/1gttBHe1FCfYffwVbTtx9iXXF_Ekikb25";

  const handleButtonClick = (action: string) => {
    if (onActionClick) {
      onActionClick(action as 'design' | 'report' | 'resources');
    }
  };

  // Performance metrics for visualization
  const performanceMetrics = [
    { name: 'Reading', value: 85, color: 'bg-blue-500' },
    { name: 'Math', value: 72, color: 'bg-green-500' },
    { name: 'Writing', value: 65, color: 'bg-purple-500' },
    { name: 'Overall', value: 74, color: 'bg-amber-500' }
  ];

  // Recent progress data
  const progressTrend = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 74 }
  ];

  // Max width of progress bars
  const maxBarWidth = 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full flex flex-col">
      {/* Student Name Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
        {expanded && (
          <p className="text-gray-500 mt-1">
            Grade 8 • SAT Preparation • 3 sessions/week
          </p>
        )}
      </div>

      {/* Main Content - Two column layout when expanded */}
      {expanded ? (
        <div className="flex flex-col md:flex-row gap-6 flex-grow">
          {/* Left Column - Student Summary with Graphs */}
          <div className="flex-1 space-y-4">
            {/* Condensed Profile Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Overview</h3>
              
              {/* Performance Metrics Visualization */}
              <div className="space-y-3 mt-4">
                {performanceMetrics.map(metric => (
                  <div key={metric.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.name}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${metric.color} h-2.5 rounded-full`} 
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Visual Progress Trend */}
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-700 mb-3">Progress Trend</h4>
                <div className="flex items-end h-32 gap-4 justify-between px-2">
                  {progressTrend.map((data, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="relative w-12">
                        <div 
                          className="bg-primary absolute bottom-0 w-full rounded-t-md"
                          style={{ height: `${data.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1 text-gray-600">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Key Insights with Icons */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Insights</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-blue-100">
                    <TrendingUp size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Consistent Improvement</h5>
                    <p className="text-xs text-gray-600">Reading scores improved by 12% over last quarter</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-green-100">
                    <Award size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Top Strength</h5>
                    <p className="text-xs text-gray-600">Reading comprehension in 85th percentile</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-amber-100">
                    <Clock size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Upcoming Test</h5>
                    <p className="text-xs text-gray-600">Practice SAT scheduled in 3 weeks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-red-100">
                    <AlertTriangle size={16} className="text-red-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Focus Area</h5>
                    <p className="text-xs text-gray-600">Geometric proofs and essay organization need attention</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Assignments & Homework */}
          <div className="flex-1 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Assignments & Homework</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Assignments</h4>
                  <div className="bg-white rounded-lg p-3 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={14} className="text-blue-500"/>
                        <span className="text-sm font-medium">SAT Practice Test 1.pdf</span>
                      </div>
                      <div className="text-xs text-red-500 font-medium">Due tomorrow</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={14} className="text-green-500"/>
                        <span className="text-sm font-medium">Geometry Worksheet.docx</span>
                      </div>
                      <div className="text-xs text-amber-500 font-medium">Due in 3 days</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={14} className="text-purple-500"/>
                        <span className="text-sm font-medium">Essay Outline.docx</span>
                      </div>
                      <div className="text-xs text-green-500 font-medium">Due in 7 days</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Completed Work</h4>
                  <div className="bg-white rounded-lg p-3 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={14} className="text-gray-400"/>
                        <span className="text-sm text-gray-500">Reading Comprehension Quiz</span>
                      </div>
                      <div className="text-xs text-gray-400">Grade: 92%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File size={14} className="text-gray-400"/>
                        <span className="text-sm text-gray-500">Algebra Practice Set</span>
                      </div>
                      <div className="text-xs text-gray-400">Grade: 85%</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Student Questions</h4>
                  <div className="bg-white rounded-lg p-3 space-y-2.5 shadow-sm">
                    <div className="text-sm">How do I solve quadratic equations?</div>
                    <div className="text-sm">What&apos;s the difference between sine and cosine?</div>
                  </div>
                </div>
                
                <a 
                  href={googleDriveLink}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View All Files in Drive <ExternalLink size={12} />
                </a>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Sessions</h3>
              <div className="space-y-2.5">
                <div className="bg-white rounded-lg p-3 flex justify-between shadow-sm">
                  <div>
                    <div className="text-sm font-medium">SAT Math Review</div>
                    <div className="text-xs text-gray-500">Focus: Geometry & Word Problems</div>
                  </div>
                  <div className="text-xs text-gray-500">Tomorrow, 4:00 PM</div>
                </div>
                <div className="bg-white rounded-lg p-3 flex justify-between shadow-sm">
                  <div>
                    <div className="text-sm font-medium">Essay Writing Workshop</div>
                    <div className="text-xs text-gray-500">Focus: Structure & Organization</div>
                  </div>
                  <div className="text-xs text-gray-500">Thursday, 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Non-expanded view remains the same
        <div className="space-y-5 flex-grow flex flex-col">
          <p className="text-sm text-gray-600">{knowledgeProfileText}</p>
          
          {/* Action Buttons only shown in non-expanded view */}
          {onActionClick && (
            <div className="flex flex-col space-y-3 mt-4">
              <button 
                onClick={() => handleButtonClick('design')}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-card-bg rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-primary/10 active:scale-98"
              >
                <Calendar size={18} className="text-primary" />
                <span>Design Session</span>
              </button>
              
              <button 
                onClick={() => handleButtonClick('report')}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-card-bg rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-primary/10 active:scale-98"
              >
                <FileText size={18} className="text-primary" />
                <span>Write Report</span>
              </button>
              
              <button 
                onClick={() => handleButtonClick('resources')}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-card-bg rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:bg-primary/10 active:scale-98"
              >
                <BookOpen size={18} className="text-primary" />
                <span>Assign Resources</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 