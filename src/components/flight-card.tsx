
import Image from 'next/image';
import { ArrowRight, Plane, Info, Heart } from 'lucide-react';
import { type Flight, type FlightLeg } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface FlightCardProps {
    flight: Flight;
    layout?: 'list' | 'grid';
    searchParams?: {
        origin?: string;
        destination?: string;
        departureDate?: string;
        returnDate?: string | null;
        passengers?: number;
    };
}

const FlightLegRow = ({ leg }: { leg: FlightLeg }) => (
    <div className="flex items-center gap-4">
         <Image
            src={leg.airlineLogoUrl}
            alt={`${leg.airline} logo`}
            width={24}
            height={24}
            className="rounded-full"
            data-ai-hint="airline logo"
        />
        <div className="flex items-center gap-4 text-sm w-full">
            <div>
                <p className="font-semibold text-lg">{leg.departureTime}</p>
                <p>{leg.fromCode || 'GLA'}</p>
            </div>
            <div className="flex-grow flex flex-col items-center text-muted-foreground relative mx-2">
                <span className="text-xs mb-1">{leg.duration}</span>
                <div className="border-b border-dashed w-full relative">
                    <div className="absolute -top-[5px] left-0 h-2 w-2 rounded-full border bg-background" />
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
                     <div className="absolute -top-[5px] right-0 h-2 w-2 rounded-full border bg-background" />
                </div>
                 <span className="text-primary text-xs font-semibold mt-1">{leg.stops}</span>
            </div>
            <div>
                <p className="font-semibold text-lg">{leg.arrivalTime}</p>
                <p>{leg.toCode || 'MAA'}</p>
            </div>
        </div>
    </div>
);


export default function FlightCard({ flight, layout = 'list', searchParams }: FlightCardProps) {
  // Generate Google Flights URL using the original user search parameters
  const generateGoogleFlightsUrl = () => {
    // PRIORITY: Use search parameters from original user query
    const origin = searchParams?.origin || flight.from?.airport || flight.from?.code || flight.legs[0]?.fromCode || 'London';
    const destination = searchParams?.destination || flight.to?.airport || flight.to?.code || flight.legs[0]?.toCode || 'Dubai';
    const passengers = searchParams?.passengers || 1;
    
    // Use the exact search dates the user specified
    const departureDateStr = searchParams?.departureDate || (() => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date.toISOString().split('T')[0];
    })();
    
    // Handle return date - MUST preserve user's original search intent (one-way vs round-trip)
    const returnDateStr = searchParams?.returnDate;
    
    // Build Google Flights URL matching user's exact search type
    let query: string;
    if (returnDateStr && returnDateStr.trim() !== '') {
      // Round trip: User specified a return date
      query = `Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(origin)}+for+${passengers}+adults+on+${departureDateStr}+through+${returnDateStr}`;
    } else {
      // One-way: User did NOT specify return date - do not add "through" segment
      query = `Flights+to+${encodeURIComponent(destination)}+from+${encodeURIComponent(origin)}+for+${passengers}+adults+on+${departureDateStr}`;
    }
    
    return `https://www.google.com/travel/flights?q=${query}&curr=GBP&gl=uk&hl=en`;
  };
  
  const handleSelectFlight = () => {
    const googleFlightsUrl = generateGoogleFlightsUrl();
    window.open(googleFlightsUrl, '_blank');
  };
  if (layout === 'grid') {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 relative group">
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-4">
                    {flight.legs.map((leg, index) => (
                         <FlightLegRow key={index} leg={leg} />
                    ))}
                </div>
                <Separator orientation="vertical" className="h-24 hidden md:block" />
                <div className="w-full md:w-48 flex flex-row md:flex-col items-center justify-between md:text-right gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l pl-4">
                    <div className="text-left md:text-right">
                        <p className="text-xs text-muted-foreground">Book with {flight.provider} from</p>
                        <p className="text-2xl font-bold">£{flight.price}</p>
                        <p className="text-xs text-muted-foreground">£{flight.price * 2} total</p>
                    </div>
                    <Button onClick={handleSelectFlight}>
                        Select <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                </Button>
            </CardContent>
            {flight.emissions && (
                <div className="border-t p-2 text-center text-xs text-muted-foreground bg-green-50">
                    This flight emits {flight.emissions.co2}% less CO2e than a typical flight on this route <Info className="inline h-3 w-3" />
                </div>
            )}
        </Card>
    );
  }
  
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-300")}>
      <CardContent className={cn(
        "p-4 items-center gap-4", 
        'grid grid-cols-1 md:grid-cols-5'
      )}>
        <div className={cn(
            "flex items-center gap-4",
            'col-span-1'
        )}>
          <Image
            src={flight.legs[0].airlineLogoUrl}
            alt={`${flight.legs[0].airline} logo`}
            data-ai-hint="airline logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-foreground">{flight.legs[0].airline}</p>
            <p className="text-xs text-muted-foreground">Economy</p>
          </div>
        </div>

        <div className={cn(
            "flex items-center justify-between",
            'col-span-1 md:col-span-3'
        )}>
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{flight.from?.time || flight.legs[0]?.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.from?.code || flight.legs[0]?.fromCode}</p>
          </div>
          
          <div className="flex-grow flex items-center justify-center text-center mx-4">
             <Plane className="w-5 h-5 text-muted-foreground"/>
             <div className="flex-grow border-t border-dashed mx-2"></div>
             <div className="text-center">
                <p className="text-sm font-medium text-foreground">{flight.duration || flight.legs[0]?.duration}</p>
                <p className="text-xs text-muted-foreground">{(flight.stops ?? 0) > 0 ? `${flight.stops} stop` : 'Non-stop'}</p>
             </div>
             <div className="flex-grow border-t border-dashed mx-2"></div>
             <Plane className="w-5 h-5 text-muted-foreground -scale-x-100"/>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{flight.to?.time || flight.legs[0]?.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.to?.code || flight.legs[0]?.toCode}</p>
          </div>
        </div>
        
        <Separator orientation={'vertical'} className={cn('hidden md:block h-16 mx-auto')}/>

        <div className={cn(
            "flex flex-col items-center justify-center text-center",
            'col-span-1'
        )}>
          <p className="text-2xl font-bold text-foreground">£{flight.price}</p>
          <p className="text-xs text-muted-foreground">per person</p>
          <Button size="sm" className="mt-2 w-full" onClick={handleSelectFlight}>
            Select
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
