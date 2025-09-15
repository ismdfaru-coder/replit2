
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Languages, Globe, Coins } from "lucide-react";

interface RegionalSettingsDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (settings: { language: string; country: string; currency: string }) => void;
}

const languages = [
    { value: "English (United Kingdom)", label: "English (United Kingdom)" },
    { value: "English (United States)", label: "English (United States)" },
    { value: "Spanish", label: "Español (Spanish)" },
    { value: "French", label: "Français (French)" },
    { value: "German", label: "Deutsch (German)" },
    { value: "Italian", label: "Italiano (Italian)" },
    { value: "Portuguese", label: "Português (Portuguese)" },
    { value: "Dutch", label: "Nederlands (Dutch)" },
    { value: "Russian", label: "Русский (Russian)" },
    { value: "Japanese", label: "日本語 (Japanese)" },
    { value: "Chinese", label: "中文 (Chinese)" },
    { value: "Arabic", label: "العربية (Arabic)" },
];

const countries = [
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Spain", label: "Spain" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "Italy", label: "Italy" },
    { value: "Portugal", label: "Portugal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "Russia", label: "Russia" },
    { value: "Japan", label: "Japan" },
    { value: "China", label: "China" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "Australia", label: "Australia" },
    { value: "Canada", label: "Canada" },
    { value: "India", label: "India" },
];

const currencies = [
    { value: "GBP - £", label: "GBP - British Pound (£)" },
    { value: "USD - $", label: "USD - US Dollar ($)" },
    { value: "EUR - €", label: "EUR - Euro (€)" },
    { value: "JPY - ¥", label: "JPY - Japanese Yen (¥)" },
    { value: "CAD - $", label: "CAD - Canadian Dollar ($)" },
    { value: "AUD - $", label: "AUD - Australian Dollar ($)" },
    { value: "INR - ₹", label: "INR - Indian Rupee (₹)" },
    { value: "CNY - ¥", label: "CNY - Chinese Yuan (¥)" },
    { value: "RUB - ₽", label: "RUB - Russian Ruble (₽)" },
    { value: "AED - د.إ", label: "AED - UAE Dirham (د.إ)" },
];


export function RegionalSettingsDialog({ children, open, onOpenChange, onSave }: RegionalSettingsDialogProps) {
  const [language, setLanguage] = useState("English (United Kingdom)");
  const [country, setCountry] = useState("United Kingdom");
  const [currency, setCurrency] = useState("GBP - £");

  const handleSave = () => {
    onSave({ language, country, currency: currency.split(' - ')[0] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Regional settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-muted-foreground" />
              Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              Country / Region
            </Label>
            <p className="text-sm text-muted-foreground">
                Selecting the country you're in will give you local deals and information.
            </p>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency" className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-muted-foreground" />
              Currency
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
