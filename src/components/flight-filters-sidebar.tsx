
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

export function FlightFiltersSidebar() {
    const airlines = [
        { id: "emirates", label: "Emirates" },
        { id: "wizz", label: "Wizz Air" },
        { id: "lufthansa", label: "Lufthansa" },
        { id: "british-airways", label: "British Airways" },
        { id: "klm", label: "KLM" },
    ]

    return (
        <div className="p-4 space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Stops</h3>
                <RadioGroup defaultValue="any" className="space-y-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="stops-any">Any</Label>
                        <RadioGroupItem value="any" id="stops-any" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="stops-1">1 stop</Label>
                        <RadioGroupItem value="1" id="stops-1" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="stops-2">2+ stops</Label>
                        <RadioGroupItem value="2" id="stops-2" />
                    </div>
                </RadioGroup>
            </div>
            <Separator />
             <div>
                <h3 className="font-semibold mb-2">Airlines</h3>
                <div className="space-y-2">
                    {airlines.map(airline => (
                        <div key={airline.id} className="flex items-center space-x-2">
                            <Checkbox id={`airline-${airline.id}`} />
                            <Label htmlFor={`airline-${airline.id}`}>{airline.label}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="font-semibold mb-2">Price</h3>
                <Slider defaultValue={[500]} max={2000} step={10} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>£0</span>
                    <span>£2000</span>
                </div>
            </div>
             <Separator />
            <div>
                <h3 className="font-semibold mb-2">Duration</h3>
                <Slider defaultValue={[20]} max={48} step={1} />
                 <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0h</span>
                    <span>48h</span>
                </div>
            </div>
        </div>
    )
}
