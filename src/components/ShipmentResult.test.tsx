import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShipmentResult } from "./ShipmentResult";
import type { Shipment } from "@/lib/types";

const base: Shipment = {
  tracking_number: "1790531772",
  carrier: "dhl",
  status: "delivered",
  estimated_delivery: null,
  delivered_at: "2026-06-30T10:25:00Z",
  origin: "Leipzig",
  destination: "Dublin",
  service: "EXPRESS WORLDWIDE",
  weight: "2.5 kg",
  pieces: 1,
  signed_by: null,
  details: { "Waybill Number": "1790531772" },
  events: [
    { timestamp: "2026-06-30T10:25:00Z", location: "Dublin", description: "Delivered", status: "delivered" },
  ],
  scraped_at: "2026-06-30T11:00:00Z",
  ok: true,
  error: null,
};

describe("ShipmentResult", () => {
  it("renders the number, carrier, route and event history", () => {
    render(<ShipmentResult shipment={base} />);
    // Appears as the header and as the Waybill Number detail value.
    expect(screen.getAllByText("1790531772").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("DHL")).toBeInTheDocument();
    // "Dublin" appears as both destination and event location.
    expect(screen.getAllByText("Dublin").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("listitem")).toBeInTheDocument(); // one timeline event
  });

  it("renders shipment attributes: service, weight, pieces and extra details", () => {
    render(<ShipmentResult shipment={base} />);
    expect(screen.getByText("EXPRESS WORLDWIDE")).toBeInTheDocument();
    expect(screen.getByText("2.5 kg")).toBeInTheDocument();
    expect(screen.getByText("Pieces")).toBeInTheDocument();
    // Extra detail bag entry (Waybill Number) is rendered as its own row.
    expect(screen.getByText("Waybill Number")).toBeInTheDocument();
  });

  it("shows an error banner when the scrape failed", () => {
    render(
      <ShipmentResult
        shipment={{ ...base, ok: false, error: "bot-check wall", status: "unknown", events: [] }}
      />,
    );
    expect(screen.getByText(/bot-check wall/)).toBeInTheDocument();
  });

  it("shows a dash for missing detail fields", () => {
    render(
      <ShipmentResult
        shipment={{ ...base, origin: null, destination: null, delivered_at: null }}
      />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });
});
