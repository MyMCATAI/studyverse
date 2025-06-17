import Image from 'next/image'
import Link from 'next/link';

interface NavbarProps {
  onGatedLinkClick: (url: string) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Navbar({ onGatedLinkClick, isAuthenticated, onLogout }: NavbarProps) {
  return (
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
          <span className="font-normal">STUDYVERSE</span> <span className="text-teal-500">ALLIANCE</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-white/90">
        <a href="#insights" className="hover:text-white transition-colors">Insights</a>
        <a href="#tutors" className="hover:text-white transition-colors">Tutors</a>
        <a href="#firms" className="hover:text-white transition-colors">Firms</a>
        <a href="#students" className="hover:text-white transition-colors">Students</a>
      </div>
      
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="relative px-8 py-2 rounded-md bg-red-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-red-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-red-800 active:text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => onGatedLinkClick('/tutor')}
              className="relative px-8 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
            >
              Tutor Portal
            </button>
            
            <button
              onClick={() => onGatedLinkClick('https://mymcat.ai')}
              className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
            >
              Student Login
            </button>
          </>
        )}
      </div>
    </nav>
  )
} 