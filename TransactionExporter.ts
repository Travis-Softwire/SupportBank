import Transaction from "./Transaction";

export default interface TransactionExporter {
    ExportTransactionsToFile(transactions: Transaction[], fileName: string): void;
}