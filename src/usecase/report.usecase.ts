import { context, GitHub } from "@actions/github";
import { Repository } from "../repository";
import { Reporter } from "../reporter";

export class ReportUsecase {
  private readonly reporter: Reporter;
  private readonly repository: Repository;
  private readonly client: GitHub;
  constructor(reporter: Reporter, repository: Repository, client: GitHub) {
    this.reporter = reporter;
    this.repository = repository;
    this.client = client;
  }

  async report(targetBranch: string, currentBranch: string): Promise<void> {
    console.log("report", { targetBranch, currentBranch });
    const targetCoverage = await this.repository.loadCoverage(targetBranch);
    const currentCoverage = await this.repository.loadCoverage(currentBranch);

    console.log({ targetCoverage });
    console.log({ currentCoverage });

    if (!targetCoverage) return;
    if (!currentCoverage) return;

    const report = await this.reporter.report(targetCoverage, currentCoverage);

    await this.client.issues.createComment({
      // eslint-disable-next-line @typescript-eslint/camelcase
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: report,
    });
  }
}
