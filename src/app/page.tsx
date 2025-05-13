'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the Globe component to avoid SSR issues
const DynamicGlobe = dynamic(() => import('@/components/ui/globe').then(mod => mod.World), { ssr: false })

export default function Home() {
  const quoteRef = useRef<HTMLDivElement>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showCodePrompt, setShowCodePrompt] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const router = useRouter();
  
  // Sample data for the globe
  const globeData = [
    {
      order: 1,
      startLat: 37.7749,
      startLng: -122.4194,
      endLat: 40.7128,
      endLng: -74.0060,
      arcAlt: 0.3,
      color: '#4fd1c5'
    },
    {
      order: 2,
      startLat: 51.5074,
      startLng: -0.1278,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.2,
      color: '#4299e1'
    },
    {
      order: 3,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 22.3193,
      endLng: 114.1694,
      arcAlt: 0.25,
      color: '#38b2ac'
    },
    {
      order: 4,
      startLat: -33.8688,
      startLng: 151.2093,
      endLat: 1.3521,
      endLng: 103.8198,
      arcAlt: 0.3,
      color: '#2b6cb0'
    },
    {
      order: 5,
      startLat: 19.0760,
      startLng: 72.8777,
      endLat: 25.2048,
      endLng: 55.2708,
      arcAlt: 0.15,
      color: '#319795'
    }
  ];
  
  // Globe configuration with blue and teal highlights
  const globeConfig = {
    globeColor: '#083462',
    showAtmosphere: true,
    atmosphereColor: '#4fd1c5',
    atmosphereAltitude: 0.15,
    emissive: '#0d4e93',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: 'rgba(255,255,255,0.7)',
    ambientLight: '#ffffff',
    directionalLeftLight: '#4fd1c5',
    directionalTopLight: '#63b3ed',
    pointLight: '#81e6d9',
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: true,
    autoRotateSpeed: 0.5
  };
  
  const openVideoModal = () => {
    setShowVideoModal(true)
    document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
  }
  
  const closeVideoModal = () => {
    setShowVideoModal(false)
    document.body.style.overflow = '' // Re-enable scrolling
  }

  const openCalendarModal = () => {
    setShowCalendarModal(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  const closeCalendarModal = () => {
    setShowCalendarModal(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  const handleGatedLinkClick = (url: string) => {
    setTargetUrl(url);
    setShowCodePrompt(true);
    setEnteredCode('');
    setCodeError(null);
    document.body.style.overflow = 'hidden';
  };

  const closeCodePrompt = () => {
    setShowCodePrompt(false);
    setTargetUrl(null);
    setEnteredCode('');
    setCodeError(null);
    if (!showVideoModal) {
      document.body.style.overflow = '';
    }
  };

  const checkCode = () => {
    const correctCode = "TerribleFirewall";
    if (enteredCode === correctCode) {
      if (targetUrl) {
        if (targetUrl.startsWith('http')) {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        } else {
          router.push(targetUrl);
        }
      }
      closeCodePrompt();
    } else {
      setCodeError("Incorrect code. Please try again.");
    }
  };

  const handleCodeKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      checkCode();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <nav className="w-full bg-[#083462] shadow-md p-4 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-3">
          <Image
            src="/StudyverseLogo.png"
            alt="Studyverse Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl">
            <span className="font-normal">STUDYVERSE</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-white/90">
          <a href="#tutors" className="hover:text-white transition-colors">For Tutors</a>
          <a href="#firms" className="hover:text-white transition-colors">For Firms</a>
          <a href="#students" className="hover:text-white transition-colors">For Students</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleGatedLinkClick('/tutor')}
            className="relative px-8 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
          >
            Tutor
          </button>
          
          <button
            onClick={() => handleGatedLinkClick('https://mymcat.ai')}
            className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
          >
            Student
          </button>
        </div>
      </nav>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeVideoModal}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <iframe
              className="absolute w-full h-full"
              src="https://www.youtube.com/embed/_0jkXujlHdQ?si=SgXqn5UgqeanoFxX&autoplay=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
            <button 
              className="absolute top-4 right-4 bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              onClick={closeVideoModal}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Code Entry Prompt Modal */}
      {showCodePrompt && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeCodePrompt}>
          <div
            className="bg-gradient-to-br from-[#0a1c3b] to-[#083462] p-8 rounded-xl shadow-2xl w-full max-w-md text-white border border-white/20"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Enter Access Code</h3>
            <p className="text-center text-white/80 mb-6">Please enter the developer code to proceed.</p>
            <input
              type="password"
              value={enteredCode}
              onChange={(e) => {
                setEnteredCode(e.target.value);
                setCodeError(null);
              }}
              onKeyPress={handleCodeKeyPress}
              placeholder="Developer Code"
              className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
              autoFocus
            />
            {codeError && (
              <p className="text-red-400 text-sm mb-4 text-center">{codeError}</p>
            )}
            <div className="flex justify-center gap-4">
               <button
                onClick={checkCode}
                className="px-6 py-2 rounded-md bg-teal-500 hover:bg-teal-600 text-white font-semibold transition-colors duration-300"
              >
                Submit
              </button>
              <button
                onClick={closeCodePrompt}
                className="px-6 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4" onClick={closeCalendarModal}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-[#083462]">Schedule a Meeting</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeCalendarModal}
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <iframe 
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3hMOL4oJtFVHit6w6WyM2EuvBFRPoG59w6a-T0rU14-PWTIPMVRDlOx3PrYoVMpNYOVo4UhVXk?gv=true" 
                style={{ border: 0 }} 
                width="100%" 
                height="800" 
                frameBorder="0"
                title="Google Calendar Appointment Scheduling"
                className="w-full h-full min-h-[80vh]"
              />
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-screen overflow-hidden bg-[#171234]">
        {/* Background video */}
        <video
          className="absolute w-full h-full object-cover"
          src="/StarsTwinkling.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#10102a]/60 via-black/40 to-[#001435]/70" />
        
        {/* Gradient overlay for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#001435] to-transparent z-10"></div>
        
        {/* Content container */}
        <div className="relative z-10 container mx-auto px-4 min-h-[calc(100vh-5rem)] flex items-center justify-center">
          <div className="max-w-4xl w-full text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" 
               style={{ textShadow: '0 0 15px rgba(45, 212, 191, 0.5), 0 0 30px rgba(45, 212, 191, 0.3)' }}>
              Create a world of learning
            </h1>
            <p className="text-xl md:text-2xl text-white/90 my-8 mx-auto max-w-3xl">
              We help tutoring firms become 10x more effective by building personalized game worlds that their tutors can manage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <button 
                onClick={openVideoModal}
                className="bg-white text-[#083462] py-4 text-xl px-10 rounded-xl font-bold relative overflow-hidden group"
                style={{ 
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                }}
              >
                <div className="absolute inset-0 w-1/2 bg-white/20 skew-x-[-20deg] group-hover:skew-x-[-15deg] transition-all duration-1000 ease-out -translate-x-full group-hover:translate-x-[200%]"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Demo
                </span>
              </button>
              <button 
                onClick={openCalendarModal}
                className="bg-transparent text-white py-4 text-xl border-white border px-10 rounded-xl font-bold hover:bg-white/10 transition-all duration-300"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Bernie Quote Section */}
      <section 
        ref={quoteRef} 
        className="w-full py-16 relative bg-gradient-to-b from-[#011334] via-[#011334] to-[#0a4a8f]"
      >
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat mix-blend-screen"
          style={{ backgroundImage: 'url("/stars.jpeg")' }}
        />
        <div 
          className="flex flex-col md:flex-row items-center justify-center gap-8 mx-3 mb-12 container mx-auto px-4"
        >
          <div className="relative w-[260px] h-[260px]">
            <Image 
              src="/Bernie.svg" 
              alt="Bernie Sanders illustration" 
              width={260}
              height={260}
              priority
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-light text-white/80 mb-4 italic leading-relaxed" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)', fontFamily: 'Georgia, serif' }}>
              &ldquo;Higher education should be a right for all, not a privilege for the few.&rdquo;
            </h1>
            <p className="text-xl text-blue-100/70 font-normal italic" style={{ fontFamily: 'Georgia, serif' }}>
              Senator Bernie Sanders of Vermont
            </p>
          </div>
        </div>
      </section>

      <section id="learn-more" className="py-20 bg-gradient-to-b from-[#0d4e93] to-white relative overflow-hidden">
        {/* Background elements for modern UI */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400 filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600 filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center text-white mb-6">Kalypso Helps Solve Hard Problems</h2>
          <p className="text-xl text-center text-white/80 max-w-3xl mx-auto mb-8">
            Your out-of-this-world friend is an AI companion that&apos;s vertically integrated across every level of your business, making sure that your performance is excellent.
          </p>

          <div className="flex flex-col items-center">

            {/* Integrated layout with Kalypso on the left and cards on the right */}
            <div className="flex flex-col lg:flex-row gap-10 items-center max-w-6xl mx-auto mb-12">
              {/* Kalypso on the left side for desktop, or above on mobile */}
              <div className="w-full lg:w-2/5 flex justify-center">
                <div className="relative">
                  <div className="w-[330px] h-[330px] flex items-center justify-center">
                    <Image
                      src="/kalypsoeating.gif"
                      alt="Kalypso AI assistant"
                      width={330}
                      height={330}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md">
                    <p className="text-[#083462] font-medium text-sm">Your AI companion</p>
                  </div>
                </div>
              </div>

              {/* Three feature cards stacked vertically on the right */}
              <div className="w-full lg:w-3/5 space-y-4">
                {/* Tutors Card */}
                <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:translate-x-[5px] group">
                  <div className="p-5 flex items-center">
                    <div className="bg-teal-100 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                        <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-xl text-[#083462] mb-1">For Tutors</h3>
                      <p className="text-gray-600">Kalypso creates personalized lesson plans, remembers student data, and generates targeted homework assignments.</p>
                    </div>
                    <div className="ml-2 text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Firms Card */}
                <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:translate-x-[5px] group">
                  <div className="p-5 flex items-center">
                    <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-xl text-[#083462] mb-1">For Firms</h3>
                      <p className="text-gray-600">Kalypso handles scheduling, tracks tutor-student matching, and provides actionable analytics on business performance.</p>
                    </div>
                    <div className="ml-2 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Students Card */}
                <div className="bg-[#feffff] rounded-xl shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl hover:translate-x-[5px] group">
                  <div className="p-5 flex items-center">
                    <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-xl text-[#083462] mb-1">For Students</h3>
                      <p className="text-gray-600">Kalypso creates an interactive learning environment with personalized quizzes, flashcards, and progress tracking.</p>
                    </div>
                    <div className="ml-2 text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
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
        </div>
      </section>

      {/* Tutors Section */}
      <section id="tutors" className="py-24 bg-gradient-to-br from-teal-50 to-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <span className="text-teal-600 font-semibold text-lg mb-2 block tracking-wide">FOR TUTORS</span>
              <h2 className="text-4xl font-bold text-[#083462] mb-6">Make Tutors Better with AI Tools</h2>
              <p className="text-gray-600 text-lg mb-8">
                Our AI-powered platform helps tutors create personalized learning experiences, 
                generate course content, and track student progress — all in one place.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Adaptive Lesson Plans</h3>
                    <p className="text-gray-600">Create customized lesson plans in seconds based on student needs and learning objectives based on literature of effective tutoring sssions.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Assign Homework and Materials</h3>
                    <p className="text-gray-600">Find open source content or aut-generate targeted practice problems that adapt to each student&apos;s proficiency level.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Progress Analytics</h3>
                    <p className="text-gray-600">Make progress reports a conversation with Kalypso as he provides detailed analytics and identify areas that need attention.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#083462]/10">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-blue-500/20 mix-blend-multiply"></div>
                <div className="w-full h-[450px]">
                  <video
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Tutor.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Firms Section */}
      <section id="firms" className="py-24 bg-gradient-to-bl from-blue-50 to-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#083462]/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 mix-blend-multiply"></div>
                <div className="w-full h-[450px]">
                  <video
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Firm.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <span className="text-blue-600 font-semibold text-lg mb-2 block tracking-wide">FOR FIRMS</span>
              <h2 className="text-4xl font-bold text-[#083462] mb-6">Help Operations for Firms</h2>
              <p className="text-gray-600 text-lg mb-8">
                Streamline administrative tasks, optimize tutor scheduling, and gain actionable insights 
                with our comprehensive management dashboard.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Smart Scheduling</h3>
                    <p className="text-gray-600">Optimize tutor assignments and student schedules with AI-powered matching algorithms.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Business Analytics</h3>
                    <p className="text-gray-600">Get actionable insights into your tutoring business with detailed performance metrics.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Content Creation Tools</h3>
                    <p className="text-gray-600">Create engaging learning materials and resources with our intuitive content authoring system.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Students Section */}
      <section id="students" className="py-24 bg-gradient-to-br from-purple-50 to-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <span className="text-purple-600 font-semibold text-lg mb-2 block tracking-wide">FOR STUDENTS</span>
              <h2 className="text-4xl font-bold text-[#083462] mb-6">Engage Students in a Studyverse</h2>
              <p className="text-gray-600 text-lg mb-8">
                Create an immersive learning environment with gamified experiences, interactive content, 
                and personalized learning paths that make education exciting.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Gamified Learning</h3>
                    <p className="text-gray-600">Transform education into an adventure with achievement systems, challenges, and rewards.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Interactive Content</h3>
                    <p className="text-gray-600">Engage with dynamic learning materials that adapt to your learning style and pace.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-[#083462] mb-2">Personalized Learning</h3>
                    <p className="text-gray-600">Receive customized study plans and content that target your specific areas for improvement.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#083462]/10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 mix-blend-multiply"></div>
                <div className="w-full h-[450px]">
                  <video
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Student.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MyMCAT.ai Case Study - Redesigned - MOVED AFTER ALL THREE SECTIONS */}
      <section className="py-24 bg-white text-[#083462] relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-400 filter blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-blue-300 filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Case Study Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-[#083462]/10 text-[#083462] font-medium text-sm tracking-wider mb-4">CASE STUDY</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-[#083462]">MyMCAT.ai: A Case Study</h2>
              <p className="text-xl text-[#083462]/80 max-w-3xl mx-auto">
                We&apos;ve already built a studyverse for premeds in the hardest test in the world as a prototype for our company.
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-[#083462]/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-[#083462]/10 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-5xl font-bold text-[#083462] mb-3">1000+</h3>
                  <p className="text-lg text-[#083462]/80 mb-2">Active Students</p>
                </div>
                <p className="text-sm text-[#083462]/60 mt-2">
                  These students were captured with 0 paid ads over three months.
                </p>
              </div>

              <div className="bg-[#083462]/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-[#083462]/10 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-5xl font-bold text-[#083462] mb-3">2.8 hrs</h3>
                  <p className="text-lg text-[#083462]/80 mb-2">Peak Daily Usage</p>
                </div>
                <p className="text-sm text-[#083462]/60 mt-2">
                  Peak usage in Feb 2024. Overall is 1.8 hrs (4x Duolingo avg).
                </p>
              </div>

              <div className="bg-[#083462]/5 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-[#083462]/10 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <h3 className="text-5xl font-bold text-[#083462] mb-3">34%</h3>
                  <p className="text-lg text-[#083462]/80 mb-1">Percentile Jump</p>
                </div>
                <p className="text-sm text-[#083462]/60 mt-2">
                  Avg. for users &gt; 25 hrs study time (+11.2 MCAT points).
                </p>
              </div>
            </div>

            {/* Student Stars Section - Moved above the main testimonial video */}
            <h3 className="text-3xl font-bold mb-8 text-center text-[#083462]">Student Success Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Kaya - Now first/left */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl overflow-hidden shadow-md border border-[#083462]/10 flex flex-col items-center relative">
                <div className="w-full aspect-video relative">
                  <video 
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Kaya.mov"
                    controls
                    preload="auto"
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-4 w-full">
                  <h4 className="font-bold text-xl text-[#083462] mb-2">Kaya</h4>
                  <div className="flex text-yellow-400 mb-3 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-teal-600 mb-1">
                    43rd → 92nd Percentile
                  </p>
                  <p className="text-md text-[#083462]/80">
                    +19 Points
                  </p>
                </div>
              </div>

              {/* Sanjay - Now center */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl overflow-hidden shadow-md border border-[#083462]/10 flex flex-col items-center relative">
                <div className="w-full aspect-video relative">
                  <video 
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Sanjay.mov"
                    controls
                    preload="auto"
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-4 w-full">
                  <h4 className="font-bold text-xl text-[#083462] mb-2">Sanjay</h4>
                  <div className="flex text-yellow-400 mb-3 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-teal-600 mb-1">
                    48th → 85th Percentile
                  </p>
                  <p className="text-md text-[#083462]/80">
                    +16 Points
                  </p>
                </div>
              </div>
              
              {/* Eni - Now right */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl overflow-hidden shadow-md border border-[#083462]/10 flex flex-col items-center relative">
                <div className="w-full aspect-video relative">
                  <video 
                    className="w-full h-full object-cover"
                    src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/Eni.mov"
                    controls
                    preload="auto"
                    muted
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="p-4 w-full">
                  <h4 className="font-bold text-xl text-[#083462] mb-2">Eni</h4>
                  <div className="flex text-yellow-400 mb-3 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-teal-600 mb-1">
                    19th → 87th Percentile
                  </p>
                  <p className="text-md text-[#083462]/80">
                    +21 Points
                  </p>
                </div>
              </div>
            </div>

            {/* Main Video Testimonials - Now below the individual student videos */}
            <div className="mb-16 rounded-xl overflow-hidden shadow-lg border border-[#083462]/10 max-w-4xl mx-auto">
              <video
                className="w-full h-auto aspect-video"
                src="https://my-mcat.s3.us-east-2.amazonaws.com/studyverse/testimonials.mp4"
                controls
                playsInline
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            <div className="text-center mt-16">
              <a href="https://www.mymcat.ai" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-[#083462] text-white font-semibold rounded-xl hover:bg-[#083462]/90 transition-colors duration-300">
                Visit MyMCAT.ai
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-gradient-to-br from-[#083462] to-[#0a1c3b] text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-teal-400 filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-blue-500 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white font-medium text-sm tracking-wider mb-6">GET STARTED</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight max-w-4xl mx-auto">Ready to Transform Your Educational Experience?</h2>
          
          {/* Globe moved here, directly under the header */}
          <div className="w-full max-w-3xl h-[400px] rounded-lg overflow-hidden mx-auto mb-12">
            <DynamicGlobe globeConfig={globeConfig} data={globeData} />
          </div>
          
          <p className="text-xl max-w-3xl mx-auto mb-12 text-white/80">
            Join thousands of tutors, firms, and students who are revolutionizing education with Studyverse.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-xl mx-auto">
            <button 
              onClick={openCalendarModal}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white text-lg font-bold rounded-xl hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:-translate-y-1 flex-1 flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={openCalendarModal}
              className="px-8 py-4 bg-white/10 text-white text-lg font-bold rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 flex-1 flex items-center justify-center"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="py-20 bg-[#0a1c3b] text-white border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/StudyverseLogo.png"
                  alt="Studyverse Logo"
                  width={40}
                  height={40}
                />
                <span className="text-xl font-semibold">STUDYVERSE</span>
              </div>
              <p className="text-gray-400 mb-6">
                Revolutionizing education through AI-powered tools and immersive learning environments.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Solutions</h3>
              <ul className="space-y-4">
                <li><Link href="#tutors" className="text-gray-400 hover:text-white transition-colors">For Tutors</Link></li>
                <li><Link href="#firms" className="text-gray-400 hover:text-white transition-colors">For Firms</Link></li>
                <li><Link href="#students" className="text-gray-400 hover:text-white transition-colors">For Students</Link></li>
                <li><Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Request Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">Company</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Studyverse. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


