import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
