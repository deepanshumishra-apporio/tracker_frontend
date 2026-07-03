import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "./api";

function mockFetch(impl: (url: string, init?: RequestInit) => Response | Promise<Response>) {
  const fn = vi.fn(impl as unknown as typeof fetch);
  vi.stubGlobal("fetch", fn);
  return fn;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api client", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("builds the track query with carrier + trimmed number", async () => {
    const fetchFn = mockFetch(() => jsonResponse({ tracking_number: "1Z" }));
    await api.track("dhl", "  1790531772  ");
    const url = fetchFn.mock.calls[0][0] as string;
    expect(url).toContain("/api/track?");
    expect(url).toContain("carrier=dhl");
    expect(url).toContain("tracking_number=1790531772");
  });

  it("parses a successful JSON body", async () => {
    mockFetch(() => jsonResponse({ status: "ok" }));
    await expect(api.health()).resolves.toEqual({ status: "ok" });
  });

  it("throws ApiError with the server detail on non-2xx", async () => {
    mockFetch(() => jsonResponse({ detail: "invalid carrier" }, 422));
    await expect(api.track("usps", "1")).rejects.toMatchObject({
      status: 422,
      message: "invalid carrier",
    });
  });

  it("wraps network failures in a friendly ApiError", async () => {
    mockFetch(() => {
      throw new TypeError("network down");
    });
    const err = await api.track("ups", "1Z").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(0);
  });
});
