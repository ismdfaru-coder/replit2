
"use client";

import { Button } from "./ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Separator } from "./ui/separator";

export function FlightFilters() {
    const filters = [
        { label: "Stops" },
        { label: "Airlines" },
        { label: "Bags" },
        { label: "Price" },
        { label: "Times" },
        { label: "Emissions" },
        { label: "Connecting airports" },
        { label: "Duration" },
    ];

    return (
        <div className="p-2 border-b">
            <div className="flex items-center gap-2">
                <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    All filters
                </Button>
                <Separator orientation="vertical" className="h-6" />
                {filters.map(filter => (
                    <Button key={filter.label} variant="ghost" className="text-muted-foreground">
                        {filter.label}
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                ))}
            </div>
        </div>
    )
}
