import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToastProvider } from "./ui/Toast";
import { TrackForm } from "./TrackForm";

// TrackForm fires toasts, so it must render inside a ToastProvider.
function renderForm(props: React.ComponentProps<typeof TrackForm>) {
  return render(
    <ToastProvider>
      <TrackForm {...props} />
    </ToastProvider>,
  );
}

describe("TrackForm", () => {
  it("calls onSearch with carrier and trimmed tracking number", async () => {
    const onSearch = vi.fn();
    renderForm({ onSearch });

    await userEvent.selectOptions(screen.getByLabelText("Carrier"), "dhl");
    await userEvent.type(screen.getByLabelText("Tracking number"), "  1790531772  ");
    await userEvent.click(screen.getByRole("button", { name: /track/i }));

    expect(onSearch).toHaveBeenCalledWith("dhl", "1790531772");
  });

  it("shows a validation error and does not search when empty", async () => {
    const onSearch = vi.fn();
    renderForm({ onSearch });

    await userEvent.click(screen.getByRole("button", { name: /track/i }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByText("Enter a tracking number.")).toBeInTheDocument();
  });

  it("disables inputs and shows a searching label while loading", () => {
    renderForm({ onSearch: () => {}, loading: true });
    expect(screen.getByLabelText("Tracking number")).toBeDisabled();
    expect(screen.getByRole("button", { name: /searching/i })).toBeDisabled();
  });

  it("warns and can switch carrier when a UPS number is entered under another carrier", async () => {
    const onSearch = vi.fn();
    renderForm({ onSearch });

    // Default carrier is UPS; pick DHL, then type a UPS-format number.
    await userEvent.selectOptions(screen.getByLabelText("Carrier"), "dhl");
    await userEvent.type(screen.getByLabelText("Tracking number"), "1ZH40B480437006864");

    expect(screen.getByText(/looks like a/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /switch to ups/i }));

    // Carrier switched; warning gone; searching now uses UPS.
    expect(screen.queryByText(/looks like a/i)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /^track$/i }));
    expect(onSearch).toHaveBeenCalledWith("ups", "1ZH40B480437006864");
  });

  it("shows no warning when the format matches the selected carrier", async () => {
    renderForm({ onSearch: vi.fn() }); // default UPS
    await userEvent.type(screen.getByLabelText("Tracking number"), "1ZH40B480437006864");
    expect(screen.queryByText(/looks like a/i)).toBeNull();
  });
});
