import React, { useState } from 'react';

interface WeeklyCalendarModalProps {
  onComplete: (result: { success: boolean; action?: 'generate' | 'save' | 'reset' }) => Promise<boolean>;
  onClose: () => void;
}

const WeeklyCalendarModal: React.FC<WeeklyCalendarModalProps> = ({ onComplete, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studyHoursPerDay: 4,
    includeWeekends: true,
    examDate: '',
    startDate: '',
    endDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent, action: 'generate' | 'save' | 'reset') => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await onComplete({
        success: true,
        action,
      });
      
      if (success && action !== 'reset') {
        onClose();
      }
    } catch (error) {
      console.error('Error in calendar generation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-6 border-b border-[--theme-border-color]">
        <h2 className="text-2xl font-bold">Create Study Schedule</h2>
        <p className="text-sm opacity-75 mt-1">
          Generate a personalized study schedule based on your preferences
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Study Parameters</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Study Hours Per Day
                </label>
                <input
                  type="range"
                  name="studyHoursPerDay"
                  min="1"
                  max="12"
                  step="0.5"
                  value={formData.studyHoursPerDay}
                  onChange={handleChange}
                  className="w-full h-2 bg-[--theme-button-color] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>1 hour</span>
                  <span className="font-semibold">{formData.studyHoursPerDay} hours</span>
                  <span>12 hours</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeWeekends"
                  name="includeWeekends"
                  checked={formData.includeWeekends}
                  onChange={handleChange}
                  className="w-4 h-4 text-[--theme-emphasis-color] border-[--theme-border-color] rounded focus:ring-[--theme-emphasis-color]"
                />
                <label htmlFor="includeWeekends" className="ml-2 text-sm font-medium">
                  Include weekends in study schedule
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Timeline</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Date (optional)
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-[--theme-border-color] rounded-md bg-[--theme-leaguecard-color]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-[--theme-border-color] rounded-md bg-[--theme-leaguecard-color]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-[--theme-border-color] rounded-md bg-[--theme-leaguecard-color]"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Advanced Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[--theme-border-color] rounded-lg">
                <h4 className="font-medium mb-2">Practice Exams</h4>
                <p className="text-sm opacity-75">
                  We recommend taking a practice exam every 1-2 weeks, depending on your timeline.
                </p>
              </div>
              
              <div className="p-4 border border-[--theme-border-color] rounded-lg">
                <h4 className="font-medium mb-2">Content Distribution</h4>
                <p className="text-sm opacity-75">
                  We&apos;ll balance your study schedule across all MCAT topics based on their importance.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="p-6 border-t border-[--theme-border-color] flex flex-wrap gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-[--theme-border-color] rounded-md text-[--theme-text-color] hover:bg-[--theme-button-color]"
        >
          Cancel
        </button>
        
        <button
          onClick={(e) => handleSubmit(e, 'reset')}
          className="px-4 py-2 border border-[--theme-border-color] rounded-md text-[--theme-text-color] hover:bg-[--theme-button-color] flex items-center gap-2"
          disabled={isLoading}
        >
          Reset Schedule
        </button>
        
        <button
          onClick={(e) => handleSubmit(e, 'generate')}
          className="px-6 py-2 bg-[--theme-emphasis-color] text-[--theme-hover-text] rounded-md hover:opacity-90 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <span>Generate Schedule</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default WeeklyCalendarModal; 