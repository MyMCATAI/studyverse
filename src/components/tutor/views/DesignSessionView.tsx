import React, { useState } from 'react';
import ChatPanel from '../ChatPanel';

interface DesignSessionViewProps {
  studentName: string;
}

const DesignSessionView = ({ studentName }: DesignSessionViewProps) => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'uploads' | 'questions'>('uploads');
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState(
    `My job is to design MCAT tutoring sessions and then save them to prepare you better for your next one, based on practice tests and content review needs.`
  );

  // Example student uploads
  const studentUploads = [
    { name: 'AAMC FL 1 Results', file: 'Test.pdf', date: '2 days ago' },
    { name: 'CARS QPack 2 Practice', file: 'Test.pdf', date: '1 week ago' },
    { name: 'Bio/Biochem Section Bank', file: 'Test.pdf', date: '2 weeks ago' },
  ];

  // Example student questions
  const studentQuestions = [
    { id: 1, question: "I'm struggling with amino acid structures. Can we review those?", date: "2023-10-15", status: 'new' },
    { id: 2, question: "Need help with analyzing CARS passages efficiently.", date: "2023-10-18", status: 'pending' },
    { id: 3, question: "Could we practice more Physics calculations related to circuits?", date: "2023-10-20", status: 'addressed' },
  ];

  // Function to generate a session plan
  const generateSessionPlan = async () => {
    try {
      setIsGenerating(true);
      
      const response = await fetch('/api/generate-session-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          studentQuestions,
          topics: ['Biochemistry', 'CARS strategies', 'Physics circuits', 'Psych/Soc terminology'] // MCAT topics
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate session plan');
      }
      
      const data = await response.json();
      
      // Update the chat with the generated session plan
      setInitialChatMessage(data.plan + '\n\nHow does this MCAT tutoring plan look? I can refine it further based on your feedback.');
      
    } catch (error) {
      console.error('Error generating session plan:', error);
      setInitialChatMessage(`I'm sorry, I encountered an error while generating the MCAT tutoring plan. Please try again later or refine the session manually.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
  <div className="flex flex-col md:flex-row gap-6 h-full">
    {/* Content panel on the left */}
      <div className="md:w-2/5 bg-white rounded-2xl shadow-md p-6 overflow-y-auto border border-gray-100">
        {/* Tabbed Content for Student Material - Now at the top */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-3 px-4 text-sm font-medium transition-all relative ${
                activeTab === 'uploads' 
                  ? 'text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('uploads')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                MCAT Practice Tests
              </div>
              {activeTab === 'uploads' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              className={`py-3 px-4 text-sm font-medium transition-all relative ${
                activeTab === 'questions' 
                  ? 'text-primary' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('questions')}
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Content Questions
                <span className="ml-2 bg-primary/15 text-primary text-xs py-0.5 px-2 rounded-full">
                  {studentQuestions.length}
                </span>
              </div>
              {activeTab === 'questions' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Student Uploads Tab Content */}
          {activeTab === 'uploads' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 pr-1">
                {studentUploads.map((upload, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-white rounded-xl border border-gray-100 flex items-center cursor-pointer hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                    onClick={() => setSelectedPdf(upload.file)}
                  >
                    <div className="w-10 h-10 mr-4 flex-shrink-0 bg-red-50 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{upload.name}</p>
                        <span className="text-xs text-gray-500">{upload.date}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        {upload.file}
                      </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                ))}
              </div>

              {/* Upload button */}
              <button 
                className="w-full py-3 px-4 bg-space-blue-50 hover:bg-space-blue-100 rounded-lg text-space-blue-800 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload MCAT Practice Results
              </button>

              {/* PDF Viewer */}
              {selectedPdf && (
                <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                  <div className="bg-space-blue-50 p-3 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mr-2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span className="text-sm font-medium">{selectedPdf}</span>
                    </div>
                    <button 
                      className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                      onClick={() => setSelectedPdf(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  <iframe 
                    src={`/${selectedPdf}`} 
                    className="w-full h-80"
                    title="PDF Viewer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Student Questions Tab Content */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              <div className="pr-1">
                {studentQuestions.map((item) => (
                  <div key={item.id} className="p-4 mb-3 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-medium">{item.question}</p>
                      <span className={`text-xs py-1 px-2 rounded-full ${
                        item.status === 'new' ? 'bg-blue-50 text-blue-600' :
                        item.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {item.status === 'new' ? 'New' : 
                         item.status === 'pending' ? 'Pending' : 
                         'Addressed'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Submitted: {item.date}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Add Question button */}
              <button 
                className="w-full py-3 px-4 bg-space-blue-50 hover:bg-space-blue-100 rounded-lg text-space-blue-800 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add MCAT Content Question
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* ChatPanel on the right - now with Generate buttons */}
      <div className="md:w-3/5 flex flex-col">
        {/* ChatPanel container takes the rest of the height */}
        <div className="flex-grow max-h-[85vh] border border-gray-100 rounded-xl shadow-md bg-white overflow-hidden">
          <ChatPanel 
            initialMessage={initialChatMessage}
            studentName={studentName}
            onGeneratePlan={generateSessionPlan}
            isGenerating={isGenerating}
            lastSessionDate="October 12, 2023"
            lastSessionTopics={['Amino acid structures and properties', 'CARS passage analysis techniques']}
            nextSessionGoals={['Practice Physics circuits problems', 'Review enzyme kinetics', 'Work on CARS timing strategies']}
          />
        </div>
      </div>
  </div>
);
};

export default DesignSessionView; 