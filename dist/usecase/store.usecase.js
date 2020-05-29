"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreUsecase = void 0;
class StoreUsecase {
    constructor(loader, repository) {
        this.loader = loader;
        this.repository = repository;
    }
    async storeCoverage(branch) {
        const coverage = await this.loader.load();
        await this.repository.saveCoverage(branch, coverage);
    }
}
exports.StoreUsecase = StoreUsecase;
