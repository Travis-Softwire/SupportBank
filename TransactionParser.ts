import Transaction from "./Transaction";

export default interface TransactionParser {
    readonly fileName: string;
    ParseTransactions(): Promise<Transaction[]>;
}