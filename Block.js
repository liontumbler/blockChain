const SHA256 = require('crypto-js/sha256');
const DIFFICULTY = 3;
const MINE_RATE = 3000;
const TOTALSUPPLY = 1000000;
console.log('0x' + Math.floor(Math.random() * 0xFFFFFFFFFFFFFF).toString(16))

module.exports = class Block {
    constructor(timestamp, data, nonce, difficulty, hash, previousHash = undefined) {
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.hash = hash;
        this.previousHash = previousHash;
        // this.totalSupply = TOTALSUPPLY;
    }

    static GenesisBlock() {
        const time = new Date('01/01/2023').getTime();
        return new this(time, 'Genesis Block', 0, DIFFICULTY, 'genesis_hash');
    }

    toString() {
        const {timestamp, data, nonce, difficulty, hash, previousHash} = this;

        return `Block -
        Timestamp: ${timestamp}
        Data: ${data}
        Nonce: ${nonce}
        Difficulty: ${difficulty}
        Hash: ${hash}
        PreviousHash: ${previousHash}
        `
    }

    static calculateHash(timestamp, data, nonce, difficulty, previousHash) {
        return SHA256(
            timestamp +
            JSON.stringify(data) +
            nonce +
            difficulty +
            previousHash
        ).toString();
    }

    calculateHashObj() {
        return SHA256(
            this.timestamp +
            JSON.stringify(this.data) +
            this.nonce +
            this.difficulty +
            this.previousHash
        ).toString();
    }

    static mineBlock(blockAnterior, data) {
        let time;
        let nonce = 0;
        let difficulty = blockAnterior.difficulty;
        let hash;
        const previousHash = blockAnterior.hash;
        
        do {
            time = Date.now();
            nonce++;
            difficulty = blockAnterior.timestamp + MINE_RATE > time ? difficulty +1 : difficulty -1
            hash = Block.calculateHash(time, data, nonce, difficulty, previousHash);
        } while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0"));

        return new this(time, data, nonce, difficulty, hash, previousHash);
    }
}