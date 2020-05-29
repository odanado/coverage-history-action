"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownReporter = exports.tableMaker = void 0;
function tableMaker(strings, ...placeholders) {
    return (values) => {
        return (strings[0] +
            placeholders
                .map((placeholder, i) => {
                return `${values[placeholder]}${strings[i + 1]}`;
            })
                .join("")
                .trim());
    };
}
exports.tableMaker = tableMaker;
class MarkdownReporter {
    format(coverage) {
        return (coverage * 100).toFixed(2);
    }
    report(target, current) {
        const makeTable = tableMaker `
|  | ${"target"} | ${"current"} |
| - | -: | -: |
|  statement  | ${"targetStatement"} | ${"currentStatement"} |
|  branch  | ${"targetBranch"} | ${"currentBranch"} |
|  function  | ${"targetFunction"} | ${"currentFunction"} |
`;
        const table = makeTable({
            target: target.branch,
            current: current.branch,
            targetStatement: `${this.format(target.coverage.statement.total)} %`,
            currentStatement: `${this.format(current.coverage.statement.total)} %`,
            targetBranch: `${this.format(target.coverage.branch.total)} %`,
            currentBranch: `${this.format(current.coverage.branch.total)} %`,
            targetFunction: `${this.format(target.coverage.function.total)} %`,
            currentFunction: `${this.format(current.coverage.function.total)} %`,
        });
        const body = `
  ## coverage-history-action
  ${table}
  `.trim();
        return Promise.resolve(body);
    }
}
exports.MarkdownReporter = MarkdownReporter;
