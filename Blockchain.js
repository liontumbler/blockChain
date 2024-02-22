//import { Block } from "./Block";
//import { Transaction } from "./Transaction";
const Block = require('./Block');
const Transaction = require('./Transaction');

class Blockchain {
    constructor() {
        //chain caddena se puede jalar de una db
        this.chain = [Block.GenesisBlock()];
        this.pendingTransactions = [];
        this.giftForMiner = 1000;
    }

    addTransactions(Transaction) {
        if (this.getAmountTotal(Transaction.from) > 0) {
            this.pendingTransactions.push(Transaction);
        } else {
            console.log('sin saldo para transaccion ' +Transaction.from);
        }
    }

    dineroSystema(toMiner, amount) {
        const transacionRegalo = new Transaction('System', toMiner, amount, 'Mint');
        this.addBlock([transacionRegalo]);
    }

    minarPendingTransactions(toMiner) {
        if (this.pendingTransactions.length > 0) {
            this.addBlock(this.pendingTransactions);

            this.dineroSystema(toMiner, this.giftForMiner);
        } else {
            console.log('no puede minar');
        }
    }

    getUltimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    getAmountTotal(from){
        let total = 0;
        for (let i = 1; i < this.chain.length; i++) {
            for (let e = 0; e < this.chain[i].data.length; e++) {
                this.chain[i].data[e];
                
                if (this.chain[i].data[e].from == from) {
                    total = total -this.chain[i].data[e].amount
                } else if (this.chain[i].data[e].to == from) {
                    total = total +this.chain[i].data[e].amount
                }
            }
        }

        return total;
    }

    validateChain(){
        for (let i = 1; i < this.chain.length; i++) {
            const blokActual = this.chain[i];
            const blokAnterior = this.chain[i -1];

            if (blokActual.hash != blokActual.calculateHashObj()) {
                return false;
            }else if (blokActual.previousHash != blokAnterior.hash) {
                return false;
            }
        }

        return true;
    }

    addBlock(data) {
        const blockAnterior = this.getUltimoBlock();
        let newBlock = Block.mineBlock(blockAnterior, data);
        this.chain.push(newBlock);
        return newBlock;
    }
}

let fungible = {
    "token_address": "0x123456789abcdef",//La dirección del contrato inteligente que gestiona el token
    "balance": 1000,//cuanto se tiene
    "total_supply": 1000000,// cual es el total disponible
    "decimals": 18,//0.000000000000000001
    "owner": "0x987654321fedcba",
    "symbol": "TFT",
    "name": "Token Fungible",
    "created_at": 1641019200,
    "external_links": {
        "website": "https://example.com/token-fungible",
        "explorer": "https://etherscan.io/token/0x123456789abcdef"
    }
}

let semifungible = {
    "token_id": 1,
    "owner": "0x123456789abcdef",
    "metadata": {
        "name": "Token Semi-Fungible",
        "description": "Un token que puede ser dividido y negociado fraccionariamente.",
        "image_url": "https://example.com/token-image.jpg"
    },
    "total_supply": 10000,  // Suministro total del token
    "decimals": 4,  // Número de decimales para los tokens semi-fungibles
    "fungible": false,  // Indica si el token es fungible o semi-fungible
    "category": "Digital Goods",  // Categoría del token
    "external_links": {
        "terms_of_service": "https://example.com/terms",
        "whitepaper": "https://example.com/whitepaper"
    },
    // Otros campos específicos de ERC-1155
}

let nofungibles = {
    "tokenId": 1,
    "name": "Mi NFT",
    "symbol": "NFTSYMBOL",
    "owner": "0x123456789abcdef",  // Dirección de la billetera del propietario actual
    "smart_contract": "0x987654321fedcba",  // Dirección del contrato inteligente
    "metadata": {
        "title": "Obra de Arte",
        "artist": "Nombre del Artista",
        "description": "Una hermosa obra de arte digital.",
        "image": "https://example.com/artwork.jpg",
        "attributes": {
            "color": "azul",
            "size": "mediano"
        }
    },
    "royalties": {
        "artist": 10,  // Porcentaje de regalías para el artista
        "platform": 5  // Porcentaje de regalías para la plataforma
    },
    "createdTimestamp": 1641019200,  // Fecha de creación del NFT en formato de marca de tiempo UNIX
    "transactions": [
        {
            "transactionType": "Mint",
            "from": "0x0000000000000000",
            "to": "0x123456789abcdef",
            "timestamp": 1641019200
        },
        {
            "transactionType": "Transfer",
            "from": "0x123456789abcdef",
            "to": "0xaaaaaaaaaaaaaaa",
            "timestamp": 1641105600
        }
    ]
}


let bc = new Blockchain();

bc.dineroSystema('liontumbler', 25000)

bc.addTransactions(new Transaction('liontumbler', 'mechas', 500));
bc.addTransactions(new Transaction('liontumbler', 'mechas', 500));

//minar
bc.minarPendingTransactions('liontumbler');

//salodo
console.log(bc.getAmountTotal('liontumbler'), 'uno')
console.log(bc.getAmountTotal('mechas'), 'dos')

console.log(bc.chain, 'rrr')
for (const i in bc.chain) {
    console.log(bc.chain[i].data, 'tres')
}
