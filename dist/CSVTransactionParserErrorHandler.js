"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TranctionParserErrorHandler_1 = __importDefault(require("./TranctionParserErrorHandler"));
class CSVTransactionParserErrorHandler extends TranctionParserErrorHandler_1.default {
    LogAndStoreError(errorMessage, lineNumber = -1) {
        if (lineNumber > 0) {
            super.LogAndStoreError(errorMessage, lineNumber + 1);
        }
        else {
            super.LogAndStoreError(errorMessage, lineNumber);
        }
    }
}
exports.default = CSVTransactionParserErrorHandler;
//# sourceMappingURL=CSVTransactionParserErrorHandler.js.map