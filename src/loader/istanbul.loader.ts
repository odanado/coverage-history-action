import path from "path";
import fs from "fs";
import { Loader } from "./index";
import { Coverage, CoverageResult } from "../type";
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

  // TODO: 別ファイル？
  calcStatementCoverage(coverage: IstanbulCoverage): Coverage {
    const paths = Object.keys(coverage);
    const sumList = paths.map((path) => {
      return Object.values(coverage[path].s).reduce(
        (prev, cur) => {
          if (cur > 0) {
            return [prev[0] + 1, prev[1] + 1];
          }
          return [prev[0], prev[1] + 1];
        },
        [0, 0]
      );
    });

    const summary = paths.map((path, i) => {
      return { path, value: sumList[i][0] / sumList[i][1] };
    });

    const total = sumList.reduce(
      (prev, cur) => {
        return [prev[0] + cur[0], prev[1] + cur[1]];
      },
      [0, 0]
    );

    return {
      total: total[0] / total[1],
      paths: summary,
    };
  }
  async load(): Promise<CoverageResult> {
    const file = path.join(this.coverageDir, "coverage-final.json");
    const data = await fs.promises.readFile(file, { encoding: "utf8" });
    const coverage: IstanbulCoverage = JSON.parse(data);

    const statementCoverage = this.calcStatementCoverage(coverage);

    return {
      statement: statementCoverage,
    };
  }
}
