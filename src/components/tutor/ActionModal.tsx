import React from 'react';
import { X } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function ActionModal({
  isOpen,
  onClose,
  title,
  leftPanel,
  rightPanel,
}: ActionModalProps) {
  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-card-bg rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden border border-border-color">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border-color flex-shrink-0">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-error p-1 rounded-full hover:bg-hover-color transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area (Split Left/Right) */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 border-r border-border-color overflow-y-auto flex flex-col">
            {leftPanel}
          </div>

          {/* Right Panel */}
          <div className="w-1/2 overflow-y-auto p-6 bg-background">
            {rightPanel}
          </div>
        </div>
      </div>
    </div>
  );
} 