export interface WhiteboardAction {
  text: string;
  type: 'link' | 'callback'; // 'link' to navigate, 'callback' to trigger a function on the parent page
  value: string; // URL for type 'link', or an identifier/data for 'callback'
}

export interface WhiteboardBlock {
  id: string; // Unique key for rendering
  title: string;
  description: string;
  action?: WhiteboardAction;
}

export interface WhiteboardContext {
  greeting?: string; // e.g., "Welcome back, Evan!"
  subtitle: string; // e.g., "Thursday, May 29, 2025 - 01:21 PM" or "Viewing Dashboard"
  mainDescription?: string; // e.g., "You have 3 upcoming sessions today."
  blocks: WhiteboardBlock[];
}

export interface KalypsoPageContext {
  whiteboard: WhiteboardContext;
  ai: string; // Context string for the AI model
} 