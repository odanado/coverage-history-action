"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = void 0;
function sum(x) {
    return x.reduce((prev, cur) => prev + cur, 0);
}
exports.sum = sum;
