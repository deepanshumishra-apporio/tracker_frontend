import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parcel Tracker",
  description: "Unified UPS / FedEx / DHL / Aramex delivery tracking dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-base shadow-sm">
                📦
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Parcel Tracker
              </span>
            </Link>
            <nav className="hidden text-sm font-medium text-slate-400 sm:block">
              UPS · FedEx · DHL · Aramex
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-slate-400 sm:px-6">
          Tracking data is fetched live from carrier pages and not stored.
        </footer>
      </body>
    </html>
  );
}
