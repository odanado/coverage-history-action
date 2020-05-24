import { add } from "./";

describe("index", () => {
  it("ok", () => {
    expect(1).toBe(1);
    expect(add(1, 2)).toBe(3);
  });
});
