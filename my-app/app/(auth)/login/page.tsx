"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 text-sm font-bold tracking-wide">
          <span className="h-[9px] w-[9px] rotate-45 rounded-sm bg-accent-cyan" />
          NUTRISCAN
        </Link>
      </div>
      <Card className="border-border bg-surface-1">
        <CardHeader className="text-center">
          <CardTitle className="font-voice text-xl">Welcome back</CardTitle>
          <CardDescription className="text-text-tertiary">Sign in to your NutriScan account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-border bg-surface-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="border-border bg-surface-2" />
            </div>
            <Button type="submit" className="w-full bg-accent-cyan text-background hover:bg-accent-cyan-light" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-tertiary">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent-cyan hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
