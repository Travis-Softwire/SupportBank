import Bank from "./Bank";
import CSVTransactionParser from "./CSVTransactionParser";
import TransactionParser from "./TransactionParser";
import Transaction from "./Transaction";

main();

async function main(): Promise<void>
{
    const fileName = "./Transactions/Transactions2014.csv"; //For Part 1
    const bank: Bank = new Bank();
    const csvParser: CSVTransactionParser = new CSVTransactionParser(fileName);
    const transactionData = await csvParser.ParseTransactions();
    transactionData.forEach((transaction: Transaction) => bank.processTransaction(transaction));
    bank.printAccounts();
    bank.printTransactions("Jon A");
}

