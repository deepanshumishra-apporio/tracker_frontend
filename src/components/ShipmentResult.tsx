import { CarrierBadge } from "@/components/CarrierBadge";
import { CopyButton } from "@/components/CopyButton";
import { JourneyProgress } from "@/components/JourneyProgress";
import { StatusBadge } from "@/components/StatusBadge";
import { Timeline } from "@/components/Timeline";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import {
  STATUS_ACCENT,
  STATUS_STYLES,
  carrierLabel,
  carrierTrackingUrl,
  formatDateTime,
  journeyIndex,
  relativeTime,
  statusIcon,
  statusLabel,
} from "@/lib/format";
import type { Shipment } from "@/lib/types";

/** Presentational view of a single (ephemeral) tracking result. */
export function ShipmentResult({ shipment }: { shipment: Shipment }) {
  const offPath = journeyIndex(shipment.status) < 0; // exception / unknown
  const latest = shipment.events[0];

  return (
    <div className="space-y-6">
      {/* Hero: what's happening, at a glance */}
      <Card className={cn("overflow-hidden border", STATUS_ACCENT[shipment.status])}>
        <CardBody className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ring-1 ring-inset ${STATUS_STYLES[shipment.status]}`}
                aria-hidden
              >
                {statusIcon(shipment.status)}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {statusLabel(shipment.status)}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {heroSubtitle(shipment)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <CarrierBadge carrier={shipment.carrier} />
              <div className="flex items-center gap-1">
                <span className="font-mono text-sm text-slate-500">
                  {shipment.tracking_number}
                </span>
                <CopyButton value={shipment.tracking_number} />
              </div>
            </div>
          </div>

          {(shipment.origin || shipment.destination) && (
            <Route origin={shipment.origin} destination={shipment.destination} />
          )}

          {offPath ? (
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-4 py-3">
              <StatusBadge status={shipment.status} />
              <span className="text-sm text-slate-500">
                This shipment isn’t on the normal delivery path — see the history below.
              </span>
            </div>
          ) : (
            <JourneyProgress status={shipment.status} />
          )}
        </CardBody>
      </Card>

      {!shipment.ok && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Couldn’t retrieve tracking automatically
            {shipment.error ? `: ${shipment.error}` : "."} You can view it directly on{" "}
            {carrierLabel(shipment.carrier)}.
          </span>
          <a
            href={carrierTrackingUrl(shipment.carrier, shipment.tracking_number)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            Open on {carrierLabel(shipment.carrier)}
            <span aria-hidden>↗</span>
          </a>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-800">Shipment details</h3>
          </CardHeader>
          <CardBody>
            <dl className="space-y-3 text-sm">
              <DetailRow label="Service" value={shipment.service} />
              <DetailRow label="Weight" value={shipment.weight} />
              <DetailRow
                label="Pieces"
                value={shipment.pieces != null ? String(shipment.pieces) : null}
              />
              <DetailRow label="Signed by" value={shipment.signed_by} />
              <DetailRow label="Origin" value={shipment.origin} />
              <DetailRow label="Destination" value={shipment.destination} />
              <DetailRow
                label="Est. delivery"
                value={formatDateTime(shipment.estimated_delivery)}
              />
              <DetailRow
                label="Delivered at"
                value={formatDateTime(shipment.delivered_at)}
              />
              {/* Any extra carrier-specific fields (Waybill Number, Piece ID, …). */}
              {Object.entries(shipment.details).map(([label, value]) => (
                <DetailRow key={label} label={label} value={value} />
              ))}
            </dl>
          </CardBody>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-800">Tracking history</h3>
              {latest?.timestamp && (
                <span className="text-xs text-slate-400">
                  Updated {relativeTime(latest.timestamp)}
                </span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <Timeline events={shipment.events} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/** Context line under the big status. */
function heroSubtitle(s: Shipment): string {
  if (s.status === "delivered" && s.delivered_at) {
    return `Delivered on ${formatDateTime(s.delivered_at)}`;
  }
  if (s.estimated_delivery) {
    return `Estimated delivery ${formatDateTime(s.estimated_delivery)}`;
  }
  const latest = s.events[0];
  if (latest?.timestamp) return `Last update ${relativeTime(latest.timestamp)}`;
  if (latest?.description) return latest.description;
  return "Live tracking result";
}

function Route({
  origin,
  destination,
}: {
  origin: string | null;
  destination: string | null;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/60 px-4 py-3 text-sm ring-1 ring-inset ring-slate-100">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">From</p>
        <p className="truncate font-medium text-slate-800">{origin || "—"}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-slate-300" />
        <span className="h-px w-8 bg-gradient-to-r from-slate-300 to-slate-400 sm:w-14" />
        <span className="text-sm">✈️</span>
        <span className="h-px w-8 bg-gradient-to-r from-slate-400 to-slate-500 sm:w-14" />
        <span className="h-2 w-2 rounded-full bg-slate-500" />
      </div>
      <div className="min-w-0 flex-1 text-right">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">To</p>
        <p className="truncate font-medium text-slate-800">{destination || "—"}</p>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value || "—"}</dd>
    </div>
  );
}
