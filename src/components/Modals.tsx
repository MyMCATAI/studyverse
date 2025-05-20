interface ModalsProps {
  showVideoModal: boolean;
  closeVideoModal: () => void;
  showCodePrompt: boolean;
  closeCodePrompt: () => void;
  showCalendarModal: boolean;
  closeCalendarModal: () => void;
  targetUrl: string | null;
  enteredCode: string;
  setEnteredCode: (code: string) => void;
  codeError: string | null;
  checkCode: () => void;
  handleCodeKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Modals({
  showVideoModal,
  closeVideoModal,
  showCodePrompt,
  closeCodePrompt,
  showCalendarModal,
  closeCalendarModal,
  targetUrl,
  enteredCode,
  setEnteredCode,
  codeError,
  checkCode,
  handleCodeKeyPress
}: ModalsProps) {
  return (
    <>
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
            <p className="text-center text-white/80 mb-6">
              Please enter the developer code to access {targetUrl && (targetUrl.startsWith('http') ? 'external resource' : 'protected area')}.
            </p>
            <input
              type="password"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
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
    </>
  )
} 