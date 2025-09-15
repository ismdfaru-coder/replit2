
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch (e: any) {
      setError("Failed to sign in. Please check your credentials.");
      console.error(e);
    }
    setLoading(false);
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
        await signInWithGoogle();
        router.push('/');
    } catch (e) {
        setError("Failed to sign in with Google.");
        console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
                id="email"
                placeholder="name@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
        </Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-63.1 61.9C338.4 97.2 297.6 80 248 80c-82.8 0-150.5 67.7-150.5 151.3s67.7 151.3 150.5 151.3c92.2 0 131-62.7 135-95.2H248v-65.7h235.3c.7 12.3 1.2 24.3 1.2 37.2z"></path></svg>
        Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/signup" className="underline hover:text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
