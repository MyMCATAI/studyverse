import React, { useState, useEffect } from 'react';

interface ResourcesViewProps {
  studentName: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  approved?: boolean;
}

interface VideoResource {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

interface ReadingResource {
  title: string;
  filename: string;
  pages: number;
}

interface PassageResource {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  questions: number;
}

interface ManualAssignment {
  title: string;
  description: string;
}

const ResourcesView = ({ studentName }: ResourcesViewProps) => {
  const [activeCategory, setActiveCategory] = useState<'videos' | 'readings' | 'passages' | 'quizzes' | 'manual'>('videos');
  const [quizzes, setQuizzes] = useState<QuizQuestion[][]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResources, setSelectedResources] = useState<{
    videos: number[];
    readings: number[];
    passages: number[];
    quizzes: number[];
  }>({
    videos: [],
    readings: [],
    passages: [],
    quizzes: []
  });
  const [manualAssignment, setManualAssignment] = useState<ManualAssignment>({
    title: '',
    description: ''
  });
  const [quizQuestionCount, setQuizQuestionCount] = useState(10);
  const [quizCount, setQuizCount] = useState(3);
  const [viewingQuiz, setViewingQuiz] = useState<{ quizIndex: number, questionIndex: number } | null>(null);

  // Updated video data with the provided links
  const videos: VideoResource[] = [
    {
      id: 'J6R8zDAl_vw',
      title: 'Understanding Amino Acids: Structure and Properties',
      thumbnail: `https://img.youtube.com/vi/J6R8zDAl_vw/hqdefault.jpg`,
      duration: '12:45'
    },
    {
      id: 'DwBxI2QPsZU',
      title: 'Protein Synthesis: From Amino Acids to Proteins',
      thumbnail: `https://img.youtube.com/vi/DwBxI2QPsZU/hqdefault.jpg`,
      duration: '15:27'
    },
    {
      id: 'LHNNOIMt5x0',
      title: 'The 20 Amino Acids and Their Role in Protein Formation',
      thumbnail: `https://img.youtube.com/vi/LHNNOIMt5x0/hqdefault.jpg`,
      duration: '18:10'
    }
  ];

  // Mock data for readings
  const readings: ReadingResource[] = [
    {
      title: 'Amino Acids: Fundamental Building Blocks of Life',
      filename: 'Amino Acids.pdf',
      pages: 24
    },
    {
      title: 'Advanced Concepts in Amino Acid Chemistry',
      filename: 'Amino Acids 2.pdf',
      pages: 32
    }
  ];

  // Mock data for passages
  const passages: PassageResource[] = [
    {
      id: 'p1',
      title: 'Protein Synthesis and Regulation',
      subject: 'Biochemistry',
      difficulty: 'medium',
      wordCount: 850,
      questions: 8
    },
    {
      id: 'p2',
      title: 'Amino Acid Structure and Classification',
      subject: 'Biochemistry',
      difficulty: 'easy',
      wordCount: 650,
      questions: 5
    },
    {
      id: 'p3',
      title: 'Post-Translational Modifications',
      subject: 'Molecular Biology',
      difficulty: 'hard',
      wordCount: 1200,
      questions: 10
    }
  ];

  // Toggle selection of a resource
  const toggleResourceSelection = (type: 'videos' | 'readings' | 'passages' | 'quizzes', index: number) => {
    setSelectedResources(prev => {
      const newSelection = [...prev[type]];
      if (newSelection.includes(index)) {
        return {
          ...prev,
          [type]: newSelection.filter(i => i !== index)
        };
      } else {
        return {
          ...prev,
          [type]: [...newSelection, index]
        };
      }
    });
  };

  // Filter resources based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredReadings = readings.filter(reading => 
    reading.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    reading.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPassages = passages.filter(passage => 
    passage.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    passage.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate quizzes using OpenAI API
  const generateQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'Amino Acids',
          numQuizzes: quizCount,
          questionsPerQuiz: quizQuestionCount
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quizzes');
      }

      const data = await response.json();
      
      // Add an approved flag to each question
      const quizzesWithApproval = data.quizzes.map((quiz: QuizQuestion[]) => 
        quiz.map(q => ({ ...q, approved: false }))
      );
      
      setQuizzes(quizzesWithApproval);
    } catch (error) {
      console.error('Error generating quizzes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApproveQuestion = (quizIndex: number, questionIndex: number, approved: boolean) => {
    setQuizzes(prevQuizzes => {
      const newQuizzes = [...prevQuizzes];
      if (newQuizzes[quizIndex] && newQuizzes[quizIndex][questionIndex]) {
        newQuizzes[quizIndex][questionIndex].approved = approved;
      }
      return newQuizzes;
    });
  };
  
  const handleApproveAllQuestions = (quizIndex: number, approved: boolean) => {
    setQuizzes(prevQuizzes => {
      const newQuizzes = [...prevQuizzes];
      if (newQuizzes[quizIndex]) {
        newQuizzes[quizIndex] = newQuizzes[quizIndex].map(q => ({ ...q, approved }));
      }
      return newQuizzes;
    });
  };
  
  const navigateQuestion = (direction: 'prev' | 'next') => {
    if (!viewingQuiz) return;
    
    const { quizIndex, questionIndex } = viewingQuiz;
    const currentQuiz = quizzes[quizIndex];
    
    if (!currentQuiz) return;
    
    if (direction === 'next' && questionIndex < currentQuiz.length - 1) {
      setViewingQuiz({ quizIndex, questionIndex: questionIndex + 1 });
    } else if (direction === 'prev' && questionIndex > 0) {
      setViewingQuiz({ quizIndex, questionIndex: questionIndex - 1 });
    }
  };
  
  const getApprovedQuestionsCount = (quizIndex: number) => {
    if (!quizzes[quizIndex]) return 0;
    return quizzes[quizIndex].filter(q => q.approved).length;
  };

  useEffect(() => {
    if (activeCategory === 'quizzes' && quizzes.length === 0) {
      generateQuizzes();
    }
  }, [activeCategory]);

  const handleAssignHomework = () => {
    const assignedItems = {
      videos: selectedResources.videos.map(i => videos[i]),
      readings: selectedResources.readings.map(i => readings[i]),
      passages: selectedResources.passages.map(i => passages[i]),
      quizzes: selectedResources.quizzes.map(i => quizzes[i]),
      manual: activeCategory === 'manual' ? manualAssignment : null
    };
    
    console.log('Assigned homework:', assignedItems);
    // Here you would typically send this data to your API
    alert(`Homework assigned to ${studentName} successfully!`);
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search bar */}
        <div className="mb-6">
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
            <div className="px-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for learning resources for {studentName}..."
              className="w-full py-3 px-2 bg-transparent focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={handleAssignHomework}
              className="m-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Assign
            </button>
          </div>
        </div>
        
        {/* Resource category tabs */}
        <div className="mb-6">
          <div className="flex gap-6 bg-white rounded-lg p-1 inline-flex border border-gray-100 shadow-sm">
            <button 
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${activeCategory === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveCategory('videos')}
            >
              Videos
            </button>
            <button 
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${activeCategory === 'readings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveCategory('readings')}
            >
              Readings
            </button>
            <button 
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${activeCategory === 'passages' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveCategory('passages')}
            >
              Passages
            </button>
            <button 
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${activeCategory === 'quizzes' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveCategory('quizzes')}
            >
              Quizzes
            </button>
            <button 
              className={`py-2 px-4 text-sm font-medium rounded-md transition-all ${activeCategory === 'manual' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={() => setActiveCategory('manual')}
            >
              Custom
            </button>
          </div>
        </div>
        
        {/* Resource content */}
        <div className="mb-8">
          {/* Videos content */}
          {activeCategory === 'videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg overflow-hidden transition-all ${
                    selectedResources.videos.includes(index) 
                      ? 'ring-2 ring-indigo-500 shadow-md' 
                      : 'border border-gray-100 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-sm">
                      {video.duration}
                    </div>
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="bg-white/90 rounded-full p-3 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-800">{video.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => toggleResourceSelection('videos', index)}
                        className={`w-full py-1.5 rounded-md text-xs font-medium transition-colors ${
                          selectedResources.videos.includes(index)
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                        }`}
                      >
                        {selectedResources.videos.includes(index) ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Readings content */}
          {activeCategory === 'readings' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReadings.map((reading, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg overflow-hidden transition-all ${
                    selectedResources.readings.includes(index) 
                      ? 'ring-2 ring-indigo-500 shadow-md' 
                      : 'border border-gray-100 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="aspect-video bg-gray-50 flex items-center justify-center">
                    <div className="relative w-1/3 aspect-[3/4] bg-white rounded shadow-sm flex items-center justify-center border border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-800">{reading.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      {reading.filename} • {reading.pages} pages
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleResourceSelection('readings', index)}
                        className={`w-full py-1.5 rounded-md text-xs font-medium transition-colors ${
                          selectedResources.readings.includes(index)
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                        }`}
                      >
                        {selectedResources.readings.includes(index) ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Passages content */}
          {activeCategory === 'passages' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPassages.map((passage, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-lg overflow-hidden transition-all ${
                    selectedResources.passages.includes(index) 
                      ? 'ring-2 ring-indigo-500 shadow-md' 
                      : 'border border-gray-100 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="bg-indigo-50 p-4">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-white rounded-md shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        passage.difficulty === 'easy' 
                          ? 'bg-green-100 text-green-700' 
                          : passage.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {passage.difficulty.charAt(0).toUpperCase() + passage.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-gray-800">{passage.title}</h3>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{passage.subject}</span>
                      <span>{passage.wordCount} words</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      {passage.questions} questions
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleResourceSelection('passages', index)}
                        className={`w-full py-1.5 rounded-md text-xs font-medium transition-colors ${
                          selectedResources.passages.includes(index)
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                        }`}
                      >
                        {selectedResources.passages.includes(index) ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPassages.length === 0 && (
                <div className="col-span-full p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                  <p className="text-gray-500 mb-3 text-sm">No passages found matching your search</p>
                </div>
              )}
            </div>
          )}

          {/* Quizzes content */}
          {activeCategory === 'quizzes' && (
            <div>
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="w-full sm:w-1/4">
                    <label className="block text-xs text-gray-600 mb-1">Number of quizzes</label>
                    <select 
                      value={quizCount}
                      onChange={(e) => setQuizCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400"
                    >
                      <option value={1}>1 quiz</option>
                      <option value={2}>2 quizzes</option>
                      <option value={3}>3 quizzes</option>
                      <option value={4}>4 quizzes</option>
                      <option value={5}>5 quizzes</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label className="block text-xs text-gray-600 mb-1">Questions per quiz</label>
                    <select 
                      value={quizQuestionCount}
                      onChange={(e) => setQuizQuestionCount(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400"
                    >
                      <option value={5}>5 questions</option>
                      <option value={8}>8 questions</option>
                      <option value={10}>10 questions</option>
                      <option value={12}>12 questions</option>
                      <option value={15}>15 questions</option>
                    </select>
                  </div>
                  <div className="flex-1"></div>
                  <button 
                    onClick={generateQuizzes}
                    className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"
                  >
                    {loading ? 'Generating...' : 'Generate Quizzes'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : quizzes.length > 0 ? (
                  quizzes.map((quiz, index) => (
                    <div 
                      key={index} 
                      className={`bg-white rounded-lg p-3 transition-all ${
                        selectedResources.quizzes.includes(index) 
                          ? 'ring-2 ring-indigo-500 shadow-md' 
                          : 'border border-gray-100 shadow-sm hover:shadow'
                      }`}
                    >
                      <h3 className="font-medium text-sm text-gray-800">Quiz {index + 1}: Amino Acids</h3>
                      <p className="text-xs text-gray-500 mt-1 mb-2">
                        {quiz.length} multiple choice questions • Medium
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {getApprovedQuestionsCount(index)}/{quiz.length} questions approved
                        </span>
                        <button 
                          className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                          onClick={() => setViewingQuiz({ quizIndex: index, questionIndex: 0 })}
                        >
                          Review questions
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleResourceSelection('quizzes', index)}
                          className={`w-full py-1.5 rounded-md text-xs font-medium transition-colors ${
                            selectedResources.quizzes.includes(index)
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100'
                          }`}
                        >
                          {selectedResources.quizzes.includes(index) ? '✓ Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500 mb-3 text-sm">No quizzes generated yet</p>
                    <button 
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                      onClick={generateQuizzes}
                    >
                      Generate Quizzes
                    </button>
                  </div>
                )}
              </div>
              
              {/* Quiz question review modal */}
              {viewingQuiz !== null && quizzes[viewingQuiz.quizIndex] && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        Review Quiz {viewingQuiz.quizIndex + 1} Questions
                      </h3>
                      <button 
                        onClick={() => setViewingQuiz(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="p-4 overflow-y-auto flex-1">
                      {quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex] && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Question {viewingQuiz.questionIndex + 1} of {quizzes[viewingQuiz.quizIndex].length}</p>
                          <h4 className="font-medium text-base mb-3">
                            {quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].question}
                          </h4>
                          
                          <div className="space-y-2 mb-6">
                            {quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].options.map((option, i) => (
                              <div 
                                key={i} 
                                className={`p-2 rounded-md border ${
                                  i === quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].correctAnswer 
                                    ? 'border-green-200 bg-green-50' 
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                                    i === quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].correctAnswer 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span className="text-sm">{option}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs text-gray-500 mr-2">
                                {quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].approved 
                                  ? 'Approved' 
                                  : 'Not approved'}
                              </span>
                              <button 
                                onClick={() => handleApproveQuestion(
                                  viewingQuiz.quizIndex,
                                  viewingQuiz.questionIndex,
                                  !quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].approved
                                )}
                                className={`text-xs font-medium py-1 px-2 rounded ${
                                  quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].approved
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                }`}
                              >
                                {quizzes[viewingQuiz.quizIndex][viewingQuiz.questionIndex].approved 
                                  ? 'Unapprove' 
                                  : 'Approve'}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => navigateQuestion('prev')}
                                disabled={viewingQuiz.questionIndex === 0}
                                className={`p-1 rounded-full ${
                                  viewingQuiz.questionIndex === 0 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => navigateQuestion('next')}
                                disabled={viewingQuiz.questionIndex === quizzes[viewingQuiz.quizIndex].length - 1}
                                className={`p-1 rounded-full ${
                                  viewingQuiz.questionIndex === quizzes[viewingQuiz.quizIndex].length - 1 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {getApprovedQuestionsCount(viewingQuiz.quizIndex)}/{quizzes[viewingQuiz.quizIndex].length} questions approved
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleApproveAllQuestions(viewingQuiz.quizIndex, true)}
                          className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md text-xs font-medium border border-green-100 hover:bg-green-100 transition-colors"
                        >
                          Approve All
                        </button>
                        <button 
                          onClick={() => setViewingQuiz(null)}
                          className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-xs font-medium border border-gray-100 hover:bg-gray-100 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Manual Assignment content */}
          {activeCategory === 'manual' && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assignment Title</label>
                  <input 
                    type="text"
                    value={manualAssignment.title}
                    onChange={(e) => setManualAssignment({...manualAssignment, title: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400"
                    placeholder="Enter assignment title"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assignment Description</label>
                  <textarea
                    value={manualAssignment.description}
                    onChange={(e) => setManualAssignment({...manualAssignment, description: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400 h-24 resize-none"
                    placeholder="Enter detailed instructions for the assignment"
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Due date and submit section */}
        {(selectedResources.videos.length > 0 || 
          selectedResources.readings.length > 0 || 
          selectedResources.passages.length > 0 || 
          selectedResources.quizzes.length > 0 || 
          (activeCategory === 'manual' && manualAssignment.title)) && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <h3 className="font-medium text-sm text-gray-800 mb-3">Assignment Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Due Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notification</label>
                <select 
                  className="w-full px-3 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-400"
                >
                  <option value="none">No notification</option>
                  <option value="email">Email</option>
                  <option value="app">In-app</option>
                  <option value="both">Email & In-app</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleAssignHomework}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Assign to {studentName}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesView; 