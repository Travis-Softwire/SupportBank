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
const log4js_1 = __importDefault(require("log4js"));
const CSVTransactionParser_1 = __importDefault(require("./CSVTransactionParser"));
const JSONTransactionParser_1 = __importDefault(require("./JSONTransactionParser"));
const XMLTransactionParser_1 = __importDefault(require("./XMLTransactionParser"));
const JSONTransactionExporter_1 = __importDefault(require("./JSONTransactionExporter"));
const readlineSync = require('readline-sync');
const validCmds = ["list", "import", "help", "export", "quit"];
log4js_1.default.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug' }
    }
});
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const bank = new Bank_1.default();
        let command = [];
        while (command.length === 0 || command[0].toLowerCase() !== 'quit') {
            command = readlineSync.question("Please enter a command, or 'help' for options: ").split(' ');
            if (!commandIsValid(command)) {
                console.log("Invalid command\n");
            }
            else if (command[0].toLowerCase() === 'list') {
                const commandArg = command.slice(1).join(' ').toLowerCase();
                if (commandArg === 'all') {
                    bank.printAccounts();
                }
                else {
                    bank.printTransactions(commandArg);
                }
            }
            else if (command[0].toLowerCase() === 'help') {
                console.log(`Valid commands are:
    'List All' to list accounts,
    'List [Account name]' to list transactions for that account,
    'Import File [filename]' to import transactions from that file,
    'Quit' to quit.`);
            }
            else if (command[0].toLowerCase() === 'import') {
                try {
                    const fileName = command[2];
                    bank.setParser(SelectTransactionParser(fileName));
                    yield bank.ImportTransactions(fileName);
                    console.log("Data imported successfully.");
                }
                catch (e) {
                    console.log(e.message);
                }
            }
            else if (command[0].toLowerCase() === 'export') {
                try {
                    const fileName = command[2];
                    bank.setExporter(SelectTransactionExporter(fileName));
                    bank.ExportTransactions(fileName);
                    console.log(`Data successfully exported to ./TransactionExports/${fileName}`);
                }
                catch (e) {
                    console.log(e.message);
                }
            }
        }
        console.log("Goodbye!");
    });
}
function commandIsValid(command) {
    return !(command.length === 0
        || validCmds.indexOf(command[0].toLowerCase()) === -1
        || ((command[0].toLowerCase() === "import" || command[0].toLowerCase() === "export")
            && (command.length < 3 || command[1].toLowerCase() !== 'file'))
        || (command[0].toLowerCase() === "list" && command.length < 2));
}
function SelectTransactionParser(fileName) {
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    switch (ext) {
        case '.csv':
            return new CSVTransactionParser_1.default();
        case '.json':
            return new JSONTransactionParser_1.default();
        case '.xml':
            return new XMLTransactionParser_1.default();
        default:
            throw new Error(`No parser found for file extension ${ext}`);
    }
}
function SelectTransactionExporter(fileName) {
    const ext = fileName.substring(fileName.lastIndexOf('.'));
    switch (ext) {
        case '.json':
            return new JSONTransactionExporter_1.default();
        default:
            throw new Error(`No exporter found for file extension ${ext}`);
    }
}
//# sourceMappingURL=index.js.map