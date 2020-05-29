"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportUsecase = void 0;
const github_1 = require("@actions/github");
class ReportUsecase {
    constructor(loader, reporter, repository, client) {
        this.loader = loader;
        this.reporter = reporter;
        this.repository = repository;
        this.client = client;
    }
    async report(targetBranch, currentBranch) {
        const targetCoverage = await this.repository.loadCoverage(targetBranch);
        const currentCoverage = await this.loader.load();
        if (!targetCoverage)
            return;
        if (!currentCoverage)
            return;
        const report = await this.reporter.report({ branch: targetBranch, coverage: targetCoverage }, { branch: currentBranch, coverage: currentCoverage });
        await this.client.issues.createComment({
            // eslint-disable-next-line @typescript-eslint/camelcase
            issue_number: github_1.context.issue.number,
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            body: report,
        });
    }
}
exports.ReportUsecase = ReportUsecase;
