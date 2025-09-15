
import { SignupForm } from "@/components/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
           <div className="p-3 rounded-full bg-primary mb-4">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
            </div>
          <CardTitle className="text-3xl">Create an Account</CardTitle>
          <CardDescription>
            Get started with FlyHigh today!
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
