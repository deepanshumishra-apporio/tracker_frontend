"use client";

import { useState } from "react";
import { ShipmentResult } from "@/components/ShipmentResult";
import { TrackForm } from "@/components/TrackForm";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import type { Carrier, Shipment } from "@/lib/types";

type View =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; shipment: Shipment }
  | { kind: "error"; message: string };

export default function TrackPage() {
  // All state is in-memory only — nothing is stored, so a refresh clears it.
  const [view, setView] = useState<View>({ kind: "idle" });

  async function handleSearch(carrier: Carrier, trackingNumber: string) {
    setView({ kind: "loading" });
    try {
      const shipment = await api.track(carrier, trackingNumber);
      setView({ kind: "result", shipment });
    } catch (err) {
      setView({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Track a shipment
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Pick a carrier, enter a tracking number, and search. Results are fetched
          live and not saved — refreshing the page clears them.
        </p>
      </section>

      <Card className="shadow-sm">
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
          <EmptyState icon="⚠️" title="Couldn’t track that shipment" description={view.message} />
        )}

        {view.kind === "result" && (
          <div className="space-y-4">
            {view.shipment.ok && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200">
                <span aria-hidden>✅</span>
                <span>Successfully completed.</span>
              </div>
            )}
            <ShipmentResult shipment={view.shipment} />
          </div>
        )}
      </section>
    </div>
  );
}
