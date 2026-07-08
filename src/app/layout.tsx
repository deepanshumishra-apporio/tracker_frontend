import type { Metadata } from "next";
import Link from "next/link";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parcel Tracker — UPS, FedEx, DHL & Aramex",
  description: "Unified UPS / FedEx / DHL / Aramex delivery tracking dashboard.",
};

const CARRIERS = ["UPS", "FedEx", "DHL", "Aramex"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-transparent antialiased">
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur-md">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
                <Link
                  href="/"
                  className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-base text-white shadow-sm shadow-indigo-500/30 transition-transform group-hover:scale-105">
                    📦
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                      Parcel Tracker
                    </span>
                    <span className="mt-0.5 text-[11px] font-medium text-slate-400">
                      Live multi-carrier tracking
                    </span>
                  </span>
                </Link>
                <nav
                  className="hidden items-center gap-1.5 sm:flex"
                  aria-label="Supported carriers"
                >
                  {CARRIERS.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500"
                    >
                      {c}
                    </span>
                  ))}
                </nav>
              </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
              {children}
            </main>

            <footer className="border-t border-slate-200/70 bg-white/40">
              <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 py-6 text-center sm:px-6">
                <p className="text-xs text-slate-500">
                  Tracking data is fetched live from carrier pages and not stored.
                </p>
                <p className="text-[11px] text-slate-400">
                  © 2026 Parcel Tracker · UPS · FedEx · DHL · Aramex
                </p>
              </div>
            </footer>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
