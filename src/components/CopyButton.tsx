"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Small copy-to-clipboard control that flips to a check for a moment. */
export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy tracking number"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors",
        copied ? "text-emerald-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
        className,
      )}
    >
      {copied ? "✓ Copied" : "⧉ Copy"}
    </button>
  );
}
