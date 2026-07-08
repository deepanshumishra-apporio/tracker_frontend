"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CARRIER_LABELS, carrierLabel, guessCarrier } from "@/lib/format";
import { CARRIERS } from "@/lib/types";
import type { Carrier } from "@/lib/types";

const CARRIER_OPTIONS = CARRIERS.map((c) => ({ value: c, label: CARRIER_LABELS[c] }));

export interface TrackFormProps {
  onSearch: (carrier: Carrier, trackingNumber: string) => void;
  loading?: boolean;
}

/** Carrier picker + tracking-number input. Purely a controlled search form. */
export function TrackForm({ onSearch, loading }: TrackFormProps) {
  const [carrier, setCarrier] = useState<Carrier>("ups");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (!trimmed) {
      setError("Enter a tracking number.");
      return;
    }
    setError(null);
    onSearch(carrier, trimmed);
  }

  // Warn if the number's format clearly belongs to a different carrier.
  const suggested = guessCarrier(trackingNumber);
  const mismatch = suggested && suggested !== carrier ? suggested : null;

  // FedEx tracking is temporarily unavailable.
  const underMaintenance = carrier === "fedex";

  return (
    <div className="space-y-2">
      {underMaintenance && (
        <div className="flex items-center gap-2 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800 ring-1 ring-inset ring-orange-200">
          <span aria-hidden>🛠️</span>
          <span>
            <strong>{carrierLabel("fedex")}</strong> tracking is currently under maintenance.
            Please try again later or use another carrier.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        aria-label="Track a shipment"
      >
        <div className="sm:w-44">
          <Select
            label="Carrier"
            name="carrier"
            options={CARRIER_OPTIONS}
            value={carrier}
            onChange={(e) => setCarrier(e.target.value as Carrier)}
            disabled={loading}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Tracking number"
            name="tracking_number"
            placeholder="e.g. 1Z999AA10123456784"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            error={error ?? undefined}
            disabled={loading}
          />
        </div>
        <Button type="submit" loading={loading} disabled={underMaintenance}>
          {loading ? "Searching…" : "Track"}
        </Button>
      </form>

      {mismatch && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-inset ring-amber-200">
          <span>
            This looks like a <strong>{carrierLabel(mismatch)}</strong> tracking number, but{" "}
            <strong>{carrierLabel(carrier)}</strong> is selected.
          </span>
          <button
            type="button"
            onClick={() => setCarrier(mismatch)}
            className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
          >
            Switch to {carrierLabel(mismatch)}
          </button>
        </div>
      )}
    </div>
  );
}
