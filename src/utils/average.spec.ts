import { average } from "./average";

describe("average", () => {
  it("correct", () => {
    expect(average([1, 2, 3])).toBe(2);
  });
});
