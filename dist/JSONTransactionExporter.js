"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
class JSONTransactionExporter {
    ExportTransactionsToFile(transactions, fileName) {
        let jsonObjs = [];
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
        fs.writeFileSync(fileName, JSON.stringify(jsonObjs));
    }
}
exports.default = JSONTransactionExporter;
//# sourceMappingURL=JSONTransactionExporter.js.map