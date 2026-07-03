import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";
import type { TrackingEvent } from "@/lib/types";

describe("Timeline", () => {
  it("shows an empty state when there are no events", () => {
    render(<Timeline events={[]} />);
    expect(screen.getByText("No tracking events yet")).toBeInTheDocument();
  });

  it("renders each event with description, location and status", () => {
    const events: TrackingEvent[] = [
      {
        timestamp: "2026-06-30T10:25:00Z",
        location: "Dublin - Ireland",
        description: "Delivered",
        status: "delivered",
      },
      {
        timestamp: "2026-06-29T08:00:00Z",
        location: "Leipzig - Germany",
        description: "Departed facility",
        status: "in_transit",
      },
    ];
    render(<Timeline events={events} />);

    // "Delivered" appears twice (status badge + description), so assert >=1.
    expect(screen.getAllByText("Delivered").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Departed facility")).toBeInTheDocument();
    expect(screen.getByText("Dublin - Ireland")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("groups same-day events under a single day header", () => {
    const sameDay: TrackingEvent[] = [
      { timestamp: "2026-06-30T14:00:00Z", location: "Hub B", description: "On the way", status: "in_transit" },
      { timestamp: "2026-06-30T08:00:00Z", location: "Hub A", description: "Arrived", status: "in_transit" },
    ];
    render(<Timeline events={sameDay} />);
    // Two events, but only one day-group heading.
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 4 })).toHaveLength(1);
  });

  it("collapses very long histories and expands on demand", async () => {
    // 60 events across distinct times, all in-transit.
    const many: TrackingEvent[] = Array.from({ length: 60 }, (_, i) => ({
      timestamp: `2026-06-${String(1 + (i % 28)).padStart(2, "0")}T0${i % 9}:00:00Z`,
      location: `Hub ${i}`,
      description: `Scan ${i}`,
      status: "in_transit" as const,
    }));
    render(<Timeline events={many} />);

    // Collapsed: only the first 20 items render, with a "Show all" button.
    expect(screen.getAllByRole("listitem").length).toBe(20);
    const toggle = screen.getByRole("button", { name: /show all 60 updates/i });
    await userEvent.click(toggle);

    // Expanded: all 60 render, button flips to "Show less".
    expect(screen.getAllByRole("listitem").length).toBe(60);
    expect(screen.getByRole("button", { name: /show less/i })).toBeInTheDocument();
  });

  it("shows no toggle for short histories", () => {
    const few: TrackingEvent[] = [
      { timestamp: "2026-06-30T14:00:00Z", location: null, description: "A", status: "in_transit" },
    ];
    render(<Timeline events={few} />);
    expect(screen.queryByRole("button", { name: /show all/i })).toBeNull();
  });

  it("only tags the newest event as Latest", () => {
    const events: TrackingEvent[] = [
      { timestamp: "2026-06-30T14:00:00Z", location: null, description: "On the way", status: "in_transit" },
      { timestamp: "2026-06-29T08:00:00Z", location: null, description: "Picked up", status: "pending" },
    ];
    render(<Timeline events={events} />);
    expect(screen.getAllByText("Latest")).toHaveLength(1);
  });
});
