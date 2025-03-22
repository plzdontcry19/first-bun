import { expect, test } from "bun:test";

test("2 + 2", () => {
  const start = performance.now();
  const end = performance.now();
  expect(end - start).toBeLessThan(1000);
});
