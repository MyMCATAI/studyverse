'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type ContentType = 'all' | 'videos' | 'readings' | 'passages' | 'other'
type ContentItem = {
  id: string
  title: string
  type: 'video' | 'reading' | 'passage' | 'other'
  description: string
  thumbnail: string
  uploadedBy: string
  uploadDate: string
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  
  // Mock data - in a real app this would come from an API or database
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Introduction to Physics',
      type: 'video',
      description: 'An overview of basic physics concepts for beginners',
      thumbnail: '/placeholder-video.jpg',
      uploadedBy: 'Dr. Smith',
      uploadDate: '2023-05-15'
    },
    {
      id: '2',
      title: 'Advanced Mathematics',
      type: 'reading',
      description: 'Comprehensive textbook on advanced mathematics',
      thumbnail: '/placeholder-reading.jpg',
      uploadedBy: 'Prof. Johnson',
      uploadDate: '2023-06-10'
    },
    {
      id: '3',
      title: 'Chemistry Lab Procedures',
      type: 'other',
      description: 'Interactive guide for chemistry lab procedures',
      thumbnail: '/placeholder-other.jpg',
      uploadedBy: 'Lab Coordinator',
      uploadDate: '2023-04-22'
    }
  ]
  
  const filteredContent = contentItems.filter(item => {
    const matchesType = activeTab === 'all' || item.type === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })
  
  return (
    <div className="flex flex-col min-h-screen bg-[#001226]">
      {/* Navbar - same as home page for consistency */}
      <nav className="w-full bg-[#001226] shadow-md p-4 flex justify-between items-center text-white z-20">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <Image
                src="/StudyverseLogo.png"
                alt="Studyverse Logo"
                width={40}
                height={40}
              />
              <span className="text-xl">
                <span className="font-normal">STUDYVERSE</span> <span className="font-bold text-sky-300">STUDIO</span>
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/tutor" 
            className="relative px-6 py-2 rounded-md bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(14,165,233,0.8)] hover:brightness-110"
          >
            TUTOR
          </Link>
          
          <Link 
            href="/firm" 
            className="relative px-6 py-2 rounded-md bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(14,165,233,0.8)] hover:brightness-110"
          >
            FIRM
          </Link>
          
          <Link 
            href="/content" 
            className="relative px-6 py-2 rounded-md bg-gradient-to-r from-sky-500 to-sky-700 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(14,165,233,0.8)] hover:brightness-110"
          >
            CONTENT
          </Link>
        </div>
      </nav>

      <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Content Library</h1>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-sky-500 to-sky-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(14,165,233,0.8)] hover:brightness-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Upload Content
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'all' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('videos')} 
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'videos' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Videos
              </button>
              <button 
                onClick={() => setActiveTab('readings')} 
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'readings' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Readings
              </button>
              <button 
                onClick={() => setActiveTab('passages')} 
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'passages' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Passages
              </button>
              <button 
                onClick={() => setActiveTab('other')} 
                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'other' ? 'bg-sky-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Other
              </button>
            </div>
            
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.length > 0 ? (
              filteredContent.map(item => (
                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 relative">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <span className="text-gray-400">Thumbnail</span>
                    </div>
                    <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold uppercase px-2 py-1 rounded">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{item.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By {item.uploadedBy}</span>
                      <span>{item.uploadDate}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12 text-gray-400">
                No content matches your search criteria.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4">Upload New Content</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Content Type</label>
                <select className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="video">Video</option>
                  <option value="reading">Reading</option>
                  <option value="passage">Passage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input type="text" className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea className="w-full bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 h-24"></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">File</label>
                <div className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center">
                  <span className="text-gray-400">Drag and drop or click to select</span>
                  <input type="file" className="hidden" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-700 text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 