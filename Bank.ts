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
        this.accounts.forEach((acc) => console.log(acc.toString()));
    }

    printTransactions(acc: string): void {
        this.transactions
            .filter((transaction) => transaction.to === acc || transaction.from === acc)
            .forEach((transaction) => console.log(transaction.toString()));
    }
}