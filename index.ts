import Bank from "./Bank";
import CSVTransactionParser from "./CSVTransactionParser";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";
const readlineSync = require('readline-sync');
const validCmds = ["list"];

main();

async function main(): Promise<void>
{
    const fileName = process.argv.slice(2)[0];
    const bank: Bank = new Bank();
    const csvParser: CSVTransactionParser = new CSVTransactionParser(fileName);
    const transactionData = await csvParser.ParseTransactions();
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

