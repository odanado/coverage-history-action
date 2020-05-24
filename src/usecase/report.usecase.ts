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
    const targetCoverage = await this.repository.loadCoverage(targetBranch);
    const currentCoverage = await this.repository.loadCoverage(currentBranch);

    if (!targetCoverage) return;
    if (!currentCoverage) return;

    const report = await this.reporter.report(targetCoverage, currentCoverage);

    const commitCommentParams = {
      owner: context.repo.owner,
      repo: context.repo.repo,
      // eslint-disable-next-line @typescript-eslint/camelcase
      commit_sha: context.sha,
      body: report,
    };
    await this.client.repos.createCommitComment(commitCommentParams);
  }
}
