//import { Block } from "./Block";
//import { Transaction } from "./Transaction";
const Block = require('./Block');
const Transaction = require('./Transaction');
const {saveJsonFile, readJsonFilesFromFolder} = require('./SaveJsonFile');

class Blockchain {
    constructor() {
        //chain caddena se puede jalar de una db en caso de no tener nada insertar genesis
        this.chain = [Block.GenesisBlock()];
        this.pendingTransactions = [];
        this.giftForMiner = 0.00000001;
    }

    addTransactions(Transaction) {
        if (this.getAmountTotal(Transaction.from) > 0 || Transaction.from == 'system money' || Transaction.from == 'purchase of money') {
            this.pendingTransactions.push(Transaction);
        } else {
            console.log('sin saldo para transaccion ' +Transaction.from);
        }
    }

    dineroSystema(toMiner, amount) {
        this.addTransactions(new Transaction('system money', toMiner, amount, 'Mint'))
        // const transacionRegalo = new Transaction('system money', toMiner, amount, 'Mint');
        // this.addBlock([transacionRegalo]);
    }

    dineroCompra(toMiner, amount) {
        const transacionRegalo = new Transaction('purchase of money', toMiner, amount, 'Purchase');
        this.addBlock([transacionRegalo]);
    }

    minarPendingTransactions(toMiner) {
        if (this.pendingTransactions.length > 0) {
            const pendingTransactions = [...this.pendingTransactions];
            this.pendingTransactions = [];
            this.addBlock(pendingTransactions);
            this.dineroSystema(toMiner, this.giftForMiner * parseInt(pendingTransactions.length));
        } else {
            console.log('no puede minar');
        }
    }

    getUltimoBlock() {
        return this.chain[this.chain.length - 1];
    }

    getAmountTotal(from){
        // hacer consulta en la db
        return this.chain
            .slice(1) // 1️⃣ Ignora el bloque génesis
            .flatMap(block => block.data) // 2️⃣ Aplana todas las transacciones de todos los bloques en un solo array
            .reduce((total, tx) => { // 3️⃣ Acumula el saldo del usuario
                if (tx.from === from) total -= tx.amount; // Si el usuario envió, resta
                if (tx.to === from) total += tx.amount;   // Si el usuario recibió, suma
                return total; // Devuelve el total acumulado
            }, 0);
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
        if (!this.validateChain()) {
            console.warn('cadena corronpida intentar');
            this.chain.pop();
            // como no es valida traer la chain de la db
        } else {
            // hacer insercion y refrescar chain
            console.log('cadena valida');
        }

        return newBlock;
    }
}

function stringToHex(str, length = 20, base = 17) {
    let hash = 0n;
    for (let i = 0; i < str.length; i++) {
        hash = BigInt(hash) * base + str.charCodeAt(i);
    }
    return `0x${hash.toString(16).padEnd(length, "0")}`;
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

bc.dineroCompra('liontumbler', 25000.001)

bc.addTransactions(new Transaction('liontumbler', 'mechas', 500));
bc.addTransactions(new Transaction('liontumbler', 'mechas', 500));

console.log(bc.getAmountTotal('liontumbler'), 'edwin')
console.log(bc.getAmountTotal('mechas'), 'mahecha')

console.log('minando...');
bc.minarPendingTransactions('liontumbler');
console.log('termino');

console.log('minando...');
bc.minarPendingTransactions('mechas');
console.log('termino');

console.log('transacciones pendientes', bc.pendingTransactions);

//salodo
console.log(bc.getAmountTotal('liontumbler'), 'uno')
console.log(bc.getAmountTotal('mechas'), 'dos')

// for (const i in bc.chain) {
//     console.log(bc.chain[i]/*.data*/, 'tres')
// }

saveJsonFile('edwin', bc.chain)

console.log('dta', readJsonFilesFromFolder());

