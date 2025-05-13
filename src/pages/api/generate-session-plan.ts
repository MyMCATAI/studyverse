import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentName, studentQuestions, topics } = req.body;

    // Construct the prompt for OpenAI
    const prompt = `
      Create a simple, focused tutoring session plan for ${studentName} with ONLY three main sections.
      
      Recent questions: ${studentQuestions.map((q: any) => `${q.question}`).join(', ')}
      Topics to focus on: ${topics.join(', ')}
      
      Format the session plan in Markdown using EXACTLY this structure with no additional sections:
      
      # Tutoring Session Plan for ${studentName}
      
      ## Previous Session Quiz
      • Brief review of previous concepts (2-3 lines maximum)
      • 1-2 simple assessment questions
      
      ## Current Session Focus
      • Main topic: [one primary concept]
      • Key points to cover (maximum 3 points)
      • One clear example problem with solution
      
      ## Ending Session
      • Homework suggestion (1-2 problems)
      • Next session preview (1 line)
      
      Keep it extremely concise. Use proper indentation for lists with 2-space indents. Each section should be visually separated with proper spacing. Use bullet points consistently with the • character.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a minimalist education expert who specializes in creating focused, concise tutoring plans. Format your response using clean Markdown with proper indentation for hierarchical lists (using 2-space indents). Keep content brief and use ample spacing between sections."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract the generated plan
    const sessionPlan = completion.choices[0].message.content;

    // Send the plan back to the client
    return res.status(200).json({ plan: sessionPlan });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ error: 'Failed to generate session plan' });
  }
} 