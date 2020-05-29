"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.average = void 0;
const sum_1 = require("./sum");
function average(x) {
    return sum_1.sum(x) / x.length;
}
exports.average = average;
