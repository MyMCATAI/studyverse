export interface DataPulse {
  name: string;
  positive: number;
}

export interface FullLengthExam {
  dataPulses?: DataPulse[];
}

export interface EventResource {
  eventType?: string;
  studentName?: string;
  studentId?: string;
  activityTitle?: string;
  activityText?: string;
  hours?: number | string;
  duration?: string;
  status?: string;
  fullLengthExam?: FullLengthExam;
  examType?: string;
  examNumber?: string | number;
  fullTitle?: string;
  subject?: string;
  score?: string | number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: EventResource;
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