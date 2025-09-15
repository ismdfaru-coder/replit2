
"use client";

import { useEffect, useState, useRef } from "react";
import { flightBookingAssistant, type FlightBookingInput } from "@/ai/flows/flight-booking-assistant";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Bot, Loader2, User } from "lucide-react";
import FlightResultsView from "./flight-results-view";
import { type Flight } from "@/types";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const mockFlights: Flight[] = [
    { id: '1', provider: 'Emirates', legs: [{ airline: 'Emirates', airlineLogoUrl: 'https://picsum.photos/40/40?random=1', departureTime: '14:35', arrivalTime: '08:05', duration: '13h 30m', stops: '1 stop' }, { airline: 'Emirates', airlineLogoUrl: 'https://picsum.photos/40/40?random=1', departureTime: '04:00', arrivalTime: '12:45', duration: '12h 15m', stops: '1 stop' }], price: 843, from: { code: 'GLA', time: '14:35', airport: 'Glasgow' }, to: { code: 'MAA', time: '08:05', airport: 'Chennai' }, duration: '13h 30m', stops: 1, airline: 'Emirates' },
    { id: '2', provider: 'Wizz Air', legs: [{ airline: 'Wizz Air', airlineLogoUrl: 'https://picsum.photos/40/40?random=2', departureTime: '06:55', arrivalTime: '03:30', duration: '16h 05m', stops: '1 stop' }, { airline: 'Wizz Air', airlineLogoUrl: 'https://picsum.photos/40/40?random=2', departureTime: '05:35', arrivalTime: '15:35', duration: '14h 30m', stops: '1 stop' }], price: 553, from: { code: 'GLA', time: '06:55', airport: 'Glasgow' }, to: { code: 'MAA', time: '03:30', airport: 'Chennai' }, duration: '16h 05m', stops: 1, airline: 'Wizz Air' },
    { id: '3', provider: 'Lufthansa', legs: [{ airline: 'Lufthansa', airlineLogoUrl: 'https://picsum.photos/40/40?random=3', departureTime: '06:10', arrivalTime: '00:10', duration: '13h 30m', stops: '1 stop' }, { airline: 'Lufthansa', airlineLogoUrl: 'https://picsum.photos/40/40?random=3', departureTime: '01:55', arrivalTime: '12:25', duration: '15h 00m', stops: '1 stop' }], price: 674, from: { code: 'GLA', time: '06:10', airport: 'Glasgow' }, to: { code: 'MAA', time: '00:10', airport: 'Chennai' }, duration: '13h 30m', stops: 1, airline: 'Lufthansa' },
];

export function AIChat({ initialQuery }: { initialQuery?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flightQuery, setFlightQuery] = useState<string | null>(null);
  const processedInitialQuery = useRef(false);
  const [showFlightResults, setShowFlightResults] = useState(false);
  const [showViewFlightsButton, setShowViewFlightsButton] = useState(false);
  const [realFlights, setRealFlights] = useState<Flight[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<{origin: string, destination: string, departureDate: string, returnDate: string | null, passengers: number} | null>(null);

  useEffect(() => {
    if (initialQuery && !processedInitialQuery.current) {
      handleSendMessage(initialQuery);
      processedInitialQuery.current = true;
    }
  }, [initialQuery]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input;
    if (!content.trim()) return;

    setShowViewFlightsButton(false);
    let currentMessages = messages;
    if (!messageContent || !processedInitialQuery.current) {
      const userMessage: Message = { role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);
      currentMessages = [...messages, userMessage];
    }
    
    if (!messageContent) {
      setInput('');
    }
    setLoading(true);

    try {
      const conversationHistory = currentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      
      let request: FlightBookingInput = {
        conversationHistory: conversationHistory,
      };
      
      let response = await flightBookingAssistant(request);
      
      if (response.isFlightDetailsComplete && response.flightDetails) {
        const { destination = '', origin = '', dates = '', passengers = 1 } = response.flightDetails;
        const queryParts = [];
        if (destination) queryParts.push(`to ${destination}`);
        if (origin) queryParts.push(`from ${origin}`);
        if (dates) queryParts.push(`on ${dates}`);
        if (passengers) queryParts.push(`for ${passengers} people`);
        
        const newFlightQuery = `Flights ${queryParts.join(' ')}`;
        setFlightQuery(newFlightQuery);

        // Enhanced date parsing for various formats
        const parseFlexibleDate = (dateStr: string) => {
          try {
            // Handle formats like "sep25", "25th", "september 25", "2025-09-25"
            const cleanStr = dateStr.toLowerCase().trim();
            
            // If already in YYYY-MM-DD format
            if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
              return cleanStr;
            }
            
            // Handle formats like "sep25", "sep 25", "september 25"
            const monthMap: {[key: string]: string} = {
              'jan': '01', 'january': '01',
              'feb': '02', 'february': '02', 
              'mar': '03', 'march': '03',
              'apr': '04', 'april': '04',
              'may': '05',
              'jun': '06', 'june': '06',
              'jul': '07', 'july': '07',
              'aug': '08', 'august': '08',
              'sep': '09', 'september': '09',
              'oct': '10', 'october': '10',
              'nov': '11', 'november': '11',
              'dec': '12', 'december': '12'
            };
            
            // Match formats like "sep25", "september 25th", "oct25"
            const match = cleanStr.match(/^(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)\s*(\d{1,2})(st|nd|rd|th)?$/);
            
            if (match) {
              const month = monthMap[match[1]];
              const day = match[2].padStart(2, '0');
              const currentYear = new Date().getFullYear();
              const year = currentYear; // Use current year, could be enhanced to handle year crossing
              
              return `${year}-${month}-${day}`;
            }
            
            // Fallback: try to parse as regular date
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0];
            }
            
            return dateStr;
          } catch {
            return dateStr;
          }
        };
        
        let returnDate = null;
        let departureDate = dates;
        
        // Check if dates contains return date (round trip) - more flexible parsing
        if (dates?.includes(' to ') || dates?.includes(' through ') || dates?.includes('-')) {
          // Split on various separators
          const dateParts = dates.split(/\s+(?:to|through)\s+|\s*-\s*/);
          if (dateParts.length === 2) {
            departureDate = parseFlexibleDate(dateParts[0].trim());
            returnDate = parseFlexibleDate(dateParts[1].trim());
          }
        } else {
          departureDate = parseFlexibleDate(dates);
        }
        
        // Build Google Flights URL in the exact format requested
        const query = returnDate 
          ? `Flights+to+${encodeURIComponent(destination || 'Chennai')}+from+${encodeURIComponent(origin || 'Glasgow')}+for+${passengers || 1}+adults+on+${departureDate}+through+${returnDate}`
          : `Flights+to+${encodeURIComponent(destination || 'Chennai')}+from+${encodeURIComponent(origin || 'Glasgow')}+for+${passengers || 1}+adults+on+${departureDate}`;
        
        const googleFlightsUrl = `https://www.google.com/travel/flights?q=${query}&curr=GBP&gl=uk&hl=en`;
        
        console.log('Generated Google Flights URL:', googleFlightsUrl);
        
        // Fetch real flight data from our API with Google Flights URL
        try {
          const flightResponse = await fetch('/api/search-flights', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              origin: origin || 'Glasgow',
              destination: destination || 'Chennai',
              departureDate: departureDate || '2025-09-19',
              returnDate: returnDate,
              passengers: passengers || 1,
              googleFlightsUrl: googleFlightsUrl
            })
          });
          
          const flightData = await flightResponse.json();
          const fetchedFlights = flightData.flights || [];
          
          // Store real flights and search criteria in state for UI display
          setRealFlights(fetchedFlights);
          setSearchCriteria({
            origin: origin || 'Glasgow',
            destination: destination || 'Chennai',
            departureDate: departureDate || '2025-09-19',
            returnDate: returnDate,
            passengers: passengers || 1
          });

          // Second call to AI with real flight data for analysis
          const analysisRequest: FlightBookingInput = {
              conversationHistory: `${conversationHistory}\nassistant: ${response.reply}`,
              availableFlights: fetchedFlights,
          };
          response = await flightBookingAssistant(analysisRequest);
          setShowViewFlightsButton(true);
        } catch (error) {
          console.error('Error fetching flights:', error);
          // Fallback to showing message without flight data
          const fallbackMessage: Message = { role: 'assistant', content: 'I found your search details but encountered an issue retrieving live flight data. Please try again.' };
          setMessages((prev) => [...prev, fallbackMessage]);
          setLoading(false);
          return;
        }
      }

      const assistantMessage: Message = { role: 'assistant', content: response.reply };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4 border rounded-lg mb-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {message.content}
              </div>
               {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin" />
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {showViewFlightsButton && (
          <div className="mb-4 text-center">
              <Button onClick={() => setShowFlightResults(!showFlightResults)}>
                {showFlightResults ? 'Hide Results' : 'View All Flights'}
              </Button>
          </div>
      )}

      {showFlightResults && flightQuery && (
        <div className="mt-6 border-t pt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Available Flights</h2>
            <FlightResultsView 
              query={flightQuery} 
              flights={realFlights} 
              searchParams={searchCriteria || undefined}
            />
        </div>
      )}


      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
          placeholder="e.g., I want to fly from SFO to JFK next week"
          disabled={loading}
        />
        <Button onClick={() => handleSendMessage()} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
