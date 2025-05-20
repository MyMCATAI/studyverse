export default function TutorsSection() {
  return (
    <section id="tutors" className="py-24 bg-gradient-to-br from-teal-50 to-white relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-bold text-center text-[#083462] mb-16">Kalypso Helps Solve Hard Problems</h2>
        
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
  )
} 