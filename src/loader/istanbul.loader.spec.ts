import fs from "fs";
import { mocked } from "ts-jest/utils";
import { IstanbulLoader, IstanbulCoverage } from "./istanbul.loader";

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe("IstanbulLoader", () => {
  const loader = new IstanbulLoader("");
  it("ok", async () => {
    const mock = ({
      fileA: {
        s: {
          "0": 1,
          "1": 1,
          "2": 1,
        },
      },
      fileB: {
        s: {
          "0": 0,
          "1": 0,
          "2": 1,
        },
      },
    } as unknown) as IstanbulCoverage;

    mocked(fs.promises.readFile).mockResolvedValue(JSON.stringify(mock));
    const coverage = await loader.load();

    expect(coverage.statement).toBeDefined();
    expect(coverage.statement.total).toBeCloseTo(4 / 6);

    const fileA = coverage.statement.paths.find((x) => x.path === "fileA");
    const fileB = coverage.statement.paths.find((x) => x.path === "fileB");

    if (!fileA || !fileB) {
      expect(true).toBe(false);
      return;
    }

    expect(fileA.value).toBeCloseTo(1);
    expect(fileB.value).toBeCloseTo(1 / 3);
  });
});
