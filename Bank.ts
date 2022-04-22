import Account from './Account';
import Transaction from "./Transaction";

export default class Bank {
    accounts: Map<string, Account> = new Map<string, Account>();
    transactions: Transaction[] = [];

    createAccount(owner: string, openingBalance: number = 0) {
        this.accounts.set(owner, new Account(owner, openingBalance));
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