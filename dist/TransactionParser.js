"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TranctionParserErrorHandler_1 = __importDefault(require("./TranctionParserErrorHandler"));
class TransactionParser {
    constructor() {
        this.errorHandler = new TranctionParserErrorHandler_1.default(`ParsingError`);
    }
    hasErrors() {
        return this.errorHandler.hasErrors();
    }
    getErrorMessages() {
        return this.errorHandler.getErrorMessages();
    }
}
exports.default = TransactionParser;
//# sourceMappingURL=TransactionParser.js.map