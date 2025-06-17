'use client'

import React from 'react';

// This component currently doesn't take any props, but could in the future
// for example, to disable buttons based on user permissions.
// interface PlatformConfigurationSectionProps {}

const PlatformConfigurationSection: React.FC = () => {
  const handleConfigButtonClick = (action: string) => {
    alert(`Placeholder: ${action} button clicked. Functionality to be implemented.`);
    // In a real app, this would trigger modals, navigation, or API calls.
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Platform Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">StudyVerse Settings</h3>
          <p className="text-sm text-gray-600 mb-3">General platform configurations and features.</p>
          <button 
            onClick={() => handleConfigButtonClick('Modify StudyVerse Settings')}
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Modify Settings
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Behavior</h3>
          <p className="text-sm text-gray-600 mb-3">Adjust Kalypso's responses, prompts, and learning parameters.</p>
          <button 
            onClick={() => handleConfigButtonClick('Configure AI Behavior')}
            className="w-full mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            Configure AI
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Content Redlines</h3>
          <p className="text-sm text-gray-600 mb-3">Define content guidelines, restricted topics, and review processes.</p>
          <button 
            onClick={() => handleConfigButtonClick('Manage Content Redlines')}
            className="w-full mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            Manage Redlines
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Appearance</h3>
          <p className="text-sm text-gray-600 mb-3">Customize themes, logos, and branding elements.</p>
          <button 
            onClick={() => handleConfigButtonClick('Adjust Platform Appearance')}
            className="w-full mt-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            Adjust Appearance
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlatformConfigurationSection; 