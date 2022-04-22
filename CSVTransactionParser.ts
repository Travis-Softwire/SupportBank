import moment from "moment";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
const csv = require('csv-parser');
const fs = require('fs');

export default class CSVTransactionParser implements TransactionParser {
    readonly fileName: string;

    constructor(_fileName: string) {
        this.fileName = _fileName;
    }

  async ParseTransactions(): Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve) => {
            let transactions: Transaction[] = [];
            fs.createReadStream(this.fileName)
                .pipe(csv())
                .on('data', (row: any) => transactions.push(this.ParseTransaction(row))
                )
                .on('error', (e: Error) => console.error(e.message))
                .on('end', () => {
                    resolve(transactions);
                });
        });
    }

    ParseTransaction(row: any): Transaction {
        return new Transaction(
            moment(row.Date, "D/M/YYYY"),
            row.From,
            row.To,
            row.Narrative,
            Number(row.Amount)
        );
    }
}