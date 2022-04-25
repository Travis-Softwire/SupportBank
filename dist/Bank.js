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
const Account_1 = __importDefault(require("./Account"));
class Bank {
    constructor() {
        this.accounts = new Map();
        this.transactions = [];
    }
    setParser(parser) {
        this.transactionParser = parser;
    }
    setExporter(exporter) {
        this.transactionExporter = exporter;
    }
    createAccount(owner, openingBalance = 0) {
        this.accounts.set(owner, new Account_1.default(owner, openingBalance));
    }
    ImportTransactions(fileName) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            fileName = `./Transactions/${fileName}`;
            const transactionData = yield ((_a = this.transactionParser) === null || _a === void 0 ? void 0 : _a.ParseTransactionsFromFile(fileName));
            transactionData === null || transactionData === void 0 ? void 0 : transactionData.forEach((transaction) => this.processTransaction(transaction));
            if ((_b = this.transactionParser) === null || _b === void 0 ? void 0 : _b.hasErrors()) {
                throw new Error((_c = this.transactionParser) === null || _c === void 0 ? void 0 : _c.getErrorMessages().join('\n'));
            }
        });
    }
    ExportTransactions(fileName) {
        var _a;
        (_a = this.transactionExporter) === null || _a === void 0 ? void 0 : _a.ExportTransactionsToFile(this.transactions, fileName);
    }
    processTransaction(transaction) {
        var _a, _b;
        // For simplicity, assuming that the first transaction creates an account (even with an overdraft)
        let to = transaction.to;
        let from = transaction.from;
        if (!this.accounts.has(from)) {
            this.createAccount(from);
        }
        if (!this.accounts.has(to)) {
            this.createAccount(to);
        }
        (_a = this.accounts.get(from)) === null || _a === void 0 ? void 0 : _a.withdrawAmount(transaction.amount);
        (_b = this.accounts.get(to)) === null || _b === void 0 ? void 0 : _b.depositAmount(transaction.amount);
        this.transactions.push(transaction);
    }
    printAccounts() {
        if (this.accounts.size === 0) {
            console.log("No accounts found");
        }
        this.accounts.forEach((acc) => console.log(acc.toString()));
    }
    printTransactions(acc) {
        acc = acc[0] === '"' || acc[0] === "'" ? acc.substring(1) : acc;
        acc = acc[acc.length - 1] === '"' || acc[acc.length - 1] === "'" ? acc.substring(0, acc.length - 1) : acc;
        let foundTransactions = this.transactions
            .filter((transaction) => transaction.to.toLowerCase() === acc.toLowerCase() || transaction.from.toLowerCase() === acc.toLowerCase());
        if (foundTransactions.length === 0) {
            console.log(`No transactions found relating to "${acc}"`);
        }
        foundTransactions.forEach((transaction) => console.log(transaction.toString()));
    }
}
exports.default = Bank;
//# sourceMappingURL=Bank.js.map