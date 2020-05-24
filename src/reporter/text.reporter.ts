import { average } from "../utils/average";

import { Reporter } from "./index";
import { Coverage } from "../type";

export class TextReporter implements Reporter {
  // TODO: 別ファイル？
  calcStatementCoverage(coverage: Coverage): number {
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

    const summary = Object.fromEntries(
      paths.map((path, i) => {
        return [path, sumList[i][0] / sumList[i][1]];
      })
    );

    const total = sumList.reduce(
      (prev, cur) => {
        return [prev[0] + cur[0], prev[1] + cur[1]];
      },
      [0, 0]
    );

    return total[0] / total[1];
  }
  report(targetCoverage: Coverage, currentCoverage: Coverage): Promise<string> {
    const targetStatementCoverage = this.calcStatementCoverage(targetCoverage);
    const currentStatementCoverage = this.calcStatementCoverage(
      currentCoverage
    );
    return Promise.resolve(
      `target: ${targetStatementCoverage}\tcurrent: ${currentStatementCoverage}`
    );
  }
}
