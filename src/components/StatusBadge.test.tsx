import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";
import { CarrierBadge } from "./CarrierBadge";

describe("StatusBadge", () => {
  it("renders the friendly status label", () => {
    render(<StatusBadge status="out_for_delivery" />);
    expect(screen.getByText("Out for delivery")).toBeInTheDocument();
  });
});

describe("CarrierBadge", () => {
  it("renders the carrier label", () => {
    render(<CarrierBadge carrier="fedex" />);
    expect(screen.getByText("FedEx")).toBeInTheDocument();
  });
});
