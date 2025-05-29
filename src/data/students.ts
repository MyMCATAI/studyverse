export interface StudentHiddenInsights {
  recentCommunications?: string[];
  performanceMetrics?: {
    latestMCATScore?: {
      score: number;
      date: string;
      trend?: 'improved' | 'declined' | 'stable';
    };
    strengths?: string[];
    areasForImprovement?: string[];
  };
  personalNotes?: string[];
}

export interface Student {
  id: number;
  name: string;
  summary: string;
  progress: number;
  schedule: string;
  bio: string;
  lastSessionSummary?: string;
  hiddenInsights?: StudentHiddenInsights;
}

export const STUDENTS_DATA: Student[] = [
  { 
    id: 1, 
    name: "Emma Thompson", 
    summary: "3rd year medical student, focused on cardiology, struggling with ECG interpretation",
    progress: 68,
    schedule: "Next session: Thursday, 3:00 PM",
    bio: "Emma is a highly motivated 3rd-year med student with a strong grasp of foundational sciences but finds the nuances of ECG interpretation challenging, especially differentiating between various arrhythmias and ischemic patterns. She aims to solidify her understanding for her upcoming cardiology rotation.",
    lastSessionSummary: "Last session focused on basic ECG lead placement and axis determination. Emma showed good progress but requested more practice with rhythm strips.",
    hiddenInsights: {
      recentCommunications: ["Sent a message last Friday asking about effective study strategies for the upcoming long weekend, specifically how to balance review with new material."],
      performanceMetrics: {
        latestMCATScore: { score: 508, date: "2024-04-15", trend: "improved" },
        strengths: ["Strong in Biology/Biochemistry sections", "Good critical thinking in CARS but struggles with timing"],
        areasForImprovement: ["CARS passage timing", "Organic Chemistry reaction mechanisms", "Physics (Optics)"]
      },
      personalNotes: ["Seems a bit anxious about the cardiology rotation but is very proactive in seeking help."]
    }
  },
  { 
    id: 2, 
    name: "James Wilson", 
    summary: "2nd year student, needs help with neurology fundamentals and neuroanatomy",
    progress: 42,
    schedule: "Next session: Monday, 5:30 PM",
    bio: "James is in his 2nd year and is finding the volume of information in neuroanatomy and neurophysiology overwhelming. He struggles with localizing lesions and understanding complex neural pathways. He learns best with visual aids and case-based discussions.",
    lastSessionSummary: "We reviewed the major structures of the brainstem and cranial nerves. James found a mnemonic for cranial nerves helpful and asked for more clinical correlates next time.",
    hiddenInsights: {
      performanceMetrics: {
        latestMCATScore: { score: 495, date: "2024-03-20", trend: "stable" },
        strengths: ["Good foundational science knowledge"],
        areasForImprovement: ["Application of knowledge to clinical scenarios", "Retaining large volumes of anatomical details", "Psych/Soc terminology"]
      },
      personalNotes: ["Responds well to structured study plans. Prefers visual learning aids."]
    }
  },
  { 
    id: 3, 
    name: "Sarah Chen", 
    summary: "4th year, preparing for pharmacology board exams, strong in theory",
    progress: 85,
    schedule: "Next session: Wednesday, 2:15 PM",
    bio: "Sarah is a sharp 4th-year student gearing up for her pharmacology boards. While her theoretical knowledge is excellent, she wants to focus on high-yield drug interactions, side effects, and clinical application scenarios to maximize her exam score.",
    lastSessionSummary: "Practiced several board-style questions on autonomic pharmacology. Sarah was quick with mechanisms of action but sometimes mixed up specific drug contraindications.",
    hiddenInsights: {
      recentCommunications: ["Asked if we could dedicate a session to just challenging pharmacology case studies next week."],
      performanceMetrics: {
        strengths: ["Excellent recall of drug mechanisms", "Strong understanding of pharmacokinetics"],
        areasForImprovement: ["Remembering less common but critical side effects", "Navigating multi-drug interaction scenarios quickly"]
      }
    }
  },
  { 
    id: 4, 
    name: "Michael Rodriguez", 
    summary: "1st year student, building foundational knowledge in anatomy and physiology",
    progress: 31,
    schedule: "Next session: Tuesday, 4:45 PM",
    bio: "Michael is a 1st-year student working hard to build a solid foundation. He sometimes gets lost in the details of anatomy and physiology and benefits from a big-picture overview before diving into specifics. He responds well to encouragement and structured learning plans.",
    lastSessionSummary: "Covered the basics of cellular transport mechanisms and homeostasis. Michael grasped active vs. passive transport but needs to review osmosis and tonicity.",
    hiddenInsights: {
      performanceMetrics: {
        areasForImprovement: ["Connecting physiological concepts across different organ systems", "Maintaining confidence with complex topics", "Physics (Fluids)"]
      },
      personalNotes: ["Benefits from frequent check-ins and positive reinforcement. Sometimes hesitant to ask questions but opens up with encouragement."]
    }
  }
]; 