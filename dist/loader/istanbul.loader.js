"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IstanbulLoader = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class IstanbulLoader {
    constructor(coverageDir) {
        this.coverageDir = coverageDir;
    }
    calcFileCoverage(fileCoverage) {
        const indexes = Object.keys(fileCoverage);
        const flatCoverage = indexes.reduce((prev, cur) => {
            return prev.concat(fileCoverage[cur]);
        }, []);
        if (flatCoverage.length === 0)
            return 0;
        return flatCoverage.filter((x) => x > 0).length / flatCoverage.length;
    }
    calcTotalCoverage(coverage, key) {
        const paths = Object.keys(coverage);
        const total = paths
            .map((path) => {
            return Object.values(coverage[path][key]);
        })
            .flat(2);
        //if (total.length == 0) return 0;
        return total.filter((x) => x > 0).length / total.length;
    }
    calcCoverage(coverage, key) {
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
    async load() {
        const file = path_1.default.join(this.coverageDir, "coverage-final.json");
        const data = await fs_1.default.promises.readFile(file, { encoding: "utf8" });
        const coverage = JSON.parse(data);
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
exports.IstanbulLoader = IstanbulLoader;
