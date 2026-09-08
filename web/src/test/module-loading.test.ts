import { describe, expect, it } from "vitest";

const productionModules = import.meta.glob(
  [
    "../App.tsx",
    "../components/**/*.tsx",
    "../data/*.ts",
    "../utils/*.ts",
    "!../**/*.test.ts",
    "!../**/*.test.tsx",
  ],
  { eager: true },
);

describe("production module loading", () => {
  it.each(Object.entries(productionModules))(
    "loads %s without a module-level error",
    (_path, loadedModule) => {
      expect(loadedModule).toBeTypeOf("object");
    },
  );
});
