import Transaction from "./Transaction";

export default interface TransactionParser {
    ParseTransactionsFromFile(fileName: string): Promise<Transaction[]>;
    ParseTransaction(record: any): Transaction;
}