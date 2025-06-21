import Image from 'next/image'

export default function KalypsoSection() {
  return (
    <div className="flex flex-col items-center mb-16">

      {/* Three feature cards */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tutors Card */}
          <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:scale-105 group aspect-square flex flex-col">
            <div className="p-6 flex flex-col items-center text-center h-full justify-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-[#083462] mb-3">For Tutors</h3>
              <p className="text-gray-600 leading-relaxed">Kalypso creates personalized lesson plans, remembers student data, and generates targeted homework assignments.</p>
            </div>
          </div>

          {/* Firms Card */}
          <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:scale-105 group aspect-square flex flex-col">
            <div className="p-6 flex flex-col items-center text-center h-full justify-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-[#083462] mb-3">For Firms</h3>
              <p className="text-gray-600 leading-relaxed">Kalypso handles scheduling, tracks tutor-student matching, and provides actionable analytics on business performance.</p>
            </div>
          </div>

          {/* Students Card */}
          <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:scale-105 group aspect-square flex flex-col">
            <div className="p-6 flex flex-col items-center text-center h-full justify-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="font-bold text-2xl text-[#083462] mb-3">For Students</h3>
              <p className="text-gray-600 leading-relaxed">Kalypso creates an interactive learning environment with personalized quizzes, flashcards, and progress tracking.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <a href="#tutors" className="px-8 py-3 bg-white text-[#083462] font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300 inline-flex items-center gap-2">
          Learn more about our solutions
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  )
} 