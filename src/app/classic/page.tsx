
"use client";

import { useState } from "react";
import Image from "next/image";
import { ClassicSearchForm } from "@/components/classic-search-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExploreTabs } from "@/components/explore-tabs";
import { FlightFiltersSidebar } from "@/components/flight-filters-sidebar";
import FlightResultsView from "@/components/flight-results-view";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function FlightResultsSkeleton() {
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-4 w-1/3 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}


export default function ClassicPage() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const faqs = [
    {
        question: "How does FlyHigh work?",
        answer: "FlyHigh compares flights from major airlines and travel agents to find you the best deals. Our powerful search technology scans thousands of options to bring you the cheapest and fastest flights.",
    },
    {
        question: "How can I find the cheapest flight using FlyHigh?",
        answer: "You can sort results by price to see the cheapest options first. Also, try being flexible with your dates and airports for more deals.",
    },
    {
        question: "Where should I book a flight to right now?",
        answer: "Explore our 'Everywhere' search feature to see great deals to destinations all over the world. It's a great way to find inspiration for your next trip!",
    },
    {
        question: "Do I book my flight with FlyHigh?",
        answer: "FlyHigh helps you find the flights, but the booking is made directly with the airline or travel agent. We just connect you to them.",
    },
    {
        question: "Does FlyHigh do hotels too?",
        answer: "Yes! We also compare hotel and car hire deals to help you plan your entire trip in one place.",
    },
    {
        question: "What about car hire?",
        answer: "You can find great deals on car hire through our search. We compare prices from top providers to get you the best value.",
    },
    {
        question: "What's a Price Alert?",
        answer: "Set up a Price Alert for a flight you're interested in, and we'll notify you by email when the price goes up or down.",
    },
    {
        question: "Can I book a flexible flight ticket?",
        answer: "Many airlines offer flexible tickets. Look for the 'flexible ticket' filter in our search results to find options that allow changes.",
    },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pt-24">
      <Card className="w-full mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">
                Find your perfect flight with our traditional search.
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ClassicSearchForm onSearch={handleSearch} />
        </CardContent>
      </Card>
        
      {searchQuery ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <Card>
                    <FlightFiltersSidebar />
                </Card>
            </aside>
            <main className="md:col-span-3">
                 <Suspense fallback={<FlightResultsSkeleton />}>
                    <FlightResultsView query={searchQuery} layout="grid" />
                </Suspense>
            </main>
        </div>
      ) : (
        <div className="space-y-12">
            <Card className="w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-auto">
                         <Image
                            src="https://picsum.photos/800/600"
                            alt="Couple on a beach"
                            data-ai-hint="couple beach"
                            fill
                            className="object-cover"
                         />
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                        <h3 className="text-3xl font-bold mb-2">Sneak off on a romantic hotel stay</h3>
                        <p className="text-muted-foreground mb-4">Go further, get closer with prices you'll love.</p>
                        <Button className="self-start">Find your stay</Button>
                    </div>
                </div>
            </Card>

            <div>
                <h2 className="text-3xl font-bold text-center mb-8">Booking flights with FlyHigh</h2>
                <Accordion type="single" collapsible className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        {faqs.slice(0, 4).map((faq, i) => (
                             <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                        {faqs.slice(4).map((faq, i) => (
                             <AccordionItem key={i+4} value={`item-${i+4}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </div>
                </Accordion>
            </div>
            
            <div>
                 <h2 className="text-3xl font-bold text-center mb-4">Our international sites</h2>
                 <ExploreTabs />
            </div>
        </div>
      )}
    </div>
  );
}
