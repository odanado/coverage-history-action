import { Loader } from "../loader";
import { Repository } from "../repository";

export class StoreUsecase {
  private readonly loader: Loader;
  private readonly repository: Repository;
  constructor(loader: Loader, repository: Repository) {
    this.loader = loader;
    this.repository = repository;
  }

  async storeCoverage(branch: string): Promise<void> {
    const coverage = await this.loader.load();

    await this.repository.saveCoverage(branch, coverage);
  }
}
