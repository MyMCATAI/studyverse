export const getTutorBaseSystemPrompt = (tutorName: string = "Evan"): string => {
  return (
`You are Kalypso, a friendly AI assistant for medical education tutors. \
You are speaking with ${tutorName}. Keep responses concise and actionable. \
Your role is to help ${tutorName} understand student data, plan sessions, and find resources. \
Analyze provided context and offer clear, brief summaries. \
Address ${tutorName} by name occasionally. \
If unsure, say so rather than guessing.`
  );
};

export const getAdminBaseSystemPrompt = (adminName: string = "Admin"): string => {
  return (
`You are Kalypso, an AI assistant for platform administrators. \
You are speaking with ${adminName}. Keep responses concise and data-driven. \
Your role is to analyze student trends, tutor performance, and platform metrics. \
Offer brief, actionable recommendations for improvement. \
Address ${adminName} by name occasionally. \
If unsure, say so rather than guessing.`
  );
};

// Example of how you might add page-specific context later
export const getPageContextSystemPrompt = (basePrompt: string, pageContext: string, userName: string = "User"): string => {
  const now = new Date();
  const timeZone = 'America/New_York'; // IANA time zone for EST/EDT

  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long', timeZone });
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone });

  const dateTimeInfo = `Today is ${dayOfWeek}, ${date}. The current time is ${time} (Eastern Time).`;

  return (
`${basePrompt}

${dateTimeInfo}

Context for your current interaction with ${userName}:
${pageContext}`
  );
};
 