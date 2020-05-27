import { MarkdownReporter } from "./markdown.reporter";
import { CoverageSet } from "../type";

describe("MarkdownReporter", () => {
  const target: CoverageSet = {
    statement: {
      total: 0.1,
      paths: [],
    },
    branch: {
      total: 0.2,
      paths: [],
    },
    function: {
      total: 0.3,
      paths: [],
    },
  };
  const current: CoverageSet = {
    statement: {
      total: 0.4,
      paths: [],
    },
    branch: {
      total: 0.5,
      paths: [],
    },
    function: {
      total: 0.6,
      paths: [],
    },
  };
  it("report correctly", async () => {
    const reporter = new MarkdownReporter();
    const report = await reporter.report(
      { branch: "master", coverage: target },
      { branch: "feature", coverage: current }
    );
    expect(report).toMatchSnapshot();
  });
});
