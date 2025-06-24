import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Studyverse',
  description: 'The page you are looking for does not exist. Return to Studyverse to explore our AI-powered tutoring platform infrastructure.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#083462] to-[#0a1c3b] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-4">Page Not Found</h2>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-white text-[#083462] font-semibold rounded-lg hover:bg-white/90 transition-colors"
          >
            Return Home
          </Link>
          
          <div className="text-white/60">
            <p>Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
              <Link href="/tutor" className="text-teal-300 hover:text-teal-200 underline">
                Tutor Dashboard
              </Link>
              <Link href="/admin" className="text-blue-300 hover:text-blue-200 underline">
                Admin Portal
              </Link>
              <Link href="/signup" className="text-purple-300 hover:text-purple-200 underline">
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}