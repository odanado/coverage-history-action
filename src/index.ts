import { getInput } from "@actions/core";
import { context, GitHub } from "@actions/github";
import { Context } from "@actions/github/lib/context";

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

function getBranch(context: Context): string {
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }
  return context.ref.split("/")[2];
}

function getMode(context: Context): string | undefined {
  if (context.eventName === "pull_request") {
    return "report";
  }
  if (context.eventName === "push" && getBranch(context) === "master") {
    return "store";
  }
}

async function main(): Promise<void> {
  const inputs = loadInputs();
  const loader = new IstanbulLoader(inputs.COVERAGE_DIR);
  const repository = new CacheRepository();

  const reporter = new TextReporter();

  const client = new GitHub(inputs.GITHUB_TOKEN);

  const reportUsecase = new ReportUsecase(loader, reporter, repository, client);
  const storeUsecase = new StoreUsecase(loader, repository);

  const mode = getMode(context);
  switch (mode) {
    case "store":
      await storeUsecase.storeCoverage(inputs.TARGET);
      break;
    case "report":
      await reportUsecase.report(inputs.TARGET);
      break;
  }
}

if (!module.parent) {
  main();
}

process.on("unhandledRejection", (reason) => {
  console.error(reason);
  process.exit(1);
});
