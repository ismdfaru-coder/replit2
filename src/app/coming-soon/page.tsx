
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            We're working on exciting new features. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg">Something amazing is on the way.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
