import { describe, expect, it } from "vitest";
import { isTietEmail } from "./institutionalEmail";

describe("isTietEmail", () => {
  it.each([
    "student@thapar.edu",
    "  STUDENT@THAPAR.EDU  ",
    "student.name-24@thapar.edu",
  ])("accepts TIET institutional address %s", (email) => {
    expect(isTietEmail(email)).toBe(true);
  });

  it.each([
    "student@gmail.com",
    "student@cs.thapar.edu",
    "student@thapar.edu.example.com",
    "student@@thapar.edu",
    ".student@thapar.edu",
    "student.@thapar.edu",
    "student..name@thapar.edu",
    "@thapar.edu",
    "student",
    "",
  ])("rejects non-institutional address %s", (email) => {
    expect(isTietEmail(email)).toBe(false);
  });
});
