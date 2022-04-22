import TransactionExporter from "./TransactionExporter";
import Transaction from "./Transaction";
const fs = require('fs');

export default class JSONTransactionExporter implements TransactionExporter {
    ExportTransactionsToFile(transactions: Transaction[], fileName: string) {
        let jsonObjs: any[] = [];
        transactions.forEach((transaction, index) => {
            jsonObjs.push({
                'Date': transaction.date.format(),
                'FromAccount': transaction.from,
                'ToAccount': transaction.to,
                'Narrative': transaction.narrative,
                'Amount': transaction.amount
            });
        });
        fileName = `./TransactionExports/${fileName}`;
        fs.writeFileSync(fileName,JSON.stringify(jsonObjs));
    }
}