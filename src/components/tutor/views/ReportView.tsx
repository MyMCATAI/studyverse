import React, { useState } from 'react';
import { IoDocumentText } from 'react-icons/io5';

interface ReportViewProps {
  studentName: string;
}

const ReportView = ({ studentName }: ReportViewProps) => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [reportContent, setReportContent] = useState<string>('');

  // Mock MCAT tutoring sessions
  const tutoringSessions = [
    { id: 's1', date: '2023-10-15', topic: 'Chem/Phys - Electrochemistry & Circuits' },
    { id: 's2', date: '2023-10-08', topic: 'CARS - Passage Analysis Techniques' },
    { id: 's3', date: '2023-10-01', topic: 'Bio/Biochem - Amino Acid Structures' },
    { id: 's4', date: '2023-09-24', topic: 'Psych/Soc - Social Behavior Theories' },
    { id: 's5', date: '2023-09-17', topic: 'Full Length AAMC FL1 Review' },
  ];

  // Mock previous MCAT reports data
  const previousReports = [
    { id: '1', title: 'October Progress Report', date: '2023-10-16', sessionId: 's1', type: 'Progress Report', content: 'Student has shown significant improvement in electrochemistry concepts. They can now confidently solve most standard problems involving galvanic cells and electrolytic cells. Their understanding of circuits has also improved, though more practice with parallel circuits is recommended.' },
    { id: '2', title: 'CARS Strategy Assessment', date: '2023-10-09', sessionId: 's2', type: 'Session Notes', content: 'Worked on CARS timing strategies and identifying question types. Student is improving in distinguishing between reasoning beyond the text vs. reasoning within the text questions. Current average is approximately 8 correct out of 11 in a typical passage set. Need to work more on philosophy and ethics passages.' },
    { id: '3', title: 'Biochemistry Content Evaluation', date: '2023-10-02', sessionId: 's3', type: 'Assessment', content: 'Student demonstrates strong understanding of amino acid structures and properties. Can identify all 20 amino acids and their properties. Ready to move forward with protein folding and enzyme kinetics. Recommended additional practice with amino acid pKa values and acid-base properties.' },
    { id: '4', title: 'Psychology Terms Review', date: '2023-09-25', sessionId: 's4', type: 'Session Notes', content: 'Reviewed major theories in social psychology including social learning theory, attribution theory, and cognitive dissonance. Student exhibits good recall of key terminology but needs more practice applying concepts to experimental scenarios.' },
    { id: '5', title: 'AAMC FL1 Analysis', date: '2023-09-18', sessionId: 's5', type: 'Exam Report', content: 'Full analysis of AAMC FL1 (score: 508). Strongest section: Psych/Soc (130). Weakest section: CARS (125). Reviewed all missed questions and identified content gaps in physics (circuits, optics) and CARS reasoning. Created targeted study plan for next three weeks focusing on these areas.' },
  ];

  // Handle report selection
  const handleReportSelect = (reportId: string) => {
    const report = previousReports.find(r => r.id === reportId);
    if (report) {
      setActiveReport(reportId);
      setSelectedSession(report.sessionId);
      setReportContent(report.content);
    }
  };

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReportContent(e.target.value);
  };

  // Clear form for new report
  const handleNewReport = () => {
    setActiveReport(null);
    setReportContent('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Simple document editor */}
        <div className="flex-1 flex flex-col h-full overflow-hidden mr-6">
          {/* Session selector */}
          <div className="px-6 py-6">
            <div className="flex flex-col">
              <select
                id="session-select"
                className="p-3 bg-white rounded-lg text-sm w-full shadow-sm focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                value={selectedSession || ''}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="">-- Select an MCAT tutoring session --</option>
                {tutoringSessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.date} - {session.topic}
                  </option>
                ))}
              </select>
            </div>

            {/* AI tools moved here */}
            <div className="flex gap-3 mt-3">
              <button 
                className="flex-1 py-3 bg-white rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
                disabled={!selectedSession}
              >
                Generate MCAT Progress Summary
              </button>
              <button 
                className="flex-1 py-3 bg-white rounded-lg text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
                disabled={!selectedSession}
              >
                Suggest Content Review Areas
              </button>
            </div>
          </div>

          {/* Document content area - simplified */}
          <div className="flex-1 overflow-auto px-6 pb-6">
            <div className="bg-white min-h-full p-6 shadow-md rounded-xl">
              <p className="text-text-secondary mb-4 text-sm">
                {selectedSession 
                  ? `${activeReport ? 'Editing' : 'Writing'} report for session: ${tutoringSessions.find(s => s.id === selectedSession)?.topic}`
                  : 'Please select an MCAT tutoring session above to begin your report'
                }
              </p>
              <textarea 
                className="w-full h-full min-h-[22rem] outline-none resize-none p-3 text-base bg-white focus:ring-2 focus:ring-primary/30 rounded-lg transition-all" 
                placeholder="Start typing your MCAT tutoring report here..."
                disabled={!selectedSession}
                value={reportContent}
                onChange={handleContentChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right side - Previous reports */}
        <div className="w-80 lg:w-96 h-full overflow-hidden flex flex-col bg-white shadow-lg rounded-l-2xl p-4">
          <div className="p-4">
            <p className="text-text-secondary text-sm mb-4">For: {studentName}</p>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search MCAT reports..." 
                className="w-full px-3 py-3 bg-gray-50 rounded-lg pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <svg className="absolute left-3 top-3.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 px-4">
            {previousReports.map(report => (
              <div 
                key={report.id}
                onClick={() => handleReportSelect(report.id)}
                className={`p-4 mb-3 rounded-xl cursor-pointer transition-all ${
                  activeReport === report.id 
                    ? 'bg-primary/10 shadow-md' 
                    : 'hover:bg-gray-50 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${activeReport === report.id ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                    <IoDocumentText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm truncate">{report.title}</h5>
                    <p className="text-xs text-text-secondary">Session date: {report.date}</p>
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">{report.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 mt-3">
            <button 
              className="w-full py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              disabled={!selectedSession}
              onClick={handleNewReport}
            >
              {activeReport ? "Create New MCAT Report" : "Save MCAT Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView; 