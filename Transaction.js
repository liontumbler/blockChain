module.exports = class Transaction {
    constructor(from, to, amount, transactionType = 'Transfer') {//Mint
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.transactionType = transactionType;
        this.timestamp = Date.now();
    }
}

