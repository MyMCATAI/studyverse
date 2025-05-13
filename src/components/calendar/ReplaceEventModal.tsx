import React, { useState } from 'react';
import { CalendarEvent } from '@/types/calendar';

interface ReplaceEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReplacementData) => void;
  event: CalendarEvent | null;
}

export interface ReplacementData {
  activityType: string;
  activityHours: number;
}

const ReplaceEventModal: React.FC<ReplaceEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  event
}) => {
  const [formData, setFormData] = useState<ReplacementData>({
    activityType: '',
    activityHours: 1
  });

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'activityHours' ? Number(value) : value
    });
  };

  return (
    <div className="fixed inset-0 bg-[--theme-shadow-color-darker] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[--theme-mainbox-color] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Replace Event</h2>
        <p className="mb-4 text-sm">
          Replacing: <span className="font-medium">{event.title}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Activity Type</label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="w-full p-2 border border-[--theme-border-color] rounded-md bg-[--theme-leaguecard-color]"
              required
            >
              <option value="">Select activity type</option>
              <option value="content_review">Content Review</option>
              <option value="practice_questions">Practice Questions</option>
              <option value="flashcards">Flashcards</option>
              <option value="reading">Reading</option>
              <option value="break">Break</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Hours</label>
            <input
              type="number"
              name="activityHours"
              value={formData.activityHours}
              onChange={handleChange}
              min="0.5"
              max="8"
              step="0.5"
              className="w-full p-2 border border-[--theme-border-color] rounded-md bg-[--theme-leaguecard-color]"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[--theme-border-color] rounded-md text-[--theme-text-color] hover:bg-[--theme-button-color]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[--theme-emphasis-color] text-[--theme-hover-text] rounded-md hover:opacity-90"
            >
              Replace Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplaceEventModal; 