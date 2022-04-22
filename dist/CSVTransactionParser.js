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
const csv = require('csv-parser');
const fs = require('fs');
class CSVTransactionParser {
    constructor(_fileName) {
        this.fileName = _fileName;
    }
    ParseTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                let transactions = [];
                fs.createReadStream(this.fileName)
                    .pipe(csv())
                    .on('data', (row) => transactions.push(this.ParseTransaction(row)))
                    .on('error', (e) => console.error(e.message))
                    .on('end', () => {
                    resolve(transactions);
                });
            });
        });
    }
    ParseTransaction(row) {
        return new Transaction_1.default((0, moment_1.default)(row.Date, "D/M/YYYY"), row.From, row.To, row.Narrative, Number(row.Amount));
    }
}
exports.default = CSVTransactionParser;
//# sourceMappingURL=CSVTransactionParser.js.map