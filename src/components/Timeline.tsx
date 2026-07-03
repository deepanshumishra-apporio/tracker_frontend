"use client";

import { useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/cn";
import { STATUS_DOT, dayKey, formatDay, formatTime, statusLabel } from "@/lib/format";
import type { TrackingEvent } from "@/lib/types";

/** Long histories (e.g. 100+ scans) collapse to this many until expanded. */
const INITIAL_COUNT = 20;

interface DayGroup {
  key: string;
  label: string;
  events: TrackingEvent[];
}

/** Group already-sorted (newest-first) events by calendar day. */
function groupByDay(events: TrackingEvent[]): DayGroup[] {
  const groups: DayGroup[] = [];
  for (const event of events) {
    const key = dayKey(event.timestamp);
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.events.push(event);
    } else {
      groups.push({ key, label: formatDay(event.timestamp), events: [event] });
    }
  }
  return groups;
}

export function Timeline({ events }: { events: TrackingEvent[] }) {
  const [expanded, setExpanded] = useState(false);

  if (events.length === 0) {
    return (
      <EmptyState
        icon="🕓"
        title="No tracking events yet"
        description="Scan history from the carrier will appear here as the parcel moves."
      />
    );
  }

  const collapsible = events.length > INITIAL_COUNT;
  const shown = collapsible && !expanded ? events.slice(0, INITIAL_COUNT) : events;
  const groups = groupByDay(shown);

  return (
    <div className="space-y-6">
      {groups.map((group, gi) => (
        <section key={`${group.key}-${gi}`}>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {group.label || "Earlier"}
          </h4>
          <ol className="space-y-0">
            {group.events.map((event, i) => {
              const isFirstOverall = gi === 0 && i === 0;
              const isLastInGroup = i === group.events.length - 1;
              return (
                <li key={`${event.timestamp ?? "e"}-${i}`} className="flex gap-4">
                  {/* Rail: dot + connecting line within the day group */}
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "mt-1 h-3 w-3 shrink-0 rounded-full ring-4 ring-white",
                        STATUS_DOT[event.status],
                        isFirstOverall && "ring-slate-100",
                      )}
                      aria-hidden
                    />
                    {!isLastInGroup && (
                      <span className="w-px flex-1 bg-slate-200" aria-hidden />
                    )}
                  </div>

                  {/* Event content */}
                  <div className="min-w-0 flex-1 pb-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isFirstOverall ? "text-slate-900" : "text-slate-700",
                        )}
                      >
                        {event.description || statusLabel(event.status)}
                      </span>
                      {isFirstOverall && (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Latest
                        </span>
                      )}
                    </div>

                    {event.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <span aria-hidden>📍</span>
                        {event.location}
                      </p>
                    )}

                    {formatTime(event.timestamp) && (
                      <p className="mt-1 text-xs text-slate-400">
                        {formatTime(event.timestamp)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
        >
          {expanded
            ? "Show less"
            : `Show all ${events.length} updates`}
        </button>
      )}
    </div>
  );
}
