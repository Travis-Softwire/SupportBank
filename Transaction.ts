import { Moment } from "moment";

export default class Transaction {
    readonly date: Moment;
    readonly to: string;
    readonly from: string;
    readonly amount: number;
    readonly narrative: string;
    constructor(_date: Moment, _from: string, _to: string,  _narrative: string, _amount: number) {
        this.date = _date;
        this.to = _to;
        this.from = _from;
        this.amount = _amount;
        this.narrative = _narrative;
    }

    toString(): string {
        return `${this.date.format("D-M-YYYY")}\tAmount: £${this.amount.toFixed(2)}\tTo: ${this.to}\tFrom: ${this.from}\tNarrative: ${this.narrative}`;
    }
}