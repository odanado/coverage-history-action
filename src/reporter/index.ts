import { BranchCoverage } from "../type";

export interface Reporter {
  report(target: BranchCoverage, current: BranchCoverage): Promise<string>;
}
