"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cache_1 = require("@actions/cache");
const logger_1 = require("../logger");
class CacheRepository {
    getDirectory() {
        return ".coverage-history";
    }
    getFileName() {
        return path_1.default.join(this.getDirectory(), "coverage-history.json");
    }
    getKey() {
        const key = ["coverage-history-action"].join(":");
        return key;
    }
    async save(branch, value, cache) {
        const directory = this.getDirectory();
        const baseKey = this.getKey();
        const fileName = this.getFileName();
        await fs_1.default.promises.mkdir(directory, { recursive: true });
        const data = JSON.stringify({ ...cache, [branch]: value });
        fs_1.default.promises.writeFile(fileName, data);
        const runId = process.env.GITHUB_RUN_ID;
        const key = `${baseKey}-${runId}`;
        cache_1.saveCache([fileName], key);
        logger_1.logger.info(`save to cache key: ${key}`);
    }
    async load(branch) {
        const key = this.getKey();
        const fileName = this.getFileName();
        const cacheHit = await cache_1.restoreCache([fileName], key, [key]);
        logger_1.logger.debug({ cacheHit });
        if (!cacheHit)
            return;
        logger_1.logger.info("cache hit");
        const value = await fs_1.default.promises.readFile(fileName, {
            encoding: "utf8",
        });
        try {
            return JSON.parse(value)[branch];
        }
        catch {
            return undefined;
        }
    }
    async saveCoverage(branch, value) {
        const cache = await this.loadCoverage(branch);
        await this.save(branch, value, cache);
    }
    async loadCoverage(branch) {
        const value = await this.load(branch).catch((e) => {
            logger_1.logger.debug(`load error: branch ${branch}. ${JSON.stringify(e)}`);
            return undefined;
        });
        if (value) {
            logger_1.logger.debug(`loaded: ${JSON.stringify(value)}`);
            return value;
        }
        return undefined;
    }
}
exports.CacheRepository = CacheRepository;
