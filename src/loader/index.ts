import { CoverageResult } from "../type";

export interface Loader {
  load(): Promise<CoverageResult>;
}
