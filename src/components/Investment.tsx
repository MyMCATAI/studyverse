export default function Investment() {
  return (
    <section id="learn-more" className="py-20 bg-gradient-to-b from-[#0d4e93] to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600 filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl font-bold text-center text-white mb-8">Our Investment</h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl max-w-5xl mx-auto">
          <p className="text-xl text-gray-700 mb-6">
            <strong>We help tutoring companies succeed in the age of AI, with a focus on test prep.</strong>
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Our founder Prynce built this company after years of working as a tutor, instructor, and director at tutoring firms. He saw that these businesses needed better tools to grow without getting crushed by technology.
          </p>
          <p className="text-xl text-gray-700 mb-6">
            We create digital worlds so you can have immersive learning environments that seamlessly blend where students study and receive tutoring. This gives your tutoring firm a stronger brand presence and a more cohesive identity in students&apos; lives. No more disconnected tutoring sessions—students live in your learning world.
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Beyond branding, our system helps manage tutors more efficiently, increases revenue without raising costs, and improves student learning through smart technology that identifies exactly what each student needs help with.
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Students actually enjoy using our system because we&apos;ve made tutoring engaging and social. Tutors love it because they can be more effective with their limited time.
          </p>
          <p className="text-xl text-gray-700 mb-6">
            Our partnership is simple: we invest in your success for a yearly fee plus a share of subscriptions. In return, we help you market your services and scale your business.
          </p>
          <p className="text-2xl text-gray-700 font-semibold">
            Everything we do supports our mission: giving every student a tutor who truly cares about them.
          </p>
        </div>
      </div>
    </section>
  )
} 