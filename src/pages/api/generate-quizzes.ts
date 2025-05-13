import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { topic, numQuizzes = 10, questionsPerQuiz = 5 } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Construct the prompt for OpenAI
    const prompt = `
      Generate ${numQuizzes} different quizzes about ${topic}. 
      Each quiz should have ${questionsPerQuiz} multiple-choice questions with 4 options each.
      
      Format each quiz as a JSON array of questions. Each question should have the following properties:
      - question: The actual question text
      - options: An array of 4 possible answers
      - correctAnswer: The index (0-3) of the correct answer
      
      Make sure all questions are factually correct, educational, and appropriate for high school or college students.
      Each quiz should cover different aspects of ${topic}.
      
      Response should be a valid JSON array of quizzes, where each quiz is an array of question objects.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator who specializes in creating accurate, well-structured multiple-choice quizzes. You always return valid JSON that exactly matches the requested format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });

    // Extract and parse the generated quizzes
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }
    
    const parsedResponse = JSON.parse(content);
    
    // Validate and format the response
    if (!parsedResponse.quizzes || !Array.isArray(parsedResponse.quizzes)) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Send the quizzes back to the client
    return res.status(200).json({ quizzes: parsedResponse.quizzes });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ error: 'Failed to generate quizzes' });
  }
} 