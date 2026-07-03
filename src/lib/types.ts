/**
 * Types mirroring the backend API contract (see backend/index.py schemas).
 * Kept in one place so components and the API client stay in sync.
 */

export const CARRIERS = ["ups", "fedex", "dhl", "aramex"] as const;
export type Carrier = (typeof CARRIERS)[number];

export const STATUSES = [
  "pending",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "exception",
  "unknown",
] as const;
export type ShipmentStatus = (typeof STATUSES)[number];

export interface TrackingEvent {
  timestamp: string | null;
  location: string | null;
  description: string;
  status: ShipmentStatus;
}

export interface Shipment {
  tracking_number: string;
  carrier: Carrier;
  status: ShipmentStatus;
  estimated_delivery: string | null;
  delivered_at: string | null;
  origin: string | null;
  destination: string | null;
  service: string | null;
  weight: string | null;
  pieces: number | null;
  signed_by: string | null;
  details: Record<string, string>;
  events: TrackingEvent[];
  scraped_at: string | null;
  ok: boolean;
  error: string | null;
}

