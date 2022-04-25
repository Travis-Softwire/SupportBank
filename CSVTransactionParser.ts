import moment, {Moment} from "moment";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
import CSVTransactionParserErrorHandler from "./CSVTransactionParserErrorHandler";
const csv = require('csv-parser');
const fs = require('fs');


export default class CSVTransactionParser extends TransactionParser {

    constructor() {
        super();
        this.errorHandler = new CSVTransactionParserErrorHandler(`ParsingError`);
    }

    async ParseTransactionsFromFile(fileName: string): Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve) => {
            let transactions: Transaction[] = [];
            let lineCount: number = 2; // Header isn't processed by 'data' event
            fs.createReadStream(fileName)
                .pipe(csv())
                .on('data', (row: any) => {
                    try {
                        transactions.push(this.ParseTransaction(row));
                    } catch (e: any) {
                        this.errorHandler.LogAndStoreError(e.message, lineCount);
                    }
                    lineCount++;
                })
                .on('error', (e: Error) => {
                    this.errorHandler.LogAndStoreError(e.message, lineCount);
                    lineCount++;
                })
                .on('end', () => {
                    resolve(transactions);
                });
        });
    }

    ParseTransaction(row: any): Transaction {
        const parsedDate: Moment = moment(row.Date, "D/M/YYYY");
        if (!parsedDate.isValid()){
            throw new Error("Invalid date");
        }
        const parsedAmount: number = Number(row.Amount);
        if (isNaN(parsedAmount)) {
            throw new Error("Amount is not a number");
        }
        return new Transaction(
            parsedDate,
            row.From,
            row.To,
            row.Narrative,
            parsedAmount
        );
    }
}