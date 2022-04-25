import Transaction from "./Transaction";
import TranctionParserErrorHandler from "./TranctionParserErrorHandler";

export default abstract class TransactionParser {
    protected errorHandler: TranctionParserErrorHandler;

    constructor() {
        this.errorHandler = new TranctionParserErrorHandler(`ParsingError`);
    }

    public hasErrors(): boolean {
        return this.errorHandler.hasErrors();
    }

    public getErrorMessages(): string[] {
        return this.errorHandler.getErrorMessages();
    }

    public abstract ParseTransactionsFromFile(fileName: string): Promise<Transaction[]>;
    protected abstract ParseTransaction(record: any): Transaction;
}