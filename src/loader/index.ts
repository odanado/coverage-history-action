import { CoverageSet } from "../type";

export interface Loader {
  load(): Promise<CoverageSet>;
}
