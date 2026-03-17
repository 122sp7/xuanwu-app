"use client";

interface NavUserProps {
  name: string;
  email: string;
  onSignOut: () => void;
}

export function NavUser({ name, email, onSignOut }: NavUserProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-background/80 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className="w-full rounded-lg border border-border/60 px-3 py-1.5 text-xs font-semibold transition hover:bg-muted"
      >
        Sign Out
      </button>
    </div>
  );
}
