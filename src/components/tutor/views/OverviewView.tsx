import React, { useState } from 'react';

interface OverviewViewProps {
  studentName: string;
}

const OverviewView = ({ studentName }: OverviewViewProps) => {
  // Track selected test row
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  // Track modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data for the MCAT student
  const studentData = {
    consistencyScore: '76%',
    tutoringSessionsDone: 24,
    lastFullLengthScore: 508,
    targetScore: 515,
    mcatSections: {
      'Chem/Phys': 126,
      'CARS': 125, 
      'Bio/Biochem': 127,
      'Psych/Soc': 130
    },
    testHistory: [
      { id: 1, test: 'AAMC FL 1', date: '2023-10-02', score: 508, breakdown: '126/125/127/130' },
      { id: 2, test: 'CP Section Bank', date: '2023-09-28', score: 72, breakdown: '72%' },
      { id: 3, test: 'CARS QPack 1', date: '2023-09-20', score: 68, breakdown: '68%' },
      { id: 4, test: 'Blueprint FL 2', date: '2023-09-15', score: 506, breakdown: '125/124/128/129' }
    ]
  };

  // Helper to format date strings
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  // Handle test row click
  const handleTestRowClick = (testId: number) => {
    setSelectedTestId(testId);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Helper to get section score color
  const getSectionScoreColor = (score: number) => {
    if (score >= 129) return 'text-emerald-600';
    if (score >= 127) return 'text-blue-600';
    if (score >= 125) return 'text-amber-600';
    return 'text-red-600';
  };

  // Helper to get percentage score color
  const getPercentageScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  // Calculate MCAT score progress percentage
  const scoreProgressPercentage = Math.min(100, Math.round(studentData.lastFullLengthScore / studentData.targetScore * 100));

  return (
    <div className="h-full p-4">
      {/* Header with centered student name */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-text-primary">{studentName}</h2>
      </div>

      {/* Main content in a grid layout */}
      <div className="grid grid-cols-12 gap-5 h-[calc(100%-5rem)]">
        {/* Left column - Performance metrics */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* Metrics in stacked cards */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-3">Tutoring Sessions Done</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-text-primary">{studentData.tutoringSessionsDone}</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-3">Latest MCAT Score</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-text-primary">{studentData.lastFullLengthScore}</span>
              <span className="text-base font-medium text-emerald-500">↑ 5 pts</span>
            </div>
            <div className="mt-2">
              <div className="text-xs text-text-secondary mb-1">Target: {studentData.targetScore}</div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-blue-500" 
                  style={{ width: `${scoreProgressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-3">AAMC Content Mastery</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-text-primary">74%</span>
              <span className="text-base font-medium text-emerald-500">↑ 6%</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col">
            <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-3">Practice Consistency</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-text-primary">{studentData.consistencyScore}</span>
            </div>
            <div className="text-xs text-text-secondary mt-2">
              <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-700 rounded">Needs improvement: CARS practice</span>
            </div>
          </div>
        </div>
        
        {/* Center column - Test history (now wider and centered) */}
        <div className="col-span-6 bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-4 text-center">MCAT Practice Test History</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">Date</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">Test</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">Score</th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {studentData.testHistory.map(test => (
                  <tr 
                    key={test.id} 
                    onClick={() => handleTestRowClick(test.id)}
                    className={`
                      border-b border-gray-100 
                      cursor-pointer
                      transition-colors duration-200
                      hover:bg-gray-50
                      ${selectedTestId === test.id && isModalOpen ? 'bg-blue-50/30' : ''}
                    `}
                  >
                    <td className="py-4 px-4 text-base text-center">{formatDate(test.date)}</td>
                    <td className="py-4 px-4 text-base text-center">{test.test}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                        test.test.includes('FL') ? (
                          test.score >= 510 ? 'bg-emerald-100 text-emerald-800' :
                          test.score >= 505 ? 'bg-blue-100 text-blue-800' :
                          test.score >= 500 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        ) : (
                          test.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                          test.score >= 70 ? 'bg-blue-100 text-blue-800' :
                          test.score >= 60 ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        )
                      }`}>
                        {test.score}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-center text-text-secondary">
                      {test.breakdown}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Test selection helper text */}
          <div className="mt-4 text-center text-sm text-text-secondary opacity-75">
            Click a test to view the detailed analysis report
          </div>
        </div>
        
        {/* Right column - MCAT section performance */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-sm flex flex-col">
          <h4 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-4">MCAT Section Performance</h4>
          
          {/* Section scores - bar chart style */}
          <div className="flex-grow">
            {Object.entries(studentData.mcatSections).map(([section, score], index) => (
              <div key={section} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-base font-medium">{section}</span>
                  <span className={`text-base font-medium ${getSectionScoreColor(score)}`}>
                    {score}/132
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full ${
                      score >= 129 ? 'bg-emerald-500' :
                      score >= 127 ? 'bg-blue-500' :
                      score >= 125 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} 
                    style={{ width: `${Math.min(100, (score/132) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Study focus recommendation */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <h5 className="text-xs uppercase opacity-60 tracking-wide font-medium text-text-secondary mb-3">Recommended Focus</h5>
            <div className="py-2 px-3 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-amber-800 text-base">CARS - Schedule targeted practice sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen PDF Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="w-full h-full bg-white flex flex-col">
            <div className="flex justify-between p-4 bg-white border-b">
              <h3 className="text-lg font-medium">
                {studentData.testHistory.find(t => t.id === selectedTestId)?.test} Analysis Report
              </h3>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="flex-grow">
              <iframe 
                src="/test.pdf" 
                className="w-full h-full border-none"
                title="MCAT Test Analysis"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewView; 