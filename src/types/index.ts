
import { z } from "zod";

export const FlightLegSchema = z.object({
  airline: z.string(),
  airlineLogoUrl: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  duration: z.string(),
  stops: z.string(),
  fromCode: z.string().optional(),
  toCode: z.string().optional(),
});

export type FlightLeg = z.infer<typeof FlightLegSchema>;

export const FlightSchema = z.object({
  id: z.string(),
  legs: z.array(FlightLegSchema),
  price: z.number(),
  provider: z.string(),
  // legacy fields for compatibility with AI chat
  airline: z.string().optional(),
  airlineLogoUrl: z.string().optional(),
  from: z.object({
    code: z.string(),
    time: z.string(),
    airport: z.string(),
  }).optional(),
  to: z.object({
    code: z.string(),
    time: z.string(),
    airport: z.string(),
  }).optional(),
  duration: z.string().optional(),
  stops: z.number().optional(),
  emissions: z.object({
    co2: z.number(),
    comparison: z.string().optional(),
  }).optional(),
  stopDetails: z.string().optional(),
  ecoFriendly: z.boolean().optional(),
  sponsored: z.boolean().optional(),
});

export type Flight = z.infer<typeof FlightSchema>;
