export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
  activityType?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  color?: {
    bg: string;
    border: string;
    text: string;
  };
}

export interface ReplacementData {
  activityType: string;
  activityHours: number;
} 