import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Reel } from "../../types/social";
import { ReelsView } from "./ReelsView";

const testReels: Reel[] = [
  { id: 1, creator: "owasp.tiet", avatar: "/images/coding.webp", image: "/images/coding.webp", caption: "OWASP campus security session", likes: "42", comments: "8", audio: "OWASP TIET security session" },
  { id: 2, creator: "mudra.tiet", avatar: "/images/event.webp", image: "/images/event.webp", video: "/videos/campus-reel.mp4", caption: "MUDRA rehearsal", likes: "31", comments: "5", audio: "MUDRA rehearsal mix" },
  { id: 3, creator: "ccs.tiet", avatar: "/images/dev.webp", image: "/images/dev.webp", caption: "CCS build room", likes: "28", comments: "4", audio: "CCS build-room audio" },
];

function renderReels() {
  return render(
    <ReelsView username="student" reels={testReels} onShare={() => undefined} onPreview={() => undefined} onEdit={() => undefined} onDelete={() => undefined} />,
  );
}

describe("ReelsView controls", () => {
  it("shows sound attribution without external links or embeds", () => {
    const { container } = renderReels();
    expect(screen.getByLabelText("Sound: OWASP TIET security session")).toBeInTheDocument();
    expect(container.querySelector("a[href^='http']")).not.toBeInTheDocument();
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
  });

  it("starts on playable media when a video is available", () => {
    renderReels();
    expect(screen.getAllByTestId("reel-card")[0].querySelector("video")).not.toBeNull();
  });

  it("provides previous and next reel buttons", async () => {
    renderReels();
    const feed = screen.getByTestId("reels-feed");
    const scrollTo = vi.fn();
    Object.defineProperty(feed, "clientHeight", { configurable: true, value: 700 });
    Object.defineProperty(feed, "scrollTo", { configurable: true, value: scrollTo });
    expect(screen.getByRole("button", { name: "Previous reel" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Next reel" }));
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 700, behavior: "auto" }));
  });

  it("does not show a reel position counter", () => {
    renderReels();
    expect(screen.queryByText(/1\s*\/\s*3/)).not.toBeInTheDocument();
  });
});
