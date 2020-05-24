import { Coverage } from "../type";

export interface Reporter {
  report(targetCoverage: Coverage, currentCoverage: Coverage): Promise<string>;
}
