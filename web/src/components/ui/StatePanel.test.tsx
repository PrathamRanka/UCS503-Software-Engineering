import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StatePanel } from "./StatePanel";

describe("StatePanel", () => {
  it("renders an error message and performs its recovery action", () => {
    const onAction = vi.fn();
    render(
      <StatePanel
        type="error"
        title="Page not found"
        message="Return to a valid route."
        actionLabel="Return home"
        onAction={onAction}
      />,
    );

    expect(screen.getByText("Return to a valid route.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Return home" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("uses a safe default title for loading state", () => {
    render(<StatePanel type="loading" />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });
});
