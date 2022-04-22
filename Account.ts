export default class Account {
    readonly owner: string;
    private balance: number;

    constructor(_owner: string, _initialBalance: number = 0) {
        this.owner = _owner;
        this.balance = _initialBalance;
    }

    depositAmount(amount: number): void {
        this.balance += amount;
    }

    withdrawAmount(amount: number): void {
        this.balance -= amount;
    }

    toString(): string {
        return `Account holder: ${this.owner}  Balance: £${this.balance.toFixed(2)}`
    }
}