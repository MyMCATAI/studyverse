'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, CheckCircle, Clock, FileText, LucideIcon, Play, Users, ArrowLeft, ChevronRight, Award } from 'lucide-react'

// Interface for training modules
interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  icon: LucideIcon;
}

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'passage';
  duration: string;
  completed: boolean;
}

export default function TrainingPage() {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  
  // Sample training modules
  const trainingModules: Module[] = [
    {
      id: 1,
      title: "Introduction to Tutoring",
      description: "Learn the fundamentals of effective tutoring and establish your foundation as a tutor.",
      duration: "2 hours",
      progress: 100,
      status: 'completed',
      icon: Users,
      lessons: [
        { id: 101, title: "Role of a Tutor", type: "video", duration: "15 min", completed: true },
        { id: 102, title: "Setting Expectations", type: "reading", duration: "20 min", completed: true },
        { id: 103, title: "Communication Basics", type: "video", duration: "25 min", completed: true },
        { id: 104, title: "Introduction Quiz", type: "quiz", duration: "20 min", completed: true },
      ]
    },
    {
      id: 2,
      title: "Teaching Methodologies",
      description: "Explore various teaching methods and when to apply them effectively.",
      duration: "3 hours",
      progress: 66,
      status: 'in-progress',
      icon: BookOpen,
      lessons: [
        { id: 201, title: "Student-Centered Learning", type: "video", duration: "30 min", completed: true },
        { id: 202, title: "Socratic Method", type: "reading", duration: "25 min", completed: true },
        { id: 203, title: "Problem-Based Learning", type: "video", duration: "20 min", completed: false },
        { id: 204, title: "Methodology Practice", type: "assignment", duration: "45 min", completed: false },
        { id: 205, title: "Teaching Methods Quiz", type: "quiz", duration: "30 min", completed: false },
      ]
    },
    {
      id: 3,
      title: "Subject Matter Expertise",
      description: "Deepen your understanding of specific subject areas and common challenges students face.",
      duration: "4 hours",
      progress: 0,
      status: 'not-started',
      icon: FileText,
      lessons: [
        { id: 301, title: "STEM Subjects", type: "video", duration: "45 min", completed: false },
        { id: 302, title: "Humanities and Languages", type: "reading", duration: "30 min", completed: false },
        { id: 303, title: "Test Preparation", type: "video", duration: "35 min", completed: false },
        { id: 304, title: "Medical Concepts Passage Analysis", type: "passage", duration: "40 min", completed: false },
        { id: 305, title: "Subject Knowledge Quiz", type: "quiz", duration: "30 min", completed: false },
      ]
    },
    {
      id: 4,
      title: "Student Assessment",
      description: "Learn how to effectively assess student progress and provide constructive feedback.",
      duration: "2.5 hours",
      progress: 0,
      status: 'not-started',
      icon: CheckCircle,
      lessons: [
        { id: 401, title: "Formative Assessment", type: "video", duration: "25 min", completed: false },
        { id: 402, title: "Creating Effective Quizzes", type: "reading", duration: "20 min", completed: false },
        { id: 403, title: "Feedback Techniques", type: "video", duration: "30 min", completed: false },
        { id: 404, title: "Assessment Practice", type: "assignment", duration: "45 min", completed: false },
        { id: 405, title: "Assessment Methods Quiz", type: "quiz", duration: "30 min", completed: false },
      ]
    },
  ];

  // Function to render the appropriate status badge
  const renderStatusBadge = (status: 'not-started' | 'in-progress' | 'completed') => {
    if (status === 'completed') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">Completed</span>;
    }
    if (status === 'in-progress') {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">In Progress</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">Not Started</span>;
  };

  return (
    <div className="min-h-screen bg-[#e5eeff]">
      {/* Navbar */}
      <nav className="w-full bg-[#083462] shadow-md p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <Image
            src="/StudyverseLogo.png"
            alt="Studyverse Logo"
            width={40}
            height={40}
          />
          <span className="text-xl">
            <span className="font-normal">STUDYVERSE</span>
            <span className="text-teal-400 font-normal"> TUTOR</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            href="/tutor"
            className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
          >
            Dashboard
          </Link>
          
          <Link
            href="#reports"
            className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
          >
            Reports
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 pt-12">
        {!activeModule ? (
          <>
            {/* Training Dashboard */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Tutor Training Program</h1>
                <p className="text-gray-600 mt-2">Complete these modules to become a certified tutor</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">2/4</div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">5h</div>
                  <div className="text-sm text-gray-600">Total Progress</div>
                </div>
              </div>
            </div>

            {/* Certification Progress */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="text-teal-600" size={24} />
                <span>Certification Progress</span>
              </h2>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-teal-600 h-4 rounded-full"
                  style={{ width: '42%' }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-600">42% Complete</div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-800 mb-2">
                    <CheckCircle size={20} />
                  </div>
                  <div className="text-sm font-medium">Introduction</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 mb-2">
                    <Clock size={20} />
                  </div>
                  <div className="text-sm font-medium">Methodologies</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 mb-2">
                    <FileText size={20} />
                  </div>
                  <div className="text-sm text-gray-400">Subject Matter</div>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 mb-2">
                    <CheckCircle size={20} />
                  </div>
                  <div className="text-sm text-gray-400">Assessment</div>
                </div>
              </div>
            </div>

            {/* Training Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainingModules.map((module) => (
                <div 
                  key={module.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
                  onClick={() => setActiveModule(module)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          module.status === 'completed' ? 'bg-green-100 text-green-600' :
                          module.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <module.icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{module.title}</h3>
                          <p className="text-sm text-gray-500">{module.lessons.length} lessons • {module.duration}</p>
                        </div>
                      </div>
                      {renderStatusBadge(module.status)}
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className={`h-2 rounded-full ${
                          module.status === 'completed' ? 'bg-green-600' :
                          module.status === 'in-progress' ? 'bg-blue-600' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{module.progress}% complete</span>
                      <span>{module.lessons.filter(l => l.completed).length}/{module.lessons.length} lessons</span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-600">
                      {module.status === 'not-started' ? 'Start Module' : 
                      module.status === 'in-progress' ? 'Continue Module' :
                      'Review Module'}
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Module Detail View
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <button 
                className="flex items-center text-blue-600 mb-4"
                onClick={() => setActiveModule(null)}
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Back to All Modules</span>
              </button>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{activeModule.title}</h2>
                  <p className="text-gray-600 mt-1">{activeModule.description}</p>
                </div>
                {renderStatusBadge(activeModule.status)}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock size={16} />
                  <span>{activeModule.duration}</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <FileText size={16} />
                  <span>{activeModule.lessons.length} lessons</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <CheckCircle size={16} />
                  <span>{activeModule.lessons.filter(l => l.completed).length} completed</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className={`h-2 rounded-full ${
                    activeModule.status === 'completed' ? 'bg-green-600' :
                    activeModule.status === 'in-progress' ? 'bg-blue-600' :
                    'bg-gray-400'
                  }`}
                  style={{ width: `${activeModule.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Module Lessons</h3>
              <div className="space-y-3">
                {activeModule.lessons.map((lesson, index) => (
                  <div 
                    key={lesson.id} 
                    className={`p-4 border ${lesson.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'} rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        lesson.type === 'video' ? 'bg-blue-100 text-blue-600' :
                        lesson.type === 'reading' ? 'bg-purple-100 text-purple-600' :
                        lesson.type === 'quiz' ? 'bg-amber-100 text-amber-600' :
                        lesson.type === 'passage' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {lesson.type === 'video' && <Play size={18} />}
                        {lesson.type === 'reading' && <BookOpen size={18} />}
                        {lesson.type === 'quiz' && <FileText size={18} />}
                        {lesson.type === 'passage' && <FileText size={18} />}
                        {lesson.type === 'assignment' && <FileText size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Lesson {index + 1}</span>
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full capitalize bg-gray-100 text-gray-800">
                            {lesson.type}
                          </span>
                        </div>
                        <h4 className="font-medium">{lesson.title}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{lesson.duration}</span>
                      {lesson.completed ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <button className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          {index === 0 || activeModule.lessons[index-1].completed ? 'Start' : 'Locked'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 