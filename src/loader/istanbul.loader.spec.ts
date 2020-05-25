import { IstanbulLoader } from "./istanbul.loader";

describe("IstanbulLoader", () => {
  const loader = new IstanbulLoader("./fixture");
  it("ok", async () => {
    const coverage = await loader.load();

    expect(coverage.statement).toBeDefined();
    expect(coverage.statement.total).toBeCloseTo(0.3732);
    expect(coverage.branch.total).toBeCloseTo(0.0417);
    expect(coverage.function.total).toBeCloseTo(0.359);
  });
});
