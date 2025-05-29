import React from 'react';
import { WhiteboardContext, WhiteboardAction } from '../../types/kalypso';

interface KalypsoWhiteboardMessageProps {
  tutorName: string;
  pageContext: WhiteboardContext;
  onDismiss: () => void;
  onBlockAction?: (action: WhiteboardAction) => void;
}

const KalypsoWhiteboardMessage: React.FC<KalypsoWhiteboardMessageProps> = ({ tutorName, pageContext, onDismiss, onBlockAction }) => {
  const { greeting, subtitle, mainDescription, blocks } = pageContext;

  const handleBlockClick = (action?: WhiteboardAction) => {
    if (action && onBlockAction) {
      // For link types, we could still handle them here or expect parent to do so via callback
      if (action.type === 'link') {
        window.location.href = action.value;
      } else if (action.type === 'callback') {
        onBlockAction(action);
      }
    } else if (action) {
      // Fallback for link type if onBlockAction is not provided but action is a link
      if (action.type === 'link') {
        window.location.href = action.value;
      }
    }
  };

  return (
    <div className="p-6 mb-3 bg-slate-50 rounded-xl shadow-2xl text-slate-800 border border-slate-200 relative">
      <button 
        onClick={onDismiss} 
        className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 transition-colors"
        aria-label="Close welcome message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 className="text-2xl font-bold mb-2 text-blue-700">
        {greeting || `Welcome back, ${tutorName}!`}
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        {subtitle}
      </p>

      {mainDescription && (
        <p className="text-base text-slate-700 my-3 font-semibold">{mainDescription}</p>
      )}

      {blocks && blocks.length > 0 && (
        <div className="space-y-3 mt-3 mb-4">
          {blocks.map((block) => (
            <div 
              key={block.id} 
              className={`p-3 bg-slate-100 rounded-lg shadow-sm border border-slate-200 transition-all duration-200 ease-in-out ${block.action ? 'cursor-pointer hover:bg-slate-200 hover:shadow-md' : ''}`}
              onClick={() => handleBlockClick(block.action)}
            >
              <h3 className="text-md font-semibold text-blue-600 mb-1">{block.title}</h3>
              <p className="text-sm text-slate-600 mb-0 whitespace-pre-line">{block.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KalypsoWhiteboardMessage; 