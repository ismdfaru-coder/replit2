import { ItineraryForm } from "@/components/itinerary-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function ItineraryPlannerPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-24">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>AI Itinerary Planner</CardTitle>
          </div>
          <CardDescription>
            Describe your dream trip, and let our AI craft a personalized itinerary just for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItineraryForm />
        </CardContent>
      </Card>
    </div>
  );
}
