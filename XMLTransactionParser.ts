import moment, {Moment} from "moment";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
import log4js from "log4js";
const xml2js = require('xml2js');
const fs = require('fs');
const logger = log4js.getLogger('XMLTransactionParser');

export default class XMLTransactionParser implements TransactionParser {

    async ParseTransactionsFromFile(fileName: string): Promise<Transaction[]> {
         return new Promise<Transaction[]>(async (resolve) => {
             let transactions: Transaction[] = [];
             let lineCount: number = 1;
             let parseErrors: string[] = [];
             let parser = new xml2js.Parser();
             parser.parseString(fs.readFileSync(fileName), (err: any, results: any) => {
                 if (err) {
                     logger.debug(err.message);
                     throw new Error(`Error parsing file: ${err.message}`);
                 } else {
                     let records = results.TransactionList.SupportTransaction;
                     for (const record in records) {
                         try {
                             transactions.push(this.ParseTransaction(records[record]));
                         } catch (e: any) {
                             const errMsg = `Error on line ${lineCount}: ${e.message}`;
                             logger.debug(errMsg);
                             parseErrors.push(errMsg);
                         }
                         lineCount++;
                     }
                     resolve(transactions);
                     if (parseErrors.length > 0) {
                         console.log(
                             `The following errors were encountered in the XML file:\n${parseErrors.join('\n')}\nThese transactions have not been processed.\n`
                         );
                     }
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