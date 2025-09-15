
'use server';

/**
 * @fileOverview A conversational AI flow for booking flights.
 *
 * - flightBookingAssistant - A function that handles the conversational flight booking process.
 * - FlightBookingInput - The input type for the flightBookingAssistant function.
 * - FlightBookingOutput - The return type for the flightBookingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Flight } from '@/types';

const FlightBookingInputSchema = z.object({
  conversationHistory: z.string().describe('The history of the conversation so far.'),
  availableFlights: z.array(z.any()).optional().describe('A list of available flights to be analyzed by the assistant.'),
});
export type FlightBookingInput = z.infer<typeof FlightBookingInputSchema>;

const FlightBookingOutputSchema = z.object({
  reply: z.string().describe('The assistant\'s reply to the user.'),
  isFlightDetailsComplete: z.boolean().describe('Whether all required flight details have been gathered.'),
  flightDetails: z.object({
    destination: z.string().optional().describe('The destination of the flight.'),
    origin: z.string().optional().describe('The origin of the flight.'),
    dates: z.string().optional().describe('The dates for the flight.'),
    passengers: z.number().optional().describe('The number of passengers.'),
  }).optional().describe('The extracted flight details, if complete.'),
});
export type FlightBookingOutput = z.infer<typeof FlightBookingOutputSchema>;

export async function flightBookingAssistant(input: FlightBookingInput): Promise<FlightBookingOutput> {
  return flightBookingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flightBookingAssistantPrompt',
  input: {schema: z.object({
    conversationHistory: z.string(),
    availableFlights: z.string().optional(),
  })},
  output: {schema: FlightBookingOutputSchema},
  prompt: `You are an expert travel agent AI. Your goal is to have a conversation with the user to gather all the necessary information to find and book a flight.
You need to determine the **origin**, **destination**, **dates**, and **number of passengers**.
Provide your responses as plain text without any markdown formatting (e.g., no bolding, no lists).

When the user provides a query, analyze it.

**If the user provides only partial information**, ask for the remaining details politely. Do NOT provide generic flight information or lengthy summaries about routes when you don't have the specific search parameters yet.

Example for a partial query like "Glasgow to Chennai":
"I can help you find flights from Glasgow to Chennai. What dates are you looking at and how many passengers will be traveling?"

If you have all the required information (origin, destination, dates, passengers), set 'isFlightDetailsComplete' to true and fill in the 'flightDetails' object. Then respond with:
"Searching the web and checking all major flight search providers to bring you the cheapest flight details for your journey..."

**Once all details are gathered and if a list of available flights is provided, you MUST analyze them and provide a summary. Your entire analysis and summary MUST be based *only* on the real flight data provided in 'availableFlights'. Do not use any mock, sample, or placeholder data. Use only the actual flight information from the ThorData API response.**

CRITICAL: Only use flight data from the 'availableFlights' parameter. Do not generate fake prices like $69, $169, $275 or fake airlines. Use the actual prices, airlines, and flight details from the live API response.

If the details in the user's request (e.g. origin/destination) do not match the provided 'availableFlights' data, you MUST inform the user about the mismatch and recommend they refine their search. DO NOT summarize the mismatched data.

Your summary should have three sections:
1.  **Best Flights**: Select the best flights from the PROVIDED DATA based on a balance of price, duration, and stops. Show the actual flight IDs, real prices (in £ GBP), actual airlines, and real flight times from the API response.
2.  **The Cheapest Flight**: Identify the flight with the lowest price from the PROVIDED DATA. Show the actual price from the API response.
3.  **The Fastest Flight**: Identify the flight with the shortest duration from the PROVIDED DATA. Show the actual duration from the API response.

Present the real flight details clearly for each category, using ONLY the provided ThorData API flight data as the source. Show real prices in £ (British Pounds) as returned by the API, not fake dollar amounts.

Keep your replies helpful and to the point.

Conversation history:
{{{conversationHistory}}}

{{#if availableFlights}}
Available flights for analysis:
{{{availableFlights}}}
{{/if}}

Assistant's next reply:
`,
});

const flightBookingAssistantFlow = ai.defineFlow(
  {
    name: 'flightBookingAssistantFlow',
    inputSchema: FlightBookingInputSchema,
    outputSchema: FlightBookingOutputSchema,
  },
  async (input) => {
    // Add retry logic for temporary API issues
    const maxRetries = 2;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { output } = await prompt({
          conversationHistory: input.conversationHistory,
          availableFlights: input.availableFlights
            ? JSON.stringify(input.availableFlights)
            : undefined,
        });
        return output!;
      } catch (error: any) {
        lastError = error;
        console.error(`AI Flow Error (attempt ${attempt}/${maxRetries}):`, error);
        
        // Don't retry for quota errors or auth errors
        if (error?.status === 429 || error?.status === 401 || error?.status === 403) {
          break;
        }
        
        // Wait before retry for temporary errors
        if (attempt < maxRetries && (error?.status === 503 || error?.message?.includes('overloaded'))) {
          console.log(`Retrying in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    // Handle specific error cases after retries
    if (lastError?.status === 503 || lastError?.message?.includes('overloaded')) {
      return {
        reply: "🤖 Google's AI service is experiencing high demand right now. Please try again in a moment.\n\n✈️ Good news: Flight search is still working perfectly! You can search for flights while the AI recovers.",
        isFlightDetailsComplete: false,
      };
    }
    
    if (lastError?.status === 429 || lastError?.message?.includes('quota')) {
      return {
        reply: "📊 I've reached my API usage limit for now. Please try again in a few minutes.\n\n✈️ Flight search is still available while we wait!",
        isFlightDetailsComplete: false,
      };
    }

    if (lastError?.status === 401 || lastError?.status === 403) {
      return {
        reply: "🔑 There's an API authentication issue. Please check your Google AI API key configuration.\n\n✈️ Flight search functionality is still working!",
        isFlightDetailsComplete: false,
      };
    }
    
    // Generic error fallback
    return {
      reply: "⚡ I encountered a temporary issue, but I'm still here to help!\n\n✈️ Flight search is working perfectly - please try searching for flights!",
      isFlightDetailsComplete: false,
    };
  }
);
