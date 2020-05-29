"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
const core = __importStar(require("@actions/core"));
class Logger {
    buildMessage(message) {
        if (message == null) {
            return "";
        }
        if (typeof message === "object") {
            return JSON.stringify(message);
        }
        return `${message}`;
    }
    build(message, ...optionalParams) {
        return [
            this.buildMessage(message),
            ...optionalParams.map((param) => this.buildMessage(param)),
        ].join(" ");
    }
    debug(message, ...optionalParams) {
        core.debug(this.build(message, ...optionalParams));
    }
    error(message, ...optionalParams) {
        core.error(this.build(message, ...optionalParams));
    }
    warning(message, ...optionalParams) {
        core.warning(this.build(message, ...optionalParams));
    }
    info(message, ...optionalParams) {
        core.info(this.build(message, ...optionalParams));
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
