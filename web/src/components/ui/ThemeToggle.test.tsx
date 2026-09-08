import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("announces the target theme and calls the toggle handler", () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="light" onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));

    expect(onToggle).toHaveBeenCalledOnce();
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("shows the light-mode action when the current theme is dark", () => {
    render(<ThemeToggle theme="dark" onToggle={() => undefined} />);
    expect(
      screen.getByRole("button", { name: "Switch to light mode" }),
    ).toBeInTheDocument();
  });
});
