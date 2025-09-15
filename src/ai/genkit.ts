import 'server-only';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({ 
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY! 
  })],
  model: 'googleai/gemini-1.5-flash', // Use Flash model for faster responses
});
