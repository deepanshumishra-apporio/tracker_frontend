import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  it("writes the value to the clipboard and shows a confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(<CopyButton value="1Z999AA10123456784" />);
    await userEvent.click(screen.getByRole("button", { name: /copy tracking number/i }));

    expect(writeText).toHaveBeenCalledWith("1Z999AA10123456784");
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
