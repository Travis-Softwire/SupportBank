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
const log4js_1 = __importDefault(require("log4js"));
const fs = require('fs');
const logger = log4js_1.default.getLogger('CSVTransactionParser');
class JSONTransactionParser {
    constructor(_filename) {
        this.fileName = _filename;
    }
    ParseTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let transactions = [];
                let lineCount = 1;
                let parseErrors = [];
                let transactionObjects = [];
                try {
                    transactionObjects = JSON.parse(fs.readFileSync(this.fileName));
                }
                catch (e) {
                    console.log("Error parsing JSON file");
                    console.log(e.message);
                }
                transactionObjects.forEach((record => {
                    try {
                        transactions.push(this.ParseTransaction(record));
                    }
                    catch (e) {
                        const errMsg = `Error on line ${lineCount}: ${e.message}`;
                        logger.debug(errMsg);
                        parseErrors.push(errMsg);
                    }
                    lineCount++;
                }));
                resolve(transactions);
                if (parseErrors.length > 0) {
                    console.log(`The following errors were encountered in the CSV file: \n${parseErrors.join('\n')}\n`);
                    console.log("These transactions have not been processed.\n");
                }
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