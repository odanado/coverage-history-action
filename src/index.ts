import core from "@actions/core";
import { context, GitHub } from "@actions/github";

import { IstanbulLoader } from "./loader/istanbul.loader";
import { TextReporter } from "./reporter/text.reporter";

export function add(a: number, b: number): number {
  return a + b;
}

type Inputs = {
  COVERAGE_DIR: string;
  TARGET: string;
  GITHUB_TOKEN: string;
};

function loadInputs(): Inputs {
  return {
    COVERAGE_DIR: "coverage",
    TARGET: "master",
    GITHUB_TOKEN: core.getInput("github-token"),
  };
}

async function main(): Promise<void> {
  const inputs = loadInputs();
  const loader = new IstanbulLoader(inputs.COVERAGE_DIR);
  const coverage = await loader.load();

  const reporter = new TextReporter();

  const report = await reporter.report(coverage, coverage);

  const client = new GitHub(inputs.GITHUB_TOKEN);

  const commitCommentParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    commit_sha: context.sha,
    body: report,
  };
  await client.repos.createCommitComment(commitCommentParams);

  console.log(report);
}

if (!module.parent) {
  main();
}

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
