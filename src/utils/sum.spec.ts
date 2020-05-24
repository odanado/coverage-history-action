import { sum } from "./sum";

describe("sum", () => {
  it("correct", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });
});
