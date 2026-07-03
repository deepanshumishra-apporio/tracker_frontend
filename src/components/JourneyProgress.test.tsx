import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { JourneyProgress } from "./JourneyProgress";

describe("JourneyProgress", () => {
  it("renders the four journey stages", () => {
    render(<JourneyProgress status="in_transit" />);
    expect(screen.getByText("Ordered")).toBeInTheDocument();
    expect(screen.getByText("In transit")).toBeInTheDocument();
    expect(screen.getByText("Out for delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
  });

  it("marks the current stage with aria-current", () => {
    render(<JourneyProgress status="out_for_delivery" />);
    const current = screen.getByText("Out for delivery").closest('[aria-current]');
    expect(current).toHaveAttribute("aria-current", "step");
  });

  it("renders nothing for off-path statuses", () => {
    const { container } = render(<JourneyProgress status="exception" />);
    expect(container).toBeEmptyDOMElement();
  });
});
