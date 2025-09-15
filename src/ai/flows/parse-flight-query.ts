'use server';

/**
 * @fileOverview A flow to parse free-form text queries for flight searches using Gemini AI.
 *
 * - parseFlightQuery - A function that handles the flight query parsing process.
 * - ParseFlightQueryInput - The input type for the parseFlightQuery function.
 * - ParseFlightQueryOutput - The return type for the parseFlightQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseFlightQueryInputSchema = z.object({
  query: z.string().describe('The free-form text query for flight search.'),
});
export type ParseFlightQueryInput = z.infer<typeof ParseFlightQueryInputSchema>;

const ParseFlightQueryOutputSchema = z.object({
  destination: z.string().optional().describe('The destination of the flight.'),
  dates: z.string().optional().describe('The dates for the flight.'),
  otherDetails: z
    .string()
    .optional()
    .describe('Any other relevant details from the query.'),
});
export type ParseFlightQueryOutput = z.infer<typeof ParseFlightQueryOutputSchema>;

export async function parseFlightQuery(input: ParseFlightQueryInput): Promise<ParseFlightQueryOutput> {
  return parseFlightQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseFlightQueryPrompt',
  input: {schema: ParseFlightQueryInputSchema},
  output: {schema: ParseFlightQueryOutputSchema},
  prompt: `You are a flight search assistant. Extract the destination, dates, and any other relevant details from the following user query:\n\nQuery: {{{query}}}\n\nDestination:
Dates:
Other Details:`,
});

const parseFlightQueryFlow = ai.defineFlow(
  {
    name: 'parseFlightQueryFlow',
    inputSchema: ParseFlightQueryInputSchema,
    outputSchema: ParseFlightQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
