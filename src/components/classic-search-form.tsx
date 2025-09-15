
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeftRight, Users, Minus, Plus, ChevronDown, X, PlusCircle } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ClassicSearchFormProps {
  onSearch: (query: string) => void;
}

interface FlightLeg {
    id: number;
    from: string;
    to: string;
    date: Date | undefined;
}

export function ClassicSearchForm({ onSearch }: ClassicSearchFormProps) {
  const [tripType, setTripType] = useState("round-trip");
  const [from, setFrom] = useState('Glasgow (Any)');
  const [to, setTo] = useState('Chennai (MAA)');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<number[]>([]);
  const [flightClass, setFlightClass] = useState("economy");
  const [directOnly, setDirectOnly] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });

  const [multiCityLegs, setMultiCityLegs] = useState<FlightLeg[]>([
    { id: 1, from: 'Glasgow, UK', to: 'New York, USA', date: new Date() },
    { id: 2, from: 'New York, USA', to: 'Los Angeles, USA', date: new Date(new Date().setDate(new Date().getDate() + 7)) },
  ]);

  const handleAddLeg = () => {
    setMultiCityLegs([...multiCityLegs, { id: Date.now(), from: '', to: '', date: undefined }]);
  };

  const handleRemoveLeg = (id: number) => {
    if (multiCityLegs.length > 2) {
      setMultiCityLegs(multiCityLegs.filter(leg => leg.id !== id));
    }
  };

  const handleLegChange = (id: number, field: keyof Omit<FlightLeg, 'id'>, value: string | Date | undefined) => {
    setMultiCityLegs(multiCityLegs.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let query = "Flights ";
    if (tripType === 'multi-city') {
        const legs = multiCityLegs.map(leg => `from ${leg.from} to ${leg.to} on ${leg.date ? format(leg.date, "MMM d") : ''}`);
        query += legs.join(', then ');
    } else {
        const queryParts = [];
        if (to) queryParts.push(`to ${to}`);
        if (from) queryParts.push(`from ${from}`);
        if (date?.from) {
          const fromDate = format(date.from, "dd/MM/yyyy");
          if (date.to && tripType === 'round-trip') {
            const toDate = format(date.to, "dd/MM/yyyy");
            queryParts.push(`from ${fromDate} to ${toDate}`);
          } else {
            queryParts.push(`on ${fromDate}`);
          }
        }
        query += queryParts.join(' ');
    }

    const passengerCount = adults + children;
    const otherParts = [];
    if (passengerCount > 0) otherParts.push(`for ${passengerCount} people`);
    if (directOnly) otherParts.push('direct');
    
    onSearch(`${query} ${otherParts.join(' ')}`);
  }

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (tripType === 'one-way' && selectedDate) {
        setDate({ from: selectedDate.from, to: undefined });
    } else {
      setDate(selectedDate);
    }
  };

  const handleTripTypeChange = (value: string) => {
    setTripType(value);
    if (value === 'one-way') {
        setDate(d => (d ? {...d, to: undefined} : { from: new Date(), to: undefined }));
    }
  }

  const handleChildrenChange = (newCount: number) => {
    const count = Math.max(0, newCount);
    setChildren(count);
    setChildAges(prevAges => {
        const newAges = [...prevAges];
        newAges.length = count;
        return newAges.fill(0, prevAges.length);
    });
  }

  const handleChildAgeChange = (index: number, age: string) => {
    const newAges = [...childAges];
    newAges[index] = parseInt(age, 10);
    setChildAges(newAges);
  }

  const totalPassengers = adults + children;


  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="flex items-center justify-between">
        <RadioGroup value={tripType} onValueChange={handleTripTypeChange} className="flex items-center space-x-2">
            <RadioGroupItem value="one-way" id="one-way" className="sr-only" />
            <Label htmlFor="one-way" className={cn("px-4 py-2 rounded-full cursor-pointer", tripType === 'one-way' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>One-way</Label>
            <RadioGroupItem value="round-trip" id="round-trip" className="sr-only" />
            <Label htmlFor="round-trip" className={cn("px-4 py-2 rounded-full cursor-pointer", tripType === 'round-trip' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>Round-trip</Label>
            <RadioGroupItem value="multi-city" id="multi-city" className="sr-only" />
            <Label htmlFor="multi-city" className={cn("px-4 py-2 rounded-full cursor-pointer", tripType === 'multi-city' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>Multi-city</Label>
        </RadioGroup>

        <div className="hidden md:flex flex-wrap items-center gap-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground">
                        {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-4 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="font-semibold">Adults</Label>
                                <p className="text-xs text-muted-foreground">Aged 18+</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(p => Math.max(1, p - 1))} type="button"><Minus className="h-4 w-4" /></Button>
                                <span className="w-4 text-center">{adults}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAdults(p => p + 1)} type="button"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                             <div>
                                <Label className="font-semibold">Children</Label>
                                <p className="text-xs text-muted-foreground">Aged 0 to 17</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleChildrenChange(children - 1)} type="button"><Minus className="h-4 w-4" /></Button>
                                <span className="w-4 text-center">{children}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleChildrenChange(children + 1)} type="button"><Plus className="h-4 w-4" /></Button>
                            </div>
                        </div>
                         {children > 0 && (
                            <div className="space-y-4 pt-4 border-t">
                                {Array.from({ length: children }).map((_, index) => (
                                    <div key={index} className="grid grid-cols-2 items-center gap-4">
                                        <Label htmlFor={`child-age-${index}`} className="text-sm">Age of child {index + 1}</Label>
                                         <Select onValueChange={(value) => handleChildAgeChange(index, value)}>
                                            <SelectTrigger id={`child-age-${index}`}>
                                                <SelectValue placeholder="Select age" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 18 }).map((_, age) => (
                                                    <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <Select value={flightClass} onValueChange={setFlightClass}>
                <SelectTrigger className="w-auto border-0 text-muted-foreground focus:ring-0">
                    <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium-economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {tripType === 'multi-city' ? (
        <div className="space-y-2">
            {multiCityLegs.map((leg, index) => (
                <div key={leg.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] lg:grid-cols-7 gap-2">
                    <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 bg-white text-black p-1 rounded-md">
                        <div className="relative">
                            <Label htmlFor={`from-${leg.id}`} className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">From</Label>
                            <Input id={`from-${leg.id}`} placeholder="Departure" className="border-0 bg-transparent" value={leg.from} onChange={(e) => handleLegChange(leg.id, 'from', e.target.value)} />
                        </div>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleLegChange(leg.id, 'from', leg.to) && handleLegChange(leg.id, 'to', leg.from)} className="mx-auto">
                           <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                            <Label htmlFor={`to-${leg.id}`} className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">To</Label>
                            <Input id={`to-${leg.id}`} placeholder="Destination" className="border-0 bg-transparent" value={leg.to} onChange={(e) => handleLegChange(leg.id, 'to', e.target.value)} />
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="grid grid-cols-1 items-center bg-white text-black p-1 rounded-md h-full cursor-pointer">
                                    <div className="relative text-center p-2 rounded-sm">
                                        <p className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Depart</p>
                                        <p className="font-semibold">{leg.date ? format(leg.date, 'E, dd MMM yyyy') : 'Select date'}</p>
                                    </div>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="single"
                                    defaultMonth={leg.date}
                                    selected={leg.date}
                                    onSelect={(day) => handleLegChange(leg.id, 'date', day)}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center">
                        {multiCityLegs.length > 2 && (
                            <Button variant="ghost" size="icon" type="button" onClick={() => handleRemoveLeg(leg.id)}>
                                <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            <div className="flex items-center justify-between mt-4">
                <Button variant="link" type="button" onClick={handleAddLeg}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add another flight
                </Button>
            </div>
        </div>
      ) : (
        <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] lg:grid-cols-7 gap-2">
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2 bg-white text-black p-1 rounded-md">
                    <div className="relative">
                        <Label htmlFor="from-main" className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">From</Label>
                        <Input id="from-main" placeholder="Departure" className="border-0 bg-transparent" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </div>
                    <Button variant="ghost" size="icon" type="button" onClick={() => { const temp = from; setFrom(to); setTo(temp); }} className="mx-auto">
                        <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                        <Label htmlFor="to-main" className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">To</Label>
                        <Input id="to-main" placeholder="Destination" className="border-0 bg-transparent" value={to} onChange={(e) => setTo(e.target.value)} />
                    </div>
                </div>
                <div className="lg:col-span-3">
                     <Popover>
                        <PopoverTrigger asChild>
                             <div className="grid grid-cols-2 items-center bg-white text-black p-1 rounded-md h-full cursor-pointer">
                                <div className="relative text-center p-2 rounded-sm">
                                    <p className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Depart</p>
                                    <p className="font-semibold">{date?.from ? format(date.from, 'E, dd MMM') : 'Select date'}</p>
                                </div>
                                <div className={cn("relative text-center p-2 rounded-sm", tripType === 'one-way' && 'opacity-50')}>
                                    <p className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Return</p>
                                    <p className="font-semibold">{date?.to ? format(date.to, 'E, dd MMM') : (tripType === 'one-way' ? '—' : 'Select date')}</p>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode={tripType === 'round-trip' ? 'range' : 'single'}
                                defaultMonth={date?.from}
                                selected={tripType === 'one-way' ? date?.from : date}
                                onSelect={(day) => handleDateSelect(day as DateRange | undefined)}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center">
                </div>
            </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
            <Checkbox id="direct-flights-main" checked={directOnly} onCheckedChange={(checked) => setDirectOnly(Boolean(checked))} />
            <Label htmlFor="direct-flights-main">Direct flights only</Label>
        </div>
        <Button type="submit" size="lg" className="text-lg">
            Search Flights
        </Button>
      </div>

    </form>
  );
}

    