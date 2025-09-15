"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { generateTravelItinerary } from "@/ai/flows/generate-travel-itineraries";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z.object({
  locationPreferences: z.string().min(2, "Please enter a location or region."),
  duration: z.string().min(1, "Please enter the trip duration."),
  budget: z.string().min(2, "Please specify your budget."),
  travelStyle: z.string().min(2, "Please select your travel style."),
  interests: z.string().min(3, "Please list some interests."),
});

export function ItineraryForm() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationPreferences: "",
      duration: "7",
      budget: "Mid-range",
      travelStyle: "Relaxation",
      interests: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
        const response = await generateTravelItinerary(values);
        setResult(response.itinerary);
    } catch(e) {
        setError("Sorry, something went wrong while generating your itinerary. Please try again.")
        console.error(e);
    }
    setLoading(false);
  }

  return (
    <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="locationPreferences"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Italy, Southeast Asia" {...field} />
                        </FormControl>
                        <FormDescription>Where are you dreaming of going?</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration (in days)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 7" {...field} />
                        </FormControl>
                        <FormDescription>How long will your trip be?</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your budget range" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Budget-friendly">Budget-friendly</SelectItem>
                                    <SelectItem value="Mid-range">Mid-range</SelectItem>
                                    <SelectItem value="Luxury">Luxury</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="travelStyle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Travel Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your travel style" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Adventure">Adventure</SelectItem>
                                    <SelectItem value="Relaxation">Relaxation</SelectItem>
                                    <SelectItem value="Cultural exploration">Cultural Exploration</SelectItem>
                                    <SelectItem value="Family-fun">Family Fun</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Interests & Activities</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., hiking, beaches, history, nightlife, food..." {...field} />
                    </FormControl>
                    <FormDescription>What do you love to do on vacation?</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={loading} size="lg">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Itinerary
                    </>
                )}
            </Button>
        </form>
        </Form>
        
        {result && (
            <Card className="mt-10">
                <CardHeader>
                    <CardTitle>Your Custom Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap">
                        {result}
                    </div>
                </CardContent>
            </Card>
        )}

        {error && (
            <div className="mt-10 text-destructive">{error}</div>
        )}
    </div>
  );
}
