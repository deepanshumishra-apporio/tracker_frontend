/**
 * Pure presentation helpers — labels, colors, and date formatting.
 * No React here so they're trivially unit-testable.
 */
import type { Carrier, ShipmentStatus } from "./types";

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  pending: "Pending",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  exception: "Exception",
  unknown: "Unknown",
};

export const CARRIER_LABELS: Record<Carrier, string> = {
  ups: "UPS",
  fedex: "FedEx",
  dhl: "DHL",
  aramex: "Aramex",
};

/** Tailwind class sets for status pills (kept data-driven so pills stay consistent). */
export const STATUS_STYLES: Record<ShipmentStatus, string> = {
  pending: "bg-slate-100 text-slate-700 ring-slate-200",
  in_transit: "bg-blue-50 text-blue-700 ring-blue-200",
  out_for_delivery: "bg-amber-50 text-amber-700 ring-amber-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  exception: "bg-red-50 text-red-700 ring-red-200",
  unknown: "bg-slate-100 text-slate-500 ring-slate-200",
};

export const CARRIER_STYLES: Record<Carrier, string> = {
  ups: "bg-amber-100 text-amber-900 ring-amber-200",
  fedex: "bg-purple-100 text-purple-900 ring-purple-200",
  dhl: "bg-yellow-100 text-yellow-900 ring-yellow-200",
  aramex: "bg-red-100 text-red-900 ring-red-200",
};

/** Soft card accent (background + border) per status, for the result hero. */
export const STATUS_ACCENT: Record<ShipmentStatus, string> = {
  pending: "bg-slate-50 border-slate-200",
  in_transit: "bg-blue-50/40 border-blue-100",
  out_for_delivery: "bg-amber-50/50 border-amber-100",
  delivered: "bg-emerald-50/50 border-emerald-100",
  exception: "bg-red-50/50 border-red-100",
  unknown: "bg-slate-50 border-slate-200",
};

/** Emoji glyph per status — used in the journey stepper and status hero. */
export const STATUS_ICONS: Record<ShipmentStatus, string> = {
  pending: "🕒",
  in_transit: "🚚",
  out_for_delivery: "📬",
  delivered: "✅",
  exception: "⚠️",
  unknown: "❓",
};

/** Solid dot color per status (shared by StatusBadge and the timeline rail). */
export const STATUS_DOT: Record<ShipmentStatus, string> = {
  pending: "bg-slate-400",
  in_transit: "bg-blue-500",
  out_for_delivery: "bg-amber-500",
  delivered: "bg-emerald-500",
  exception: "bg-red-500",
  unknown: "bg-slate-400",
};

/**
 * The normal happy-path stages a parcel moves through, in order. Used to draw
 * the progress stepper so the user can see at a glance where the shipment is.
 */
export const JOURNEY_STEPS: {
  status: Extract<ShipmentStatus, "pending" | "in_transit" | "out_for_delivery" | "delivered">;
  label: string;
}[] = [
  { status: "pending", label: "Ordered" },
  { status: "in_transit", label: "In transit" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

/**
 * Index of the current stage in JOURNEY_STEPS, or -1 when the shipment is off
 * the happy path (exception / unknown) and the stepper shouldn't imply progress.
 */
export function journeyIndex(status: ShipmentStatus): number {
  return JOURNEY_STEPS.findIndex((s) => s.status === status);
}

export function statusIcon(status: ShipmentStatus): string {
  return STATUS_ICONS[status] ?? STATUS_ICONS.unknown;
}

/**
 * Best-effort carrier guess from a tracking number's format. Only returns a
 * carrier when the pattern is *unambiguous* (currently just UPS's "1Z" prefix),
 * so we never mislead the user with a shaky guess. Returns null otherwise.
 */
export function guessCarrier(trackingNumber: string): Carrier | null {
  const t = (trackingNumber || "").trim().toUpperCase();
  if (/^1Z[0-9A-Z]{6,}$/.test(t)) return "ups";
  return null;
}

export function statusLabel(status: ShipmentStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function carrierLabel(carrier: Carrier): string {
  return CARRIER_LABELS[carrier] ?? carrier.toUpperCase();
}

/** Format an ISO string as a human date-time; returns a dash for null/invalid. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Stable per-day key for grouping (local calendar day); "" if null/invalid. */
export function dayKey(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Day header label, e.g. "Thu, Jul 2, 2026"; "" if null/invalid. */
export function formatDay(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Time-of-day only, e.g. "10:05 AM"; "" if null/invalid. */
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/** Compact relative time ("3h ago", "2d ago"); falls back to absolute date. */
export function relativeTime(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return "never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "never";
  const diffMs = now - d.getTime();
  const sec = Math.round(diffMs / 1000);
  if (sec < 0) return formatDate(iso);
  if (sec < 60) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  return formatDate(iso);
}
