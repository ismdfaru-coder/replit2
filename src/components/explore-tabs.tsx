
"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const tabData = {
    city: [
        { label: "Return plane tickets to Bangkok", href: "#" },
        { label: "Return tickets to Toronto", href: "#" },
        { label: "Cheap return flights to Seoul", href: "#" },
        { label: "Cheap return flights to Warsaw", href: "#" },
        { label: "Return tickets to Bucharest", href: "#" },
        { label: "Flights to Glasgow", href: "#" },
        { label: "Cheap tickets to Stockholm", href: "#" },
        { label: "Return plane tickets to Milan", href: "#" },
        { label: "Tickets to Frankfurt", href: "#" },
    ],
    airport: [
        { label: "Flights from Heathrow", href: "#" },
        { label: "Flights from Gatwick", href: "#" },
        { label: "Flights from Manchester", href: "#" },
        { label: "Flights from Edinburgh", href: "#" },
    ],
    country: [
        { label: "Flights to Spain", href: "#" },
        { label: "Flights to Italy", href: "#" },
        { label: "Flights to USA", href: "#" },
        { label: "Flights to Turkey", href: "#" },
    ],
    region: [
        { label: "Flights to Europe", href: "#" },
        { label: "Flights to Asia", href: "#" },
        { label: "Flights to North America", href: "#" },
        { label: "Flights to Caribbean", href: "#" },
    ],
}

export function ExploreTabs() {
    const [activeTab, setActiveTab] = useState("city");

    return (
        <Tabs defaultValue="city" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="city">City</TabsTrigger>
                <TabsTrigger value="airport">Airport</TabsTrigger>
                <TabsTrigger value="country">Country</TabsTrigger>
                <TabsTrigger value="region">Region</TabsTrigger>
            </TabsList>
            <div className="pt-4">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {Array.from({ length: Math.ceil(tabData[activeTab as keyof typeof tabData].length / 6) }).map((_, slideIndex) => (
                             <CarouselItem key={slideIndex} className="md:basis-1/2 lg:basis-1/3">
                                 <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                     {tabData[activeTab as keyof typeof tabData].slice(slideIndex * 6, (slideIndex + 1) * 6).map((item, index) => (
                                         <Link key={index} href={item.href} className="text-sm text-primary hover:underline">{item.label}</Link>
                                     ))}
                                 </div>
                             </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>
        </Tabs>
    )
}
