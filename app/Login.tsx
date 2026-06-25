"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plane, Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { destinationImages } from "../lib/images";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { createClient } from "../utils/supabase/client";
import { toast } from "sonner";

const collage = [
  { src: destinationImages.bali, label: "Bali" },
  { src: destinationImages.rajaAmpat, label: "Raja Ampat" },
  { src: destinationImages.labuanBajo, label: "Labuan Bajo" },
  { src: destinationImages.bromo, label: "Bromo" },
];

export function Login() {
  const router = useRouter();
  const supabase = createClient();
  
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
      return;
    }

    toast.success("Welcome back! Signing you in...");
    router.push("/dashboard");
    router.refresh();
  };

  const handleSignUp = async () => {
    if (!name.trim()) {
      toast.error("Full Name is required.");
      return;
    }

    // Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nama_lengkap: name,
        },
      },
    });

    if (authError) {
      toast.error(authError.message || "Registration failed.");
      return;
    }

    // Sync profile to database public.m_admin
    try {
      const { error: insertError } = await supabase
        .from("m_admin")
        .insert({
          admin_id: authData.user!.id,
          nama_lengkap: name,
          email: email,
          no_hp: phone || null,
          role: "Super Admin",
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      if (authData.session) {
        toast.success("Account created and admin profile saved successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
        setMode("signin");
      }
    } catch (dbError: any) {
      console.error("Failed to sync admin profile to DB:", dbError);
      toast.error("Account created but failed to save admin profile to database: " + (dbError.message || "DB Error"));
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize Google login.");
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left — travel collage */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-1">
          {collage.map((c) => (
            <div key={c.label} className="relative bg-slate-200">
              <ImageWithFallback src={c.src} alt={c.label} className="size-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-blue-900/20" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Plane className="size-5 -rotate-45" />
            </div>
            <span className="text-xl font-bold">TravelGo</span>
          </div>
          <div className="max-w-md">
            <div className="mb-4 flex gap-2">
              {collage.map((c) => (
                <span key={c.label} className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                  {c.label}
                </span>
              ))}
            </div>
            <h2 className="text-4xl font-bold leading-tight">Manage Your Travel Business Smarter</h2>
            <p className="mt-3 text-base text-white/80">
              Monitor bookings, customers, and revenue from one beautiful dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right — login card */}
      <div className="relative flex items-center justify-center bg-background p-6">
        <div className="absolute inset-0 -z-0 bg-gradient-to-br from-blue-50 via-background to-sky-50 lg:hidden" />
        <div className="relative w-full max-w-md">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-xl animate-fade-in">
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="size-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold text-foreground">TravelGo</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin" 
                ? "Sign in to your admin dashboard to continue." 
                : "Register a new profile to access the travel platform."}
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="+62 812-3456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" defaultChecked className="size-4 rounded border-border accent-primary" />
                    Remember me
                  </label>
                  <a className="text-sm font-medium text-primary hover:underline" href="#">Forgot password?</a>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/30 transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  mode === "signin" ? "Sign In" : "Register Profile"
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {mode === "signin" 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Sign In"}
                </button>
              </div>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <button 
                type="button" 
                onClick={handleGoogleLogin} 
                className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-white text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <svg viewBox="0 0 24 24" className="size-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/><path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.45 14.97.5 12 .5A11 11 0 0 0 2.18 7.04l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"/></svg>
                Google Connection
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">© TravelGo 2026 · All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
