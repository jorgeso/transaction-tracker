interface ITransaction {
    transactionId: string;
    allowance: number;
    type: string;
    value: number;
    dateTimeUtc: string;
}

export class Transaction {
    transactionId: string;
    allowance: number;
    type: string;
    value: number;
    dateTimeUtc: string;
    dateTimeLocalJs?: Date;

    constructor(transaction?: ITransaction){
        if (transaction != null) {
            this.transactionId = transaction.transactionId;
            this.allowance = transaction.allowance;
            this.type = transaction.type;
            this.value = transaction.value;
            this.dateTimeUtc = transaction.dateTimeUtc;
            this.dateTimeLocalJs = transaction.dateTimeUtc ? new Date(transaction.dateTimeUtc) : null;
        }
    }
}