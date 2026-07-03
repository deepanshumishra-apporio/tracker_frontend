import { Fragment } from "react";
import { cn } from "@/lib/cn";
import { JOURNEY_STEPS, STATUS_ICONS, journeyIndex } from "@/lib/format";
import type { ShipmentStatus } from "@/lib/types";

/**
 * Horizontal stepper showing the happy-path stages (Ordered → In transit →
 * Out for delivery → Delivered) with the current stage highlighted, so the
 * user immediately understands where the shipment is.
 *
 * Renders nothing for off-path statuses (exception / unknown) — the caller
 * surfaces those with a dedicated callout instead of a misleading progress bar.
 */
export function JourneyProgress({ status }: { status: ShipmentStatus }) {
  const current = journeyIndex(status);
  if (current < 0) return null;

  return (
    <div className="flex items-start" aria-label="Delivery progress">
      {JOURNEY_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const reached = i <= current;

        return (
          <Fragment key={step.status}>
            {i > 0 && (
              <div
                aria-hidden
                className={cn(
                  "mt-4 h-0.5 flex-1 rounded-full transition-colors",
                  reached ? "bg-emerald-500" : "bg-slate-200",
                )}
              />
            )}
            <div
              aria-current={active ? "step" : undefined}
              className="flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-24"
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm ring-4 transition-colors",
                  done && "bg-emerald-500 text-white ring-emerald-100",
                  active && "bg-slate-900 text-white ring-slate-200",
                  !reached && "bg-white text-slate-300 ring-slate-100 border border-slate-200",
                )}
              >
                {done ? "✓" : STATUS_ICONS[step.status]}
              </span>
              <span
                className={cn(
                  "text-center text-[11px] font-medium leading-tight sm:text-xs",
                  active ? "text-slate-900" : reached ? "text-emerald-700" : "text-slate-400",
                )}
              >
                {step.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
