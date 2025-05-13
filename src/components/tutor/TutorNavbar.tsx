import React from 'react';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TutorNavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TutorNavbar: React.FC<TutorNavbarProps> = ({ 
  toggleSidebar,
  isSidebarOpen
}) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#083462] shadow-md p-4 flex justify-between items-center text-white z-20">
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
          href="/training" 
          className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
        >
          Training
        </Link>
        
        <Link 
          href="#reports" 
          className="relative px-6 py-2 rounded-md bg-teal-600 text-white font-semibold tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white hover:scale-105 hover:shadow-md active:bg-teal-800 active:text-white"
        >
          Reports
        </Link>
      </div>
    </nav>
  );
};

export default TutorNavbar; 