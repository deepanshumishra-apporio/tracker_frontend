"use client";

import { useState } from "react";
import { ShipmentResult } from "@/components/ShipmentResult";
import { TrackForm } from "@/components/TrackForm";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { api } from "@/lib/api";
import { carrierLabel } from "@/lib/format";
import type { Carrier, Shipment } from "@/lib/types";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; shipment: Shipment }
  | { kind: "error"; message: string };

export default function TrackPage() {
  // All state is in-memory only — nothing is stored, so a refresh clears it.
  const [view, setView] = useState<View>({ kind: "idle" });
  const { toast } = useToast();

  async function handleSearch(carrier: Carrier, trackingNumber: string) {
    setView({ kind: "loading" });
    try {
      const shipment = await api.track(carrier, trackingNumber);
      setView({ kind: "result", shipment });
      if (shipment.ok) {
        toast({
          variant: "success",
          title: "Successfully completed",
          description: `${carrierLabel(carrier)} · ${trackingNumber}`,
        });
      } else {
        toast({
          variant: "error",
          title: "Couldn’t retrieve tracking",
          description: shipment.error ?? "The carrier returned no data.",
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setView({ kind: "error", message });
      toast({
        variant: "error",
        title: "Tracking failed",
        description: message,
      });
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-100">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Live carrier tracking
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Track a shipment
        </h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Pick a carrier, enter a tracking number, and search. Results are fetched
          live and not saved — refreshing the page clears them.
        </p>
      </section>

      <Card className="shadow-sm ring-1 ring-slate-900/5">
        <CardBody className="py-5">
          <TrackForm onSearch={handleSearch} loading={view.kind === "loading"} />
        </CardBody>
      </Card>

      <section>
        {view.kind === "idle" && (
          <EmptyState
            icon="🔎"
            title="No search yet"
            description="Enter a carrier and tracking number above to look up a shipment."
          />
        )}

        {view.kind === "loading" && (
          <div className="flex flex-col items-center gap-3 py-16">
            <Spinner className="h-8 w-8" />
            <p className="text-sm text-slate-500">
              Fetching live from the carrier — this can take up to ~30 seconds.
            </p>
          </div>
        )}

        {view.kind === "error" && (
          <EmptyState
            icon="⚠️"
            title="Couldn’t track that shipment"
            description={view.message}
          />
        )}

        {view.kind === "result" && (
          <div className="animate-in">
            <ShipmentResult shipment={view.shipment} />
          </div>
        )}
      </section>
    </div>
  );
}
