"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = void 0;
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const istanbul_loader_1 = require("./loader/istanbul.loader");
const markdown_reporter_1 = require("./reporter/markdown.reporter");
const cache_repository_1 = require("./repository/cache.repository");
const report_usecase_1 = require("./usecase/report.usecase");
const store_usecase_1 = require("./usecase/store.usecase");
function add(a, b) {
    return a + b;
}
exports.add = add;
function loadInputs() {
    return {
        COVERAGE_DIR: "coverage",
        TARGET: "master",
        GITHUB_TOKEN: core_1.getInput("github-token"),
    };
}
function getBranch(context) {
    if (process.env.GITHUB_HEAD_REF) {
        return process.env.GITHUB_HEAD_REF;
    }
    return context.ref.split("/")[2];
}
function getMode(context) {
    if (context.eventName === "pull_request") {
        return "report";
    }
    if (context.eventName === "push" && getBranch(context) === "master") {
        return "store";
    }
}
async function main() {
    const inputs = loadInputs();
    const loader = new istanbul_loader_1.IstanbulLoader(inputs.COVERAGE_DIR);
    const repository = new cache_repository_1.CacheRepository();
    const reporter = new markdown_reporter_1.MarkdownReporter();
    const client = new github_1.GitHub(inputs.GITHUB_TOKEN);
    const reportUsecase = new report_usecase_1.ReportUsecase(loader, reporter, repository, client);
    const storeUsecase = new store_usecase_1.StoreUsecase(loader, repository);
    const currentBranch = getBranch(github_1.context);
    const mode = getMode(github_1.context);
    switch (mode) {
        case "store":
            await storeUsecase.storeCoverage(inputs.TARGET);
            break;
        case "report":
            await reportUsecase.report(inputs.TARGET, currentBranch);
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
