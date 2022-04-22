import Bank from "./Bank";
import CSVTransactionParser from "./CSVTransactionParser";
import JSONTransactionParser from "./JSONTransactionParser";
import XMLTransactionParser from "./XMLTransactionParser";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
import log4js from "log4js";
const readlineSync = require('readline-sync');
const validCmds = ["list", "import", "help"];

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
    const bank: Bank = new Bank();
    let command: string[] = [];
    while (command.length === 0 || command[0].toLowerCase() !== 'quit') {
        command = readlineSync.question("Please enter a command, or 'help' for options: ").split(' ')
        if (!commandIsValid(command)) {
            console.log("Invalid command\n");
        } else if (command[0].toLowerCase() === 'list') {
            ListBankData(command.slice(1).join(' '), bank);
        }  else if (command[0].toLowerCase() === 'help') {
            console.log(
                `Valid commands are:
    'List All' to list accounts,
    'List [Account name]' to list transactions for that account,
    'Import File [filename]' to import transactions from that file,
    'Quit' to quit.`
            );
        } else if (command[0].toLowerCase() === 'import') {
            try {
                await ImportBankData(command[2], bank);
                console.log("Data imported successfully.");
            } catch (e: any) {
                console.log(e.message);
            }
        }
    }
    console.log("Goodbye!");
}

function commandIsValid(command: string[]): boolean {
    return !(command.length === 0
            || validCmds.indexOf(command[0].toLowerCase()) === -1
            || (command[0].toLowerCase() === "import"
                && (command.length < 3 || command[1].toLowerCase() !== 'file'))
            || (command[0].toLowerCase() === "list" && command.length < 2));
}

function SelectTransactionParser(fileName: string): TransactionParser {
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    switch (ext) {
        case '.csv':
            return new CSVTransactionParser();
        case '.json':
            return new JSONTransactionParser();
        case '.xml':
            return new XMLTransactionParser();
        default:
            throw new Error(`No parser found for file extension ${ext}`);
    }
}

function ListBankData(commandArg: string, bank: Bank): void {
    if (commandArg.toLowerCase() === "all") {
        bank.printAccounts();
    } else {
        bank.printTransactions(commandArg);
    }
}

async function ImportBankData(fileName: string, bank: Bank): Promise<void> {
    fileName = `./Transactions/${fileName}`;
    const parser = SelectTransactionParser(fileName);
    const transactionData = await parser.ParseTransactionsFromFile(fileName);
    transactionData.forEach((transaction: Transaction) => bank.processTransaction(transaction));
}

