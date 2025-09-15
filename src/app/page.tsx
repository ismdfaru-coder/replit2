
"use client";

import { useState } from "react";
import { FlightSearchForm } from "@/components/flight-search-form";
import { AIChat } from "@/components/ai-chat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function Home() {
  const [initialQuery, setInitialQuery] = useState<string>("");
  const [showChat, setShowChat] = useState(false);

  const suggestedPrompts = [
    "Flights to Paris for a week in July",
    "Find hotels in New York City for New Year's Eve",
    "Weekend trip to London from Dublin",
    "Things to do in Rome for 3 days",
  ];

  const handleSearch = (query: string) => {
    setInitialQuery(query);
    setShowChat(true);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen text-center px-6 transition-all duration-500 ${showChat ? 'pt-24' : 'pt-[35vh]'}`}>
      <div className={`transition-all duration-500 ${showChat ? 'mb-8' : 'mb-16'}`}>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Meet your AI-powered Travel Guide
        </h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          One place to search and book flights at the best prices.
        </p>
      </div>

      {!showChat && (
        <>
          <div className="mb-8 w-full max-w-4xl">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl">
              {suggestedPrompts.map((prompt) => (
                <FlightSearchForm key={prompt} defaultQuery={prompt} asButton onSearch={handleSearch} />
              ))}
          </div>
        </>
      )}

      {showChat && (
         <div className="w-full max-w-4xl flex-grow">
            <Card className="w-full min-h-[75vh] flex flex-col bg-card/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">AI Flight Assistant</CardTitle>
                    </div>
                    <CardDescription>
                    Chat with our AI assistant to find the perfect flight. Just describe what you're looking for.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <AIChat initialQuery={initialQuery} />
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
