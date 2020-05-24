import { context, GitHub } from "@actions/github";
import { Repository } from "../repository";
import { Reporter } from "../reporter";
import { Loader } from "../loader";

export class ReportUsecase {
  private readonly loader: Loader;
  private readonly reporter: Reporter;
  private readonly repository: Repository;
  private readonly client: GitHub;
  constructor(
    loader: Loader,
    reporter: Reporter,
    repository: Repository,
    client: GitHub
  ) {
    this.loader = loader;
    this.reporter = reporter;
    this.repository = repository;
    this.client = client;
  }

  async report(targetBranch: string): Promise<void> {
    console.log("report", { targetBranch });
    const targetCoverage = await this.repository.loadCoverage(targetBranch);
    const currentCoverage = await this.loader.load();

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
