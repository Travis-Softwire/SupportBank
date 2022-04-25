import moment, {Moment} from "moment";
import Transaction from "./Transaction";
import TransactionParser from "./TransactionParser";
const fs = require('fs');


export default class JSONTransactionParser extends TransactionParser {

    async ParseTransactionsFromFile(fileName: string): Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve) => {
            let transactions: Transaction[] = [];
            let lineCount: number = 1;
            let transactionObjects: any[] = []
            try {
                transactionObjects = JSON.parse(fs.readFileSync(fileName));
            } catch (e: any) {
                this.errorHandler.LogAndStoreError(`Error parsing JSON file: ${e.message}`);
            }
            transactionObjects.forEach((record => {
                try {
                    transactions.push(this.ParseTransaction(record));
                } catch (e: any) {
                    this.errorHandler.LogAndStoreError(e.message, lineCount);
                }
                lineCount++;
            }));
            resolve(transactions);
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