'use server';

/**
 * @fileOverview Generates personalized travel itineraries based on user preferences.
 *
 * - generateTravelItinerary - A function that generates travel itineraries.
 * - GenerateTravelItineraryInput - The input type for the generateTravelItinerary function.
 * - GenerateTravelItineraryOutput - The return type for the generateTravelItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTravelItineraryInputSchema = z.object({
  budget: z
    .string()
    .describe('The budget for the trip (e.g., $500-$1000, or "luxury").'),
  travelStyle: z
    .string()
    .describe(
      'The preferred travel style (e.g., adventure, relaxation, cultural exploration).' + 
      'Examples: adventure, relaxation, cultural exploration, budget, luxury'
    ),
  interests: z
    .string()
    .describe(
      'Specific interests (e.g., food, history, hiking, beaches).  ' +
      'Examples: food, history, hiking, beaches, nightlife'
    ),
  duration: z.string().describe('The duration of the trip in days.'),
  locationPreferences: z
    .string()
    .describe(
      'Preferred locations or regions (e.g., Europe, Southeast Asia, Caribbean).' +
      'Examples: Europe, Southeast Asia, Caribbean, Italy, France'
    ),
});

export type GenerateTravelItineraryInput = z.infer<
  typeof GenerateTravelItineraryInputSchema
>;

const GenerateTravelItineraryOutputSchema = z.object({
  itinerary: z
    .string()
    .describe(
      'A detailed travel itinerary with destination ideas and activity suggestions.'
    ),
});

export type GenerateTravelItineraryOutput = z.infer<
  typeof GenerateTravelItineraryOutputSchema
>;

export async function generateTravelItinerary(
  input: GenerateTravelItineraryInput
): Promise<GenerateTravelItineraryOutput> {
  return generateTravelItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTravelItineraryPrompt',
  input: {schema: GenerateTravelItineraryInputSchema},
  output: {schema: GenerateTravelItineraryOutputSchema},
  prompt: `You are a travel expert who creates personalized travel itineraries.

  Based on the user's preferences, generate a detailed travel itinerary with destination ideas and activity suggestions.
  Consider the budget, travel style, interests, duration, and location preferences provided by the user.
  Provide specific suggestions for destinations, accommodations, activities, and dining.

  Preferences:
  Budget: {{{budget}}}
  Travel Style: {{{travelStyle}}}
  Interests: {{{interests}}}
  Duration: {{{duration}}} days
  Location Preferences: {{{locationPreferences}}}

  Itinerary:`,
});

const generateTravelItineraryFlow = ai.defineFlow(
  {
    name: 'generateTravelItineraryFlow',
    inputSchema: GenerateTravelItineraryInputSchema,
    outputSchema: GenerateTravelItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
