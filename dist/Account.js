"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Account {
    constructor(_owner, _initialBalance = 0) {
        this.owner = _owner;
        this.balance = _initialBalance;
    }
    depositAmount(amount) {
        this.balance += amount;
    }
    withdrawAmount(amount) {
        this.balance -= amount;
    }
    toString() {
        return `Account holder: ${this.owner}  Balance: £${this.balance.toFixed(2)}`;
    }
}
exports.default = Account;
//# sourceMappingURL=Account.js.map