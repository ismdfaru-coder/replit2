
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Wand2, Building, Car, Sparkles, Search, User, Languages, Coins, LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RegionalSettingsDialog } from "./regional-settings-dialog";
import { useAuth } from "@/context/auth-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Header() {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const [language, setLanguage] = useState("English (UK)");
  const [currency, setCurrency] = useState("GBP");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navLinks = [
    { href: "/hotels", label: "Hotels", icon: <Building className="h-4 w-4" /> },
    { href: "/car-hire", label: "Car hire", icon: <Car className="h-4 w-4" /> },
    { href: "/itinerary-planner", label: "Itinerary Planner", icon: <Sparkles className="h-4 w-4" /> },
  ];

  const dynamicNavLink = pathname === '/classic' 
    ? { href: "/", label: "AI Mode", icon: <Wand2 className="h-4 w-4" /> }
    : { href: "/classic", label: "Classic Search", icon: <Search className="h-4 w-4" /> };

  const flightsLink = { href: "/", label: "Flights", icon: <Wand2 className="h-4 w-4" /> };
  
  const allNavLinks = pathname.startsWith('/classic')
    ? [dynamicNavLink, ...navLinks]
    : [flightsLink, ...navLinks, dynamicNavLink];
    
  const handleSettingsSave = (settings: { language: string; country: string; currency: string }) => {
    setLanguage(settings.language);
    setCurrency(settings.currency);
    setIsDialogOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Pacifico', serif" }}>FlyHigh</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 bg-black/20 p-1 rounded-full">
            {allNavLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button 
                    variant={pathname === link.href ? "secondary" : "ghost"} 
                    className="text-white hover:bg-white/10 hover:text-white rounded-full"
                >
                    {link.icon}
                    {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
            <RegionalSettingsDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSave={handleSettingsSave}
            >
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                  <Languages className="h-5 w-5 mr-2" />
                  {language}
              </Button>
            </RegionalSettingsDialog>
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Coins className="h-5 w-5 mr-2" />
                {currency}
            </Button>
             {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback className="bg-primary text-white">
                          <User className="h-5 w-5" />
                      </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {user.displayName || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Link href="/login">
                    <Button variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10">
                        Login
                    </Button>
                </Link>
            )}
        </div>
        <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent text-white border-white/50 hover:bg-white/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 flex flex-col gap-4">
                  <nav className="flex flex-col gap-2">
                    {allNavLinks.map((link) => (
                       <Link key={link.href} href={link.href}>
                         <Button variant={pathname === link.href ? "secondary" : "ghost"} className="w-full justify-start">
                            {link.icon}
                            {link.label}
                         </Button>
                       </Link>
                    ))}
                  </nav>
                  
                  <div className="border-t border-border pt-4 flex flex-col gap-2">
                    <RegionalSettingsDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        onSave={handleSettingsSave}
                    >
                      <Button variant="ghost" className="w-full justify-start">
                          <Languages className="h-5 w-5 mr-2" />
                          Language & Currency
                      </Button>
                    </RegionalSettingsDialog>
                     {user ? (
                        <>
                           <Button variant="ghost" className="w-full justify-start">
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={user.photoURL ?? ''} />
                                    <AvatarFallback className="bg-primary text-white text-xs">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                {user.displayName || user.email}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" onClick={signOutUser}>
                               <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </Button>
                        </>
                    ) : (
                         <Link href="/login" className="w-full">
                            <Button variant="ghost" className="w-full justify-start">
                                <User className="h-5 w-5 mr-2" />
                                Login
                            </Button>
                        </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
      </div>
    </header>
  );
}
