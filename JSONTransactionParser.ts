import moment, {Moment} from "moment";
import Transaction from "./Transaction";
import TransactionParser from "./TransactionParser";
import log4js from "log4js";
import {throws} from "assert";
const fs = require('fs');
const logger = log4js.getLogger('JSONTransactionParser');

export default class JSONTransactionParser implements TransactionParser {
    readonly fileName: string;

    constructor(_filename: string) {
        this.fileName = _filename;
    }

    async ParseTransactions(): Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve) => {
            let transactions: Transaction[] = [];
            let lineCount: number = 1;
            let parseErrors: string[] = [];
            let transactionObjects: any[] = []
            try {
                transactionObjects = JSON.parse(fs.readFileSync(this.fileName));
            } catch (e: any) {
                console.log("Error parsing JSON file");
                console.log(e.message);
            }
            transactionObjects.forEach((record => {
                try {
                    transactions.push(this.ParseTransaction(record));
                } catch (e: any) {
                    const errMsg = `Error on line ${lineCount}: ${e.message}`;
                    logger.debug(errMsg);
                    parseErrors.push(errMsg);
                }
                lineCount++;
            }));
            resolve(transactions);
            if (parseErrors.length > 0) {
                throw new Error(
                    `The following errors were encountered in the CSV file: 
                    ${parseErrors.join('\n')}
                    These transactions have not been processed.\n`
                );
            }
        });
    }

    ParseTransaction(record: any): Transaction {
        const parsedDate: Moment = moment(record.Date, moment.ISO_8601);
        if (!parsedDate.isValid()){
            throw new Error("Invalid date");
        }
        const parsedAmount: number = Number(record.Amount);
        if (isNaN(parsedAmount)) {
            throw new Error("Amount is not a number");
        }
        return new Transaction(
            parsedDate,
            record.FromAccount,
            record.ToAccount,
            record.Narrative,
            parsedAmount
        );
    }
}