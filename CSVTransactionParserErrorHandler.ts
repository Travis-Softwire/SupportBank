import TranctionParserErrorHandler from "./TranctionParserErrorHandler";

export default class CSVTransactionParserErrorHandler extends TranctionParserErrorHandler {

    public LogAndStoreError(errorMessage: string, lineNumber: number = -1) {
        if (lineNumber > 0) {
            super.LogAndStoreError(errorMessage, lineNumber + 1);
        } else {
            super.LogAndStoreError(errorMessage, lineNumber);
        }
    }
}

