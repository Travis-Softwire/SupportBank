"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bank_1 = __importDefault(require("./Bank"));
const CSVTransactionParser_1 = __importDefault(require("./CSVTransactionParser"));
const readlineSync = require('readline-sync');
const validCmds = ["list"];
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileName = process.argv.slice(2)[0]; //For Part 1
        const bank = new Bank_1.default();
        const csvParser = new CSVTransactionParser_1.default(fileName);
        const transactionData = yield csvParser.ParseTransactions();
        transactionData.forEach((transaction) => bank.processTransaction(transaction));
        let command = readlineSync.question("Please enter a command, or 'help' for options: ").split(' ');
        while (command.length === 0 || validCmds.indexOf(command[0].toLowerCase()) === -1) {
            if (command.length > 0 && command[0].toLowerCase() === "help") {
                command = readlineSync.question("Valid commands are 'List All' to list accounts, or 'List [Account name]' to list transactions for that account: ").split(' ');
            }
            else {
                command = readlineSync.question("Please enter a valid command, or 'help' for options: ").split(' ');
            }
        }
        const commandArg = command.slice(1).join(' ');
        if (commandArg.toLowerCase() === "all") {
            bank.printAccounts();
        }
        else {
            bank.printTransactions(commandArg);
        }
    });
}
//# sourceMappingURL=index.js.map