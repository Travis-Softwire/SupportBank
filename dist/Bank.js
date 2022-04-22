"use strict";
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
    createAccount(owner, openingBalance = 0) {
        this.accounts.set(owner, new Account_1.default(owner, openingBalance));
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
        this.accounts.forEach((acc) => console.log(acc.toString()));
    }
    printTransactions(acc) {
        this.transactions
            .filter((transaction) => transaction.to === acc || transaction.from === acc)
            .forEach((transaction) => console.log(transaction.toString()));
    }
}
exports.default = Bank;
//# sourceMappingURL=Bank.js.map