import moment, {Moment} from "moment";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
import log4js from "log4js";
const csv = require('csv-parser');
const fs = require('fs');
const logger = log4js.getLogger('CSVTransactionParser');

export default class CSVTransactionParser implements TransactionParser {
    readonly fileName: string;

    constructor(_fileName: string) {
        this.fileName = _fileName;
    }

  async ParseTransactions(): Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve) => {
            let transactions: Transaction[] = [];
            let lineCount: number = 2; // Header isn't processed by 'data' event
            let parseErrors: string[] = [];
            fs.createReadStream(this.fileName)
                .pipe(csv())
                .on('data', (row: any) => {
                    try {
                        transactions.push(this.ParseTransaction(row));
                    } catch (e: any) {
                        const errMsg = `Error on line ${lineCount}: ${e.message}`;
                        logger.debug(errMsg);
                        parseErrors.push(errMsg);
                    }
                    lineCount++;
                })
                .on('error', (e: Error) => {
                    logger.debug(`Error on line ${lineCount}: ${e.message}`);
                    lineCount++;
                })
                .on('end', () => {
                    resolve(transactions);
                    if (parseErrors.length > 0) {
                        console.log(`The following errors were encountered in the CSV file: \n${parseErrors.join('\n')}\n`);
                        console.log("These transactions have not been processed.\n");
                    }
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