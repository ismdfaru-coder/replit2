import { config } from 'dotenv';
config();

import '@/ai/flows/parse-flight-query.ts';
import '@/ai/flows/generate-travel-itineraries.ts';
import '@/ai/flows/flight-booking-assistant.ts';
