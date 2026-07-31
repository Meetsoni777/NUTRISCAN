"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast.success("Account created! Welcome to NutriScan.");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo.jpeg" alt="NutriScan Logo" width={36} height={36} className="h-9 w-9 rounded-md object-contain" />
        </Link>
      </div>
      <Card className="border-border bg-surface-1">
        <CardHeader className="text-center">
          <CardTitle className="font-voice text-xl">Create your account</CardTitle>
          <CardDescription className="text-text-tertiary">Start scanning food labels for free</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="border-border bg-surface-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="border-border bg-surface-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="border-border bg-surface-2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} className="border-border bg-surface-2" />
            </div>
            <Button type="submit" className="w-full bg-accent-cyan text-background hover:bg-accent-cyan-light" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-tertiary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
