import { Transaction } from "../transaction/transaction.model";
 
interface IAccount {
    accountId: string;
    name: string;
    members?: any;
    transactionTypes?: Array<string>;
    lastTransaction?: Transaction;
    allowance?: number;
}

export class Account {
    accountId: string;
    name: string;
    members?: any;
    transactionTypes?: Array<string>;
    lastTransaction?: Transaction;
    allowance?: number

    constructor(account?: IAccount){
        if (account != null) {
            this.accountId = account.accountId
            this.name = account.name;
            this.members = account.members || {};
            this.transactionTypes = account.transactionTypes || [];
            this.lastTransaction = new Transaction(account.lastTransaction);
            this.allowance = account.allowance;
        }
    }
}