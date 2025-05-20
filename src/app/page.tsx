'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Import components
import Navbar from '@/components/Navbar'
import Investment from '@/components/Investment'
import MyCaseStudy from '@/components/MyCaseStudy'
import KalypsoSection from '@/components/KalypsoSection'
import Modals from '@/components/Modals'

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
      <Navbar onGatedLinkClick={handleGatedLinkClick} />

      <Modals 
        showVideoModal={showVideoModal}
        closeVideoModal={closeVideoModal}
        showCodePrompt={showCodePrompt}
        closeCodePrompt={closeCodePrompt}
        showCalendarModal={showCalendarModal}
        closeCalendarModal={closeCalendarModal}
        targetUrl={targetUrl}
        enteredCode={enteredCode}
        setEnteredCode={setEnteredCode}
        codeError={codeError}
        checkCode={checkCode}
        handleCodeKeyPress={handleCodeKeyPress}
      />

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

      {/* Investment Section */}
      <Investment />
      
      {/* MyMCAT.ai Case Study - Moved below Investment */}
      <MyCaseStudy />

      {/* Tutors Section with Kalypso */}
      <section id="tutors" className="py-24 bg-gradient-to-br from-teal-50 to-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-[#083462] mb-16">Kalypso Helps Solve Hard Problems</h2>
          
          <KalypsoSection />
          
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

      <section className="py-24 bg-gradient-to-br from-[#083462] to-[#0a1c3b] text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-teal-400 filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-blue-500 filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white font-medium text-sm tracking-wider mb-6">GET STARTED</span>
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight max-w-4xl mx-auto">Create a world for your firm</h2>
          
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
              <span>Join Our Alliance</span>
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
                    <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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


