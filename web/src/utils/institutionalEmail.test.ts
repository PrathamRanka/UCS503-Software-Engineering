import { describe, expect, it } from "vitest";
import { isTietEmail } from "./institutionalEmail";

describe("isTietEmail", () => {
  it.each([
    "student@thapar.edu",
    "  STUDENT@THAPAR.EDU  ",
    "student@cs.thapar.edu",
  ])("accepts TIET institutional address %s", (email) => {
    expect(isTietEmail(email)).toBe(true);
  });

  it.each([
    "student@gmail.com",
    "student@thapar.edu.example.com",
    "@thapar.edu",
    "student",
    "",
  ])("rejects non-institutional address %s", (email) => {
    expect(isTietEmail(email)).toBe(false);
  });
});
