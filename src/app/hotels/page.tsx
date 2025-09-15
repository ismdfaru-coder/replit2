
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export default function HotelsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <Building className="h-12 w-12 mb-4 text-primary" />
          <CardTitle className="text-2xl">Hotel Search</CardTitle>
          <CardDescription>
            This feature is coming soon. Stay tuned!
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground">
                You'll soon be able to find the best hotel deals right here.
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
