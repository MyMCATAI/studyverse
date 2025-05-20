export default function MyCaseStudy() {
  return (
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
  )
} 