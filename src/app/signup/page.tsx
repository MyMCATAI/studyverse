'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const router = useRouter()

  const userTypes = [
    {
      id: 'tutor',
      title: "I'm a Tutor",
      icon: '🎓',
      bgGradient: 'from-blue-600/20 to-purple-600/20',
      route: '/tutor'
    },
    {
      id: 'firm',
      title: "I'm a Firm",
      icon: '🏢',
      bgGradient: 'from-purple-600/20 to-pink-600/20',
      route: '/firm'
    },
    {
      id: 'student',
      title: "I'm a Student",
      icon: '📚',
      bgGradient: 'from-teal-600/20 to-blue-600/20',
      route: '/student'
    }
  ]

  const handleCardClick = (route: string) => {
    router.push(route)
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #312e81 100%)'
    }}>
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-teal-400 rounded-full opacity-80 animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-blue-300 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-indigo-300 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/6 right-1/6 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
      </div>

      {/* Orbital rings */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div 
          className="w-96 h-96 border border-white/10 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-teal-400/20 rounded-full animate-spin"
          style={{ animationDuration: '15s', animationDirection: 'reverse' }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        {/* Logo and Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Image
              src="/StudyverseLogo.png"
              alt="Studyverse Logo"
              width={50}
              height={50}
              className="w-12 h-12 sm:w-15 sm:h-15 object-contain"
            />
            <h1 className="text-2xl sm:text-4xl font-bold text-white">
              <span className="font-normal">STUDYVERSE</span>{' '}
              <span className="text-teal-400">ALLIANCE</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Join our universe of learning and growth. Choose your path to get started.
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl w-full px-4">
          {userTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleCardClick(type.route)}
              className="relative group cursor-pointer transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
            >
              {/* Glow effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r ${type.bgGradient} rounded-2xl blur-sm group-hover:blur-none transition-all duration-300 opacity-75 group-hover:opacity-100`}
              ></div>
              
              {/* Card content */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 sm:p-12 h-full flex flex-col items-center justify-center text-center hover:bg-white/20 transition-all duration-300 group-hover:border-white/40">
                <div className="text-6xl sm:text-8xl mb-6 transform group-hover:scale-125 transition-transform duration-300">
                  {type.icon}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-teal-300 transition-colors duration-300">
                  {type.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Already have an account?{' '}
            <a href="/login" className="text-teal-400 hover:text-teal-300 transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 