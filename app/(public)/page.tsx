"use client";

/**
 * app/(public)/page.tsx
 * Authentication page — login / register / guest access.
 * Uses identity module server actions and reacts to auth state via AuthProvider.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { useAuth } from "@/app/providers/auth-provider";
import { signIn, register, signInAnonymously, sendPasswordResetEmail } from "@/modules/identity/interfaces/_actions/identity.actions";

type Tab = "login" | "register";

export default function AuthPage() {
  const { state } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Redirect to shell once authenticated
  useEffect(() => {
    if (state.status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [state.status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result =
        tab === "login"
          ? await signIn(email, password)
          : await register(email, password, name);
      if (!result.success) {
        setError(result.error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestAccess() {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInAnonymously();
      if (!result.success) setError(result.error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordReset() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendPasswordResetEmail(email);
      if (result.success) {
        setResetSent(true);
        setError(null);
      } else {
        setError(result.error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (state.status === "initializing") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/50 bg-card shadow-xl ring-1 ring-border/30 backdrop-blur">
        {/* Header */}
        <div className="flex flex-col items-center pb-4 pt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 ring-1 ring-primary/20">
            <ShieldCheck className="h-7 w-7 text-primary/90" />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="mb-6 grid h-10 grid-cols-2 rounded-lg border border-border/40 bg-muted/30 p-1">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(null); }}
                className={`rounded-md text-xs font-semibold capitalize tracking-tight transition-all ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "register" && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  required
                  className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                required
                className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="text-xs text-primary/70 hover:text-primary"
                  >
                    {resetSent ? "Email sent!" : "Forgot password?"}
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === "login" ? "current-password" : "new-password"}
                required
                className="h-10 rounded-lg border border-border/50 bg-background/70 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-105 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : tab === "login" ? (
                "Enter Dimension"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-border/40 bg-muted/10 px-6 pb-7 pt-5">
          <button
            type="button"
            onClick={handleGuestAccess}
            disabled={isLoading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/55 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/35 hover:bg-primary/5 hover:text-primary disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue as Guest"
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
