import moment, {Moment} from "moment";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
const xml2js = require('xml2js');
const fs = require('fs');

export default class XMLTransactionParser extends TransactionParser {

    async ParseTransactionsFromFile(fileName: string): Promise<Transaction[]> {
         return new Promise<Transaction[]>(async (resolve) => {
             let transactions: Transaction[] = [];
             let lineCount: number = 1;
             let parser = new xml2js.Parser();
             parser.parseString(fs.readFileSync(fileName), (err: Error | null, results: any) => {
                 if (err) {
                     this.errorHandler.LogAndStoreError(`Error parsing XML file: `)
                 } else {
                     let records = results.TransactionList.SupportTransaction;
                     for (const record in records) {
                         try {
                             transactions.push(this.ParseTransaction(records[record]));
                         } catch (e: any) {
                             this.errorHandler.LogAndStoreError(e.message, lineCount);
                         }
                         lineCount++;
                     }
                     resolve(transactions);
                 }
             });
         });
    }

    ParseTransaction(record: any): Transaction {
        const unixEpochMoment: Moment = moment.unix(0);
        const nineteenhundredMoment: Moment = moment("01-01-1900", "D-M-YYYY");
        const secondsBetween1900And1970: number = moment.duration(unixEpochMoment.diff(nineteenhundredMoment)).asSeconds();
        const parsedDate: Moment = moment.unix(record.$.Date - secondsBetween1900And1970);
        if (!parsedDate.isValid()){
            throw new Error("Invalid date");
        }
        const parsedAmount: number = Number(record.Value[0]);
        if (isNaN(parsedAmount)) {
            throw new Error("Amount is not a number");
        }
        return new Transaction(
            parsedDate,
            record.Parties[0].From[0],
            record.Parties[0].To[0],
            record.Description[0],
            parsedAmount
        );
    }
}