/**
 * Typed API client for the tracker backend.
 *
 * A single `request()` core handles base-URL resolution, JSON parsing, and
 * error normalization; the exported functions are thin, well-named wrappers.
 */
import type { Shipment } from "./types";

// Defaults to the deployed backend; override with NEXT_PUBLIC_API_URL (e.g.
// http://127.0.0.1:8000 for local dev).
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://tracker-backend-hct6.onrender.com";

/** Thrown for any non-2xx response, carrying the HTTP status for the UI. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      cache: "no-store",
      ...init,
    });
  } catch {
    throw new ApiError("Cannot reach the tracker API. Is the backend running?", 0);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? safeJson(text) : undefined;

  if (!res.ok) {
    const detail =
      (data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : undefined) ?? `Request failed (${res.status})`;
    throw new ApiError(detail, res.status);
  }

  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),

  /** Live scrape — no storage. The result is ephemeral to the caller. */
  track: (carrier: string, trackingNumber: string) => {
    const params = new URLSearchParams({
      carrier,
      tracking_number: trackingNumber.trim(),
    });
    return request<Shipment>(`/api/track?${params.toString()}`);
  },
};

export type Api = typeof api;
