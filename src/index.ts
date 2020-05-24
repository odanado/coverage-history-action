import { getInput } from "@actions/core";
import { context, GitHub } from "@actions/github";

import { IstanbulLoader } from "./loader/istanbul.loader";
import { TextReporter } from "./reporter/text.reporter";
import { CacheRepository } from "./repository/cache.repository";

import { ReportUsecase } from "./usecase/report.usecase";
import { StoreUsecase } from "./usecase/store.usecase";

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
    GITHUB_TOKEN: getInput("github-token"),
  };
}

async function main(): Promise<void> {
  const inputs = loadInputs();
  const loader = new IstanbulLoader(inputs.COVERAGE_DIR);
  const repository = new CacheRepository();

  const reporter = new TextReporter();

  const client = new GitHub(inputs.GITHUB_TOKEN);

  const reportUsecase = new ReportUsecase(reporter, repository, client);
  const storeUsecase = new StoreUsecase(loader, repository);

  await storeUsecase.storeCoverage(inputs.TARGET);
  await reportUsecase.report(inputs.TARGET, inputs.TARGET);
}

if (!module.parent) {
  main();
}

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
