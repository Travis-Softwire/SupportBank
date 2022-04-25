"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Transaction_1 = __importDefault(require("./Transaction"));
const TransactionParser_1 = __importDefault(require("./TransactionParser"));
const fs = require('fs');
class JSONTransactionParser extends TransactionParser_1.default {
    ParseTransactionsFromFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let transactions = [];
                let lineCount = 1;
                let transactionObjects = [];
                try {
                    transactionObjects = JSON.parse(fs.readFileSync(fileName));
                }
                catch (e) {
                    this.errorHandler.LogAndStoreError(`Error parsing JSON file: ${e.message}`);
                }
                transactionObjects.forEach((record => {
                    try {
                        transactions.push(this.ParseTransaction(record));
                    }
                    catch (e) {
                        this.errorHandler.LogAndStoreError(e.message, lineCount);
                    }
                    lineCount++;
                }));
                resolve(transactions);
            });
        });
    }
    ParseTransaction(record) {
        const parsedDate = (0, moment_1.default)(record.Date, moment_1.default.ISO_8601);
        if (!parsedDate.isValid()) {
            throw new Error("Invalid date");
        }
        const parsedAmount = Number(record.Amount);
        if (isNaN(parsedAmount)) {
            throw new Error("Amount is not a number");
        }
        return new Transaction_1.default(parsedDate, record.FromAccount, record.ToAccount, record.Narrative, parsedAmount);
    }
}
exports.default = JSONTransactionParser;
//# sourceMappingURL=JSONTransactionParser.js.map