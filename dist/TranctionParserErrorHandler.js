"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
class TranctionParserErrorHandler {
    constructor(category) {
        this.errorMessages = [];
        this.logger = log4js_1.default.getLogger(category);
    }
    LogAndStoreError(errorMessage, lineNumber = -1) {
        let messageToLogAndStore = errorMessage;
        if (lineNumber > 0) {
            messageToLogAndStore = `Error on line: ${lineNumber}: ${errorMessage}. This transaction has not been processed.`;
        }
        this.errorMessages.push(messageToLogAndStore);
        this.logger.debug(messageToLogAndStore);
    }
    hasErrors() {
        return this.errorMessages.length > 0;
    }
    getErrorMessages() {
        return this.errorMessages;
    }
}
exports.default = TranctionParserErrorHandler;
//# sourceMappingURL=TranctionParserErrorHandler.js.map