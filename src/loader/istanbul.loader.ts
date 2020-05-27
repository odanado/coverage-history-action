import path from "path";
import fs from "fs";
import { Loader } from "./index";
import { Coverage, CoverageSet } from "../type";
export interface Position {
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
}

export interface StatementMap {
  [index: string]: Location;
}

export interface FnMap {
  [index: string]: {
    name: string;
    decl: Location;
    loc: Location;
  };
}

export interface BranchMap {
  [inedx: string]: {
    loc: Location;
    type: string;
    locations: Location[];
  };
}

export interface IstanbulCoverage {
  [path: string]: {
    path: string;
    statementMap: StatementMap;
    fnMap: FnMap;
    branchMap: BranchMap;
    s: {
      [index: string]: number;
    };
    f: {
      [index: string]: number;
    };
    b: {
      [index: string]: [number, number];
    };
  };
}

export class IstanbulLoader implements Loader {
  private coverageDir: string;
  constructor(coverageDir: string) {
    this.coverageDir = coverageDir;
  }

  private calcFileCoverage(
    fileCoverage:
      | IstanbulCoverage[string]["s"]
      | IstanbulCoverage[string]["b"]
      | IstanbulCoverage[string]["f"]
  ): number {
    const indexes = Object.keys(fileCoverage);
    const flatCoverage = indexes.reduce<number[]>((prev, cur) => {
      return prev.concat(fileCoverage[cur]);
    }, []);

    if (flatCoverage.length === 0) return 0;
    return flatCoverage.filter((x) => x > 0).length / flatCoverage.length;
  }

  private calcTotalCoverage(
    coverage: IstanbulCoverage,
    key: "s" | "b" | "f"
  ): number {
    const paths = Object.keys(coverage);
    const total = paths
      .map((path) => {
        return Object.values(coverage[path][key]);
      })
      .flat(2);

    //if (total.length == 0) return 0;
    return total.filter((x) => x > 0).length / total.length;
  }

  private calcCoverage(
    coverage: IstanbulCoverage,
    key: "s" | "b" | "f"
  ): Coverage {
    const paths = Object.keys(coverage);

    const summary = paths.map((path) => {
      return { path, value: this.calcFileCoverage(coverage[path][key]) };
    });

    const total = this.calcTotalCoverage(coverage, key);
    return {
      total,
      paths: summary,
    };
  }

  async load(): Promise<CoverageSet> {
    const file = path.join(this.coverageDir, "coverage-final.json");
    const data = await fs.promises.readFile(file, { encoding: "utf8" });
    const coverage: IstanbulCoverage = JSON.parse(data);

    const statementCoverage = this.calcCoverage(coverage, "s");
    const branchCoverage = this.calcCoverage(coverage, "b");
    const functionCoverage = this.calcCoverage(coverage, "f");

    return {
      statement: statementCoverage,
      branch: branchCoverage,
      function: functionCoverage,
    };
  }
}
