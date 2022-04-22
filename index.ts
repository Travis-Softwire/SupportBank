import Bank from "./Bank";
import CSVTransactionParser from "./CSVTransactionParser";
import JSONTransactionParser from "./JSONTransactionParser";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
import log4js from "log4js";
const readlineSync = require('readline-sync');
const validCmds = ["list"];

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log'}
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

main();

async function main(): Promise<void>
{
    const fileName = process.argv.slice(2)[0];
    const bank: Bank = new Bank();
    const parser = SelectTransactionParser(fileName);

    const transactionData = await parser.ParseTransactions();
    transactionData.forEach((transaction: Transaction) => bank.processTransaction(transaction));

    let command: string[] = readlineSync.question("Please enter a command, or 'help' for options: ").split(' ');
    while (command.length === 0 || validCmds.indexOf(command[0].toLowerCase()) === -1) {
        if (command.length > 0 && command[0].toLowerCase() === "help") {
            command = readlineSync.question("Valid commands are 'List All' to list accounts, or 'List [Account name]' to list transactions for that account: ").split(' ');
        } else {
            command = readlineSync.question("Please enter a valid command, or 'help' for options: ").split(' ');
        }
    }

    const commandArg: string = command.slice(1).join(' ');
    if (commandArg.toLowerCase() === "all") {
        bank.printAccounts();
    } else {
        bank.printTransactions(commandArg);
    }
}

function SelectTransactionParser(fileName: string): TransactionParser {
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    switch (ext) {
        case '.csv':
            return new CSVTransactionParser(fileName);
        case '.json':
            return new JSONTransactionParser(fileName);
        default:
            throw new Error(`No parser found for file extension ${ext}`);
    }
}

