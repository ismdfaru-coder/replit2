import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-24">
      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center">
            <div className="p-3 rounded-full bg-primary mb-4">
                <User className="h-8 w-8 text-primary-foreground" />
            </div>
          <CardTitle className="text-3xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
            <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
