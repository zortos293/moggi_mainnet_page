# Monad Mainnet Indexer API Documentation

Base URL: `http://localhost:9009`

## Table of Contents
- [General Endpoints](#general-endpoints)
- [Block Endpoints](#block-endpoints)
- [Transaction Endpoints](#transaction-endpoints)
- [Address Endpoints](#address-endpoints)
- [Token Endpoints (ERC20)](#token-endpoints-erc20)
- [NFT Endpoints (ERC721/ERC1155)](#nft-endpoints-erc721erc1155)
- [Decoded Events Endpoints](#decoded-events-endpoints)
- [Balance History Endpoints](#balance-history-endpoints)
- [Contract Metadata & Labels](#contract-metadata--labels)
- [Stats Endpoints](#stats-endpoints)
- [Indexing Endpoints](#indexing-endpoints)

---

## General Endpoints

### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "name": "Monad Mainnet Indexer API",
  "version": "1.0.0",
  "endpoints": {
    "blocks": "/api/blocks",
    "transactions": "/api/transactions",
    "addresses": "/api/addresses",
    "tokens": "/api/tokens",
    "nfts": "/api/nfts",
    "events": "/api/events",
    "stats": "/api/stats",
    "indexing": "/api/indexing"
  },
  "features": {
    "internalTransactions": true,
    "erc20Tracking": true,
    "nftTracking": true,
    "eventDecoding": true,
    "balanceHistory": true
  }
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T12:00:00.000Z"
}
```

---

## Block Endpoints

### GET /api/blocks/latest
Get the most recent blocks.

**Query Parameters:**
- `limit` (optional): Number of blocks to return (default: 10, max: 100)

**Example Request:**
```
GET /api/blocks/latest?limit=5
```

**Example Response:**
```json
{
  "data": [
    {
      "number": "32992500",
      "hash": "0x1234567890abcdef...",
      "parentHash": "0xabcdef1234567890...",
      "timestamp": "1730556000",
      "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      "gasLimit": "30000000",
      "gasUsed": "12500000",
      "baseFeePerGas": "1000000000",
      "difficulty": "0",
      "totalDifficulty": "0",
      "transactionCount": 150,
      "nonce": "0x0000000000000000",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "logsBloom": "0x00000000...",
      "transactionsRoot": "0xabcd...",
      "stateRoot": "0xefgh...",
      "receiptsRoot": "0xijkl...",
      "extraData": "0x",
      "size": 50000
    }
  ],
  "count": 5
}
```

### GET /api/blocks
Get paginated list of blocks.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Blocks per page (default: 20, max: 100)

**Example Request:**
```
GET /api/blocks?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "number": "32992500",
      "hash": "0x1234567890abcdef...",
      "parentHash": "0xabcdef1234567890...",
      "timestamp": "1730556000",
      "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
      "gasLimit": "30000000",
      "gasUsed": "12500000",
      "baseFeePerGas": "1000000000",
      "difficulty": "0",
      "totalDifficulty": "0",
      "transactionCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100000,
    "totalPages": 5000
  }
}
```

### GET /api/blocks/:blockNumber
Get a specific block by number. If the block is not indexed, triggers on-demand indexing.

**Example Request:**
```
GET /api/blocks/32992500
```

**Example Response (Block exists):**
```json
{
  "number": "32992500",
  "hash": "0x1234567890abcdef...",
  "parentHash": "0xabcdef1234567890...",
  "timestamp": "1730556000",
  "miner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  "gasLimit": "30000000",
  "gasUsed": "12500000",
  "baseFeePerGas": "1000000000",
  "difficulty": "0",
  "totalDifficulty": "0",
  "transactionCount": 150,
  "transactions": [
    {
      "hash": "0xabc123...",
      "from": "0x1234...",
      "to": "0x5678...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "1000000000",
      "gasUsed": "21000",
      "blockNumber": "32992500",
      "transactionIndex": 0,
      "timestamp": "1730556000"
    }
  ]
}
```

**Example Response (Block not indexed):**
```json
{
  "message": "Block not indexed yet. Indexing has been triggered.",
  "blockNumber": "32992500",
  "status": "indexing"
}
```

### GET /api/blocks/hash/:blockHash
Get a specific block by hash.

**Example Request:**
```
GET /api/blocks/hash/0x1234567890abcdef...
```

**Example Response:**
Same as GET /api/blocks/:blockNumber

---

## Transaction Endpoints

### GET /api/transactions/latest
Get the most recent transactions.

**Query Parameters:**
- `limit` (optional): Number of transactions to return (default: 10, max: 100)

**Example Request:**
```
GET /api/transactions/latest?limit=10
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123def456...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "1000000000",
      "maxFeePerGas": "2000000000",
      "maxPriorityFeePerGas": "1000000000",
      "gasUsed": "21000",
      "cumulativeGasUsed": "500000",
      "effectiveGasPrice": "1000000000",
      "blockNumber": "32992500",
      "blockHash": "0x1234567890abcdef...",
      "timestamp": "1730556000",
      "transactionIndex": 5,
      "nonce": 42,
      "input": "0x",
      "status": true,
      "type": 2,
      "chainId": 143,
      "accessList": null,
      "authorizationList": null,
      "v": "0",
      "r": "0x123...",
      "s": "0x456..."
    }
  ],
  "count": 10
}
```

### GET /api/transactions
Get paginated list of transactions.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/transactions?page=1&limit=50
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123def456...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000000,
    "totalPages": 20000
  }
}
```

### GET /api/transactions/:txHash
Get a specific transaction by hash with logs, internal transactions, and decoded events.

**Example Request:**
```
GET /api/transactions/0xabc123def456...
```

**Example Response:**
```json
{
  "hash": "0xabc123def456...",
  "from": "0x1234567890abcdef...",
  "to": "0xfedcba0987654321...",
  "value": "1000000000000000000",
  "gas": "100000",
  "gasPrice": "1000000000",
  "gasUsed": "85000",
  "blockNumber": "32992500",
  "timestamp": "1730556000",
  "status": true,
  "logs": [
    {
      "address": "0xtoken123...",
      "topics": ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
      "data": "0x000000000000000000000000000000000000000000000000000000000000000a",
      "logIndex": 0,
      "blockNumber": "32992500",
      "transactionHash": "0xabc123def456...",
      "decodedEvent": {
        "eventName": "Transfer",
        "eventSignature": "Transfer(address,address,uint256)",
        "standardType": "ERC20_TRANSFER",
        "decodedData": {
          "from": "0x1234...",
          "to": "0x5678...",
          "value": "1000000000000000000"
        }
      }
    }
  ],
  "internalTransactions": [
    {
      "from": "0xcontract1...",
      "to": "0xcontract2...",
      "value": "500000000000000000",
      "gas": "50000",
      "gasUsed": "35000",
      "type": "CALL"
    }
  ]
}
```

### Transaction Types & EIP Support

Monad Mainnet supports the following Ethereum transaction types:

#### Supported Transaction Types

| Type | Name | EIP | Description |
|------|------|-----|-------------|
| 0 | Legacy | Pre-EIP-2718 | Original Ethereum transaction format with `gasPrice` |
| 1 | Access List | EIP-2930 | Adds optional `accessList` for gas optimization |
| 2 | EIP-1559 | EIP-1559 | Dynamic fees with `maxFeePerGas` and `maxPriorityFeePerGas` (default) |
| 4 | Set Code | EIP-7702 | EOA account code delegation with `authorizationList` |

**Not Supported:**
- Type 3 (EIP-4844) - Blob transactions are not supported on Monad

#### Transaction Type Fields

**Type 0 (Legacy):**
```json
{
  "type": 0,
  "gasPrice": "1000000000",
  "chainId": 143,
  "v": "0x...",
  "r": "0x...",
  "s": "0x..."
}
```

**Type 1 (EIP-2930 - Access List):**
```json
{
  "type": 1,
  "gasPrice": "1000000000",
  "chainId": 143,
  "accessList": [
    {
      "address": "0x1234...",
      "storageKeys": ["0xabcd...", "0xef01..."]
    }
  ],
  "v": "0x...",
  "r": "0x...",
  "s": "0x..."
}
```

**Type 2 (EIP-1559 - Dynamic Fee):**
```json
{
  "type": 2,
  "maxFeePerGas": "2000000000",
  "maxPriorityFeePerGas": "1000000000",
  "chainId": 143,
  "accessList": [
    {
      "address": "0x1234...",
      "storageKeys": ["0xabcd..."]
    }
  ],
  "v": "0x...",
  "r": "0x...",
  "s": "0x..."
}
```

**Type 4 (EIP-7702 - Set Code):**
```json
{
  "type": 4,
  "maxFeePerGas": "2000000000",
  "maxPriorityFeePerGas": "1000000000",
  "chainId": 143,
  "authorizationList": [
    {
      "chainId": "143",
      "address": "0x5678...",
      "nonce": "1",
      "v": "0x...",
      "r": "0x...",
      "s": "0x..."
    }
  ],
  "v": "0x...",
  "r": "0x...",
  "s": "0x..."
}
```

#### Pre-EIP-155 Transactions

Transactions without a `chainId` (pre-EIP-155) are allowed at the protocol level but **strongly discouraged** due to replay attack risks. These transactions will have `chainId: null` in the API response.

**Warning:** Do not send funds to Ethereum addresses that have previously sent pre-EIP-155 transactions.

#### Access Lists

Access lists (EIP-2930) allow transactions to declare which addresses and storage slots they will access, providing gas optimization. Access lists are:
- **Optional** for all transaction types
- **Supported** in Type 1, 2, and 4 transactions
- Stored as JSON in the `accessList` field

#### Authorization Lists

Authorization lists (EIP-7702) enable EOA (externally owned account) accounts to temporarily delegate their code execution to a smart contract. This allows:
- EOAs to behave like smart contract wallets
- Batch transaction execution
- Enhanced security features (like multisig for EOAs)

Authorization lists are:
- **Required** for Type 4 transactions
- Stored as JSON in the `authorizationList` field
- Contain signatures authorizing the code delegation

---

## Address Endpoints

### GET /api/addresses/contracts/list
Get a paginated list of all detected smart contracts.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Contracts per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/contracts/list?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0x1234567890abcdef...",
      "balance": "1000000000000000000",
      "transactionCount": 50,
      "isContract": true,
      "contractCode": "0x6080604052...",
      "contractCreator": "0xabcdef1234567890...",
      "contractCreationTx": "0xabcd1234...",
      "firstSeenBlock": "32990000",
      "lastSeenBlock": "32992500",
      "createdAt": "2025-11-02T12:00:00.000Z",
      "updatedAt": "2025-11-02T13:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/addresses/:address
Get address information and balance. Includes contract information if the address is a contract.

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef...
```

**Example Response (Regular Address):**
```json
{
  "address": "0x1234567890abcdef...",
  "balance": "5000000000000000000",
  "transactionCount": 150,
  "firstSeenBlock": "32990000",
  "lastSeenBlock": "32992500",
  "isContract": false,
  "contractCode": null,
  "contractCreator": null,
  "contractCreationTx": null
}
```

**Example Response (Contract Address):**
```json
{
  "address": "0xcontract123...",
  "balance": "1000000000000000000",
  "transactionCount": 250,
  "firstSeenBlock": "32985000",
  "lastSeenBlock": "32992500",
  "isContract": true,
  "contractCode": "0x6080604052...",
  "contractCreator": "0xdeployer123...",
  "contractCreationTx": "0xtxhash123..."
}
```

### GET /api/addresses/:address/transactions
Get transactions for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../transactions?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "hash": "0xabc123...",
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/addresses/:address/internal-transactions
Get internal transactions for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Internal transactions per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../internal-transactions?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0xcontract1...",
      "to": "0x1234567890abcdef...",
      "value": "100000000000000000",
      "gas": "21000",
      "gasUsed": "21000",
      "type": "CALL",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### GET /api/addresses/:address/token-transfers
Get ERC-20 token transfers for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Token transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../token-transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "tokenAddress": "0xtoken123...",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000",
      "logIndex": 0,
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 75,
    "totalPages": 4
  }
}
```

### GET /api/addresses/:address/token-balances
Get all ERC-20 token balances for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Token balances per page (default: 50, max: 100)

**Example Request:**
```
GET /api/addresses/0x1234567890abcdef.../token-balances?page=1&limit=50
```

**Example Response:**
```json
{
  "data": [
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0x1234567890abcdef...",
      "balance": "5000000000000000000",
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18,
        "totalSupply": "1000000000000000000000000"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "totalPages": 1
  }
}
```

---

## Token Endpoints (ERC20)

### GET /api/tokens
Get paginated list of all ERC-20 tokens.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Tokens per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0xtoken123...",
      "name": "Example Token",
      "symbol": "EXT",
      "decimals": 18,
      "totalSupply": "1000000000000000000000000",
      "createdAt": "2025-11-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 500,
    "totalPages": 25
  }
}
```

### GET /api/tokens/:tokenAddress
Get detailed information about a specific token.

**Example Request:**
```
GET /api/tokens/0xtoken123...
```

**Example Response:**
```json
{
  "address": "0xtoken123...",
  "name": "Example Token",
  "symbol": "EXT",
  "decimals": 18,
  "totalSupply": "1000000000000000000000000",
  "transferCount": 5000,
  "holderCount": 1250,
  "createdAt": "2025-11-02T12:00:00.000Z"
}
```

### GET /api/tokens/:tokenAddress/transfers
Get all transfers for a specific token.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens/0xtoken123.../transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "from": "0x1234567890abcdef...",
      "to": "0xfedcba0987654321...",
      "value": "1000000000000000000",
      "tokenAddress": "0xtoken123...",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000",
      "logIndex": 0,
      "token": {
        "address": "0xtoken123...",
        "name": "Example Token",
        "symbol": "EXT",
        "decimals": 18
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5000,
    "totalPages": 250
  }
}
```

### GET /api/tokens/:tokenAddress/holders
Get all holders for a specific token, ordered by balance.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Holders per page (default: 20, max: 100)

**Example Request:**
```
GET /api/tokens/0xtoken123.../holders?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0x1234567890abcdef...",
      "balance": "50000000000000000000000"
    },
    {
      "tokenAddress": "0xtoken123...",
      "holderAddress": "0xfedcba0987654321...",
      "balance": "25000000000000000000000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

---

## NFT Endpoints (ERC721/ERC1155)

### GET /api/nfts/collections
Get paginated list of all NFT collections.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Collections per page (default: 20, max: 100)
- `type` (optional): Filter by token type: "ERC721" or "ERC1155"

**Example Request:**
```
GET /api/nfts/collections?page=1&limit=20&type=ERC721
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0xnft123...",
      "name": "Cool NFT Collection",
      "symbol": "COOL",
      "tokenType": "ERC721",
      "totalSupply": "10000",
      "contractUri": null,
      "createdAt": "2025-11-02T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### GET /api/nfts/collections/:collectionAddress
Get detailed information about a specific NFT collection.

**Example Request:**
```
GET /api/nfts/collections/0xnft123...
```

**Example Response:**
```json
{
  "address": "0xnft123...",
  "name": "Cool NFT Collection",
  "symbol": "COOL",
  "tokenType": "ERC721",
  "totalSupply": "10000",
  "contractUri": null,
  "transferCount": 15000,
  "holderCount": 3500,
  "createdAt": "2025-11-02T12:00:00.000Z"
}
```

### GET /api/nfts/collections/:collectionAddress/transfers
Get all transfers for a specific NFT collection.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/nfts/collections/0xnft123.../transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "collectionAddress": "0xnft123...",
      "tokenId": "1234",
      "from": "0x1234...",
      "to": "0x5678...",
      "amount": "1",
      "tokenType": "ERC721",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15000,
    "totalPages": 750
  }
}
```

### GET /api/nfts/collections/:collectionAddress/tokens/:tokenId
Get information about a specific NFT token.

**Example Request:**
```
GET /api/nfts/collections/0xnft123.../tokens/1234
```

**Example Response (ERC721):**
```json
{
  "collectionAddress": "0xnft123...",
  "tokenId": "1234",
  "owner": "0x5678...",
  "tokenUri": "ipfs://QmX...",
  "metadata": "{\"name\":\"Cool NFT #1234\",\"image\":\"ipfs://...\"}",
  "amount": "1"
}
```

**Example Response (ERC1155):**
```json
{
  "collectionAddress": "0xnft456...",
  "tokenId": "5678",
  "owners": [
    {
      "owner": "0x1234...",
      "amount": "5"
    },
    {
      "owner": "0x5678...",
      "amount": "3"
    }
  ],
  "tokenUri": "https://api.example.com/metadata/5678",
  "metadata": null
}
```

### GET /api/nfts/address/:address/nfts
Get all NFTs owned by a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): NFTs per page (default: 20, max: 100)
- `type` (optional): Filter by token type: "ERC721" or "ERC1155"

**Example Request:**
```
GET /api/nfts/address/0x1234.../nfts?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "collectionAddress": "0xnft123...",
      "tokenId": "1234",
      "owner": "0x1234...",
      "amount": "1",
      "tokenUri": "ipfs://QmX...",
      "collection": {
        "name": "Cool NFT Collection",
        "symbol": "COOL",
        "tokenType": "ERC721"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### GET /api/nfts/address/:address/nft-transfers
Get NFT transfer history for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Transfers per page (default: 20, max: 100)

**Example Request:**
```
GET /api/nfts/address/0x1234.../nft-transfers?page=1&limit=20
```

**Example Response:**
```json
{
  "data": [
    {
      "collectionAddress": "0xnft123...",
      "tokenId": "1234",
      "from": "0x5678...",
      "to": "0x1234...",
      "amount": "1",
      "tokenType": "ERC721",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000",
      "collection": {
        "name": "Cool NFT Collection",
        "symbol": "COOL",
        "tokenType": "ERC721"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 125,
    "totalPages": 7
  }
}
```

---

## Decoded Events Endpoints

### GET /api/events
Get paginated list of all decoded events.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Events per page (default: 20, max: 100)
- `eventName` (optional): Filter by event name (e.g., "Transfer", "Approval", "Swap")
- `standardType` (optional): Filter by standard type (e.g., "ERC20_TRANSFER", "ERC721_TRANSFER", "UNISWAP_V2_SWAP")
- `address` (optional): Filter by contract address

**Example Request:**
```
GET /api/events?page=1&limit=20&eventName=Swap&standardType=UNISWAP_V2_SWAP
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "clxyz123...",
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "address": "0xpair123...",
      "eventName": "Swap",
      "eventSignature": "Swap(address,uint256,uint256,uint256,uint256,address)",
      "standardType": "UNISWAP_V2_SWAP",
      "decodedData": {
        "sender": "0x1234...",
        "amount0In": "1000000000000000000",
        "amount1In": "0",
        "amount0Out": "0",
        "amount1Out": "2500000000000000000",
        "to": "0x5678..."
      },
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50000,
    "totalPages": 2500
  }
}
```

### GET /api/events/transaction/:txHash
Get all decoded events for a specific transaction.

**Example Request:**
```
GET /api/events/transaction/0xabc123...
```

**Example Response:**
```json
{
  "data": [
    {
      "eventName": "Transfer",
      "eventSignature": "Transfer(address,address,uint256)",
      "standardType": "ERC20_TRANSFER",
      "address": "0xtoken123...",
      "decodedData": {
        "from": "0x1234...",
        "to": "0x5678...",
        "value": "1000000000000000000"
      },
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    },
    {
      "eventName": "Approval",
      "eventSignature": "Approval(address,address,uint256)",
      "standardType": "ERC20_APPROVAL",
      "address": "0xtoken123...",
      "decodedData": {
        "owner": "0x1234...",
        "spender": "0x5678...",
        "value": "999999999999999999999999"
      },
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "count": 2
}
```

### GET /api/events/address/:address
Get all decoded events for a specific contract address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Events per page (default: 20, max: 100)
- `eventName` (optional): Filter by event name

**Example Request:**
```
GET /api/events/address/0xtoken123...?page=1&limit=20&eventName=Transfer
```

**Example Response:**
```json
{
  "data": [
    {
      "eventName": "Transfer",
      "eventSignature": "Transfer(address,address,uint256)",
      "standardType": "ERC20_TRANSFER",
      "decodedData": {
        "from": "0x1234...",
        "to": "0x5678...",
        "value": "1000000000000000000"
      },
      "transactionHash": "0xabc123...",
      "blockNumber": "32992500",
      "timestamp": "1730556000"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10000,
    "totalPages": 500
  }
}
```

---

## Balance History Endpoints

### GET /api/addresses/:address/balance-history
Get balance history for a specific address.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): History entries per page (default: 20, max: 100)
- `fromBlock` (optional): Start from this block number
- `toBlock` (optional): End at this block number

**Example Request:**
```
GET /api/addresses/0x1234.../balance-history?page=1&limit=20&fromBlock=32990000&toBlock=32992500
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0x1234...",
      "blockNumber": "32992500",
      "balance": "5000000000000000000",
      "nonce": 42,
      "isContract": false,
      "codeHash": null,
      "timestamp": "1730556000"
    },
    {
      "address": "0x1234...",
      "blockNumber": "32992000",
      "balance": "4500000000000000000",
      "nonce": 41,
      "isContract": false,
      "codeHash": null,
      "timestamp": "1730555500"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### GET /api/addresses/:address/balance-at/:blockNumber
Get balance of an address at a specific block.

**Example Request:**
```
GET /api/addresses/0x1234.../balance-at/32992500
```

**Example Response:**
```json
{
  "address": "0x1234...",
  "blockNumber": "32992500",
  "balance": "5000000000000000000",
  "nonce": 42,
  "isContract": false,
  "codeHash": null,
  "timestamp": "1730556000"
}
```

---

## Contract Metadata & Labels

The indexer includes metadata and labels for canonical contracts, ecosystem protocols, and known addresses. This allows you to get human-readable names, categories, and social links for contracts.

### GET /api/metadata/address/:address
Get metadata for a specific address (contract name, category, social links, etc.).

**Example Request:**
```
GET /api/metadata/address/0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A
```

**Example Response:**
```json
{
  "address": "0x3bd359c1119da7da1d913d1c4d2b7c461115433a",
  "name": "Wrapped MON",
  "label": "WMON",
  "symbol": "WMON",
  "category": "DeFi::Token",
  "entityType": "Token",
  "isToken": true,
  "tokenStandard": "ERC20",
  "decimals": 18,
  "projectName": null,
  "isCanonical": true,
  "isVerified": true,
  "description": "Wrapped Monad native token",
  "website": null,
  "twitter": null,
  "github": null,
  "docs": null,
  "logoUri": null,
  "tags": ["canonical", "wrapped"],
  "createdAt": "2025-11-03T12:00:00.000Z",
  "updatedAt": "2025-11-03T12:00:00.000Z"
}
```

### GET /api/metadata/addresses
Get paginated list of all labeled addresses with optional filters.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Addresses per page (default: 20, max: 100)
- `category` (optional): Filter by category (e.g., "DeFi::DEX", "Infra::Oracle")
- `entityType` (optional): Filter by entity type (e.g., "Token", "Factory", "Router")
- `projectName` (optional): Filter by project name (e.g., "Uniswap", "Chainlink")
- `isToken` (optional): Filter tokens only (true/false)
- `isCanonical` (optional): Filter canonical contracts only (true/false)

**Example Request:**
```
GET /api/metadata/addresses?category=DeFi::DEX&limit=10
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0x182a927119d56008d921126764bf884221b10f59",
      "name": "Uniswap V2 Factory",
      "label": "Uniswap V2 Factory",
      "category": "DeFi::DEX",
      "entityType": "Factory",
      "projectName": "Uniswap",
      "isVerified": true,
      "description": "Uniswap V2 Factory for pair creation",
      "website": "https://app.uniswap.org/",
      "twitter": "https://x.com/Uniswap",
      "tags": ["uniswap", "dex", "v2", "factory"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### GET /api/metadata/canonical
Get all canonical contracts (official Monad ecosystem contracts).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Contracts per page (default: 50, max: 100)

**Example Request:**
```
GET /api/metadata/canonical
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0xca11bde05977b3631167028862be2a173976ca11",
      "name": "Multicall3",
      "label": "Multicall3",
      "category": "Infra::Utility",
      "entityType": "Multicall",
      "isCanonical": true,
      "isVerified": true,
      "description": "Multicall3 - Aggregate multiple constant function call results",
      "tags": ["canonical", "multicall", "utility"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 18,
    "totalPages": 1
  }
}
```

### GET /api/metadata/tokens
Get all labeled tokens with metadata.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Tokens per page (default: 20, max: 100)

**Example Request:**
```
GET /api/metadata/tokens
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0x754704bc059f8c67012fed69bc8a327a5aafb603",
      "name": "USD Coin",
      "label": "USDC",
      "symbol": "USDC",
      "decimals": 6,
      "category": "DeFi::Stablecoin",
      "entityType": "Token",
      "isToken": true,
      "tokenStandard": "ERC20",
      "projectName": "Circle",
      "isVerified": true,
      "description": "USDC Stablecoin on Monad",
      "website": "https://circle.com",
      "twitter": "https://x.com/circle",
      "tags": ["stablecoin", "usdc", "circle"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

### GET /api/metadata/projects
Get all unique projects with contract counts.

**Example Request:**
```
GET /api/metadata/projects
```

**Example Response:**
```json
{
  "data": [
    {
      "projectName": "Chainlink",
      "contractCount": 2
    },
    {
      "projectName": "Circle",
      "contractCount": 1
    },
    {
      "projectName": "PancakeSwap",
      "contractCount": 5
    },
    {
      "projectName": "Uniswap",
      "contractCount": 6
    }
  ],
  "count": 4
}
```

### GET /api/metadata/project/:projectName
Get all contracts for a specific project.

**Example Request:**
```
GET /api/metadata/project/Uniswap
```

**Example Response:**
```json
{
  "projectName": "Uniswap",
  "contracts": [
    {
      "address": "0x0d97dc33264bfc1c226207428a79b26757fb9dc3",
      "name": "Uniswap Universal Router",
      "label": "Universal Router",
      "category": "DeFi::DEX",
      "entityType": "Router",
      "projectName": "Uniswap",
      "isVerified": true,
      "website": "https://app.uniswap.org/",
      "twitter": "https://x.com/Uniswap",
      "tags": ["uniswap", "dex", "universal", "router"]
    }
  ],
  "count": 6
}
```

### GET /api/metadata/categories
Get all unique categories with contract counts.

**Example Request:**
```
GET /api/metadata/categories
```

**Example Response:**
```json
{
  "data": [
    {
      "category": "DeFi::DEX",
      "contractCount": 11
    },
    {
      "category": "DeFi::Stablecoin",
      "contractCount": 1
    },
    {
      "category": "DeFi::Token",
      "contractCount": 1
    },
    {
      "category": "Infra::AccountAbstraction",
      "contractCount": 4
    },
    {
      "category": "Infra::Deployer",
      "contractCount": 4
    },
    {
      "category": "Infra::Factory",
      "contractCount": 2
    },
    {
      "category": "Infra::Oracle",
      "contractCount": 2
    },
    {
      "category": "Infra::Token",
      "contractCount": 1
    },
    {
      "category": "Infra::Utility",
      "contractCount": 4
    },
    {
      "category": "Infra::Wallet",
      "contractCount": 2
    }
  ],
  "count": 10
}
```

### GET /api/metadata/search
Search address metadata by name, label, symbol, or project name.

**Query Parameters:**
- `q` (required): Search query (minimum 2 characters)

**Example Request:**
```
GET /api/metadata/search?q=uniswap
```

**Example Response:**
```json
{
  "data": [
    {
      "address": "0x182a927119d56008d921126764bf884221b10f59",
      "name": "Uniswap V2 Factory",
      "label": "Uniswap V2 Factory",
      "projectName": "Uniswap",
      "category": "DeFi::DEX"
    },
    {
      "address": "0x4b2ab38dbf28d31d467aa8993f6c2585981d6804",
      "name": "Uniswap V2 Router 02",
      "label": "Uniswap V2 Router",
      "projectName": "Uniswap",
      "category": "DeFi::DEX"
    }
  ],
  "count": 6
}
```

### GET /api/metadata/protocols
Get all registered protocols with their addresses and metadata.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Protocols per page (default: 20, max: 100)
- `isLive` (optional): Filter by live status (true/false)

**Example Request:**
```
GET /api/metadata/protocols
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "clxyz123...",
      "name": "Uniswap",
      "slug": "uniswap",
      "description": "The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.",
      "categories": ["DeFi", "DEX"],
      "isLive": true,
      "website": "https://app.uniswap.org/",
      "twitter": "https://x.com/Uniswap",
      "github": "https://github.com/Uniswap/",
      "docs": "https://docs.uniswap.org/",
      "tags": ["dex", "amm", "swap"],
      "addresses": {
        "UniswapV2Factory": "0x182a927119d56008d921126764bf884221b10f59",
        "UniswapV2Router02": "0x4b2ab38dbf28d31d467aa8993f6c2585981d6804",
        "UniswapV3Factory": "0x204faca1764b154221e35c0d20abb3c525710498"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 4,
    "totalPages": 1
  }
}
```

### GET /api/metadata/protocols/:slug
Get detailed information about a specific protocol including all contract addresses with metadata.

**Example Request:**
```
GET /api/metadata/protocols/uniswap
```

**Example Response:**
```json
{
  "id": "clxyz123...",
  "name": "Uniswap",
  "slug": "uniswap",
  "description": "The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+ other chains.",
  "categories": ["DeFi", "DEX"],
  "isLive": true,
  "website": "https://app.uniswap.org/",
  "twitter": "https://x.com/Uniswap",
  "github": "https://github.com/Uniswap/",
  "docs": "https://docs.uniswap.org/",
  "tags": ["dex", "amm", "swap"],
  "addresses": {
    "UniswapV2Factory": {
      "address": "0x182a927119d56008d921126764bf884221b10f59",
      "metadata": {
        "name": "Uniswap V2 Factory",
        "label": "Uniswap V2 Factory",
        "category": "DeFi::DEX",
        "entityType": "Factory",
        "description": "Uniswap V2 Factory for pair creation"
      }
    },
    "UniswapV2Router02": {
      "address": "0x4b2ab38dbf28d31d467aa8993f6c2585981d6804",
      "metadata": {
        "name": "Uniswap V2 Router 02",
        "label": "Uniswap V2 Router",
        "category": "DeFi::DEX",
        "entityType": "Router",
        "description": "Uniswap V2 Router for swaps"
      }
    }
  }
}
```

---

## Stats Endpoints

### GET /api/stats
Get overall indexer statistics.

**Example Request:**
```
GET /api/stats
```

**Example Response:**
```json
{
  "blockCount": 100000,
  "transactionCount": 5000000,
  "addressCount": 250000,
  "contractCount": 5000,
  "tokenCount": 500,
  "nftCollectionCount": 50,
  "nftTransferCount": 25000,
  "decodedEventCount": 8000000,
  "internalTransactionCount": 1500000,
  "latestBlock": {
    "number": "32992500",
    "timestamp": "1730556000"
  },
  "indexerState": {
    "lastIndexedBlock": "32992500",
    "isIndexing": true,
    "updatedAt": "2025-11-02T12:00:00.000Z"
  },
  "indexingStats": {
    "blocksPerMinute": 15.5,
    "avgBlockTime": 1.0,
    "progressPercent": 98.5
  }
}
```

---

## Indexing Endpoints

### GET /api/indexing/request/:blockNumber
Get the status of a specific block indexing request.

**Example Request:**
```
GET /api/indexing/request/32992500
```

**Example Response (Completed):**
```json
{
  "blockNumber": "32992500",
  "status": "completed",
  "priority": 1,
  "createdAt": "2025-11-02T12:00:00.000Z",
  "updatedAt": "2025-11-02T12:01:00.000Z",
  "error": null
}
```

**Example Response (Failed):**
```json
{
  "blockNumber": "32992500",
  "status": "failed",
  "priority": 1,
  "createdAt": "2025-11-02T12:00:00.000Z",
  "updatedAt": "2025-11-02T12:01:00.000Z",
  "error": "Block not found"
}
```

### GET /api/indexing/pending
Get all pending block indexing requests.

**Example Request:**
```
GET /api/indexing/pending
```

**Example Response:**
```json
{
  "count": 5,
  "requests": [
    {
      "blockNumber": "32992501",
      "priority": 1,
      "createdAt": "2025-11-02T12:00:00.000Z"
    },
    {
      "blockNumber": "32992502",
      "priority": 0,
      "createdAt": "2025-11-02T12:01:00.000Z"
    }
  ]
}
```

### POST /api/indexing/request/:blockNumber
Manually trigger indexing for a specific block.

**Example Request:**
```
POST /api/indexing/request/32992500
```

**Example Response (New Request):**
```json
{
  "message": "Indexing request created",
  "blockNumber": "32992500",
  "status": "pending"
}
```

**Example Response (Already Indexed):**
```json
{
  "message": "Block already indexed",
  "blockNumber": "32992500",
  "status": "completed"
}
```

---

## Data Types

### BigInt Fields
All large numbers are returned as strings to prevent precision loss in JSON:
- `blockNumber`
- `timestamp`
- `gas`
- `gasUsed`
- `gasPrice`
- `value`
- `balance`
- etc.

### Address Format
All addresses are lowercase hex strings:
- Example: `0x1234567890abcdef1234567890abcdef12345678`

### Hash Format
All hashes are hex strings with 0x prefix:
- Example: `0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890`

### Pagination
All paginated endpoints return:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50
  }
}
```

---

## Error Responses

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

### 202 Accepted (Block Indexing Triggered)
```json
{
  "message": "Block not indexed yet. Indexing has been triggered.",
  "blockNumber": "32992500",
  "status": "indexing"
}
```
