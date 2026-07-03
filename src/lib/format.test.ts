import { describe, expect, it } from "vitest";
import {
  carrierLabel,
  formatDate,
  formatDateTime,
  relativeTime,
  statusLabel,
} from "./format";

describe("labels", () => {
  it("maps known statuses and carriers to friendly labels", () => {
    expect(statusLabel("out_for_delivery")).toBe("Out for delivery");
    expect(statusLabel("delivered")).toBe("Delivered");
    expect(carrierLabel("fedex")).toBe("FedEx");
    expect(carrierLabel("dhl")).toBe("DHL");
  });
});

describe("date formatting", () => {
  it("returns a dash for empty/invalid input", () => {
    expect(formatDateTime(null)).toBe("—");
    expect(formatDateTime(undefined)).toBe("—");
    expect(formatDateTime("not-a-date")).toBe("—");
    expect(formatDate(null)).toBe("—");
  });

  it("formats a valid ISO string", () => {
    // Non-empty, not the dash placeholder.
    const out = formatDateTime("2026-06-30T10:25:00Z");
    expect(out).not.toBe("—");
    expect(out.length).toBeGreaterThan(0);
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-07-02T12:00:00Z").getTime();

  it("handles null and invalid values", () => {
    expect(relativeTime(null, now)).toBe("never");
    expect(relativeTime("nope", now)).toBe("never");
  });

  it("buckets recent timestamps", () => {
    expect(relativeTime("2026-07-02T11:59:30Z", now)).toBe("just now");
    expect(relativeTime("2026-07-02T11:30:00Z", now)).toBe("30m ago");
    expect(relativeTime("2026-07-02T09:00:00Z", now)).toBe("3h ago");
    expect(relativeTime("2026-06-30T12:00:00Z", now)).toBe("2d ago");
  });

  it("falls back to an absolute date for old timestamps", () => {
    expect(relativeTime("2026-01-01T12:00:00Z", now)).not.toMatch(/ago/);
  });

  it("does not produce negative 'ago' for future timestamps", () => {
    const out = relativeTime("2026-07-05T12:00:00Z", now);
    expect(out).not.toMatch(/-/);
    expect(out).not.toMatch(/ago/);
  });
});
