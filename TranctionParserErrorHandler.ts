import log4js from "log4js";

export default class TranctionParserErrorHandler {
    protected errorMessages: string[] = [];
    protected readonly logger: log4js.Logger;

    constructor(category: string) {
        this.logger = log4js.getLogger(category);
    }

    public LogAndStoreError(errorMessage: string, lineNumber: number = -1): void {
        let messageToLogAndStore = errorMessage;
        if (lineNumber > 0) {
            messageToLogAndStore = `Error on line: ${lineNumber}: ${errorMessage}. This transaction has not been processed.`
        }
        this.errorMessages.push(messageToLogAndStore);
        this.logger.debug(messageToLogAndStore);
    }

    public hasErrors(): boolean {
        return this.errorMessages.length > 0;
    }

    public getErrorMessages(): string[] {
        return this.errorMessages;
    }
}