import Account from './Account';
import Transaction from "./Transaction";
import TransactionParser from "./TransactionParser";
import TransactionExporter from "./TransactionExporter";

export default class Bank {
    accounts: Map<string, Account> = new Map<string, Account>();
    transactions: Transaction[] = [];
    transactionParser: TransactionParser | undefined;
    transactionExporter: TransactionExporter | undefined;

    setParser(parser: TransactionParser): void {
        this.transactionParser = parser;
    }

    setExporter(exporter: TransactionExporter): void {
        this.transactionExporter = exporter;
    }

    createAccount(owner: string, openingBalance: number = 0) {
        this.accounts.set(owner, new Account(owner, openingBalance));
    }

    async ImportTransactions(fileName: string): Promise<void> {
        fileName = `./Transactions/${fileName}`;
        const transactionData = await this.transactionParser?.ParseTransactionsFromFile(fileName);
        transactionData?.forEach((transaction: Transaction) => this.processTransaction(transaction));
        if (this.transactionParser?.hasErrors()) {
            throw new Error(this.transactionParser?.getErrorMessages().join('\n'));
        }
    }

    ExportTransactions(fileName: string): void {
        this.transactionExporter?.ExportTransactionsToFile(this.transactions, fileName);
    }

    processTransaction(transaction: Transaction): void {
        // For simplicity, assuming that the first transaction creates an account (even with an overdraft)
        let to = transaction.to;
        let from = transaction.from;
        if (!this.accounts.has(from)) {
            this.createAccount(from);
        }
        if (!this.accounts.has(to)) {
            this.createAccount(to);
        }
        this.accounts.get(from)?.withdrawAmount(transaction.amount);
        this.accounts.get(to)?.depositAmount(transaction.amount);
        this.transactions.push(transaction);
    }

    printAccounts(): void {
        if (this.accounts.size === 0) {
            console.log("No accounts found");
        }
        this.accounts.forEach((acc) => console.log(acc.toString()));
    }

    printTransactions(acc: string): void {
        acc = acc[0] === '"' || acc[0] === "'" ? acc.substring(1) : acc;
        acc = acc[acc.length - 1] === '"' || acc[acc.length - 1] === "'" ? acc.substring(0, acc.length - 1) : acc;
        let foundTransactions: Transaction[] = this.transactions
            .filter((transaction) => transaction.to.toLowerCase() === acc.toLowerCase() || transaction.from.toLowerCase() === acc.toLowerCase());
        if (foundTransactions.length === 0) {
            console.log(`No transactions found relating to "${acc}"`);
        }
        foundTransactions.forEach((transaction) => console.log(transaction.toString()));
    }
}

