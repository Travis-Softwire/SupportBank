"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Transaction {
    constructor(_date, _from, _to, _narrative, _amount) {
        this.date = _date;
        this.to = _to;
        this.from = _from;
        this.amount = _amount;
        this.narrative = _narrative;
    }
    toString() {
        return `${this.date.format("D-M-YYYY")}\tAmount: £${this.amount.toFixed(2)}\tTo: ${this.to}\tFrom: ${this.from}\tNarrative: ${this.narrative}`;
    }
}
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map