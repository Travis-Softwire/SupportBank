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
const xml2js = require('xml2js');
const fs = require('fs');
const logger = log4js_1.default.getLogger('XMLTransactionParser');
class XMLTransactionParser {
    ParseTransactionsFromFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let transactions = [];
                let lineCount = 1;
                let parseErrors = [];
                let parser = new xml2js.Parser();
                parser.parseString(fs.readFileSync(fileName), (err, results) => {
                    if (err) {
                        logger.debug(err.message);
                        throw new Error(`Error parsing file: ${err.message}`);
                    }
                    else {
                        let records = results.TransactionList.SupportTransaction;
                        for (const record in records) {
                            try {
                                transactions.push(this.ParseTransaction(records[record]));
                            }
                            catch (e) {
                                const errMsg = `Error on line ${lineCount}: ${e.message}`;
                                logger.debug(errMsg);
                                parseErrors.push(errMsg);
                            }
                            lineCount++;
                        }
                        resolve(transactions);
                        if (parseErrors.length > 0) {
                            console.log(`The following errors were encountered in the XML file:\n${parseErrors.join('\n')}\nThese transactions have not been processed.\n`);
                        }
                    }
                });
            }));
        });
    }
    ParseTransaction(record) {
        const unixEpochMoment = moment_1.default.unix(0);
        const nineteenhundredMoment = (0, moment_1.default)("01-01-1900", "D-M-YYYY");
        const secondsBetween1900And1970 = moment_1.default.duration(unixEpochMoment.diff(nineteenhundredMoment)).asSeconds();
        const parsedDate = moment_1.default.unix(record.$.Date - secondsBetween1900And1970);
        if (!parsedDate.isValid()) {
            throw new Error("Invalid date");
        }
        const parsedAmount = Number(record.Value[0]);
        if (isNaN(parsedAmount)) {
            throw new Error("Amount is not a number");
        }
        return new Transaction_1.default(parsedDate, record.Parties[0].From[0], record.Parties[0].To[0], record.Description[0], parsedAmount);
    }
}
exports.default = XMLTransactionParser;
//# sourceMappingURL=XMLTransactionParser.js.map