# Contract Detection Feature - API Update

**Release Date:** November 2, 2025
**API Base URL:** `http://localhost:9009`

---

## 📋 Overview

The Monad Mainnet Indexer now automatically detects and tracks smart contract deployments. All contract creations are indexed in real-time, providing complete visibility into deployed contracts on the network.

---

## 🆕 What's New

### **Automatic Contract Detection**
- Every contract deployment is automatically detected and indexed
- Contract creator and deployment transaction are tracked
- Contract addresses are flagged with `isContract: true`

### **New API Endpoint**
- `/api/addresses/contracts/list` - List all deployed contracts with pagination

### **Enhanced Existing Endpoint**
- `/api/addresses/:address` - Now returns contract-specific fields

---

## 🔧 API Changes

### 1. New Endpoint: Get All Contracts

**Endpoint:** `GET /api/addresses/contracts/list`

**Description:** Returns a paginated list of all detected smart contracts, ordered by deployment time (newest first).

**Query Parameters:**
| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Page number for pagination |
| `limit` | integer | 20 | 100 | Number of contracts per page |

**Request Example:**
```bash
GET http://localhost:9009/api/addresses/contracts/list?page=1&limit=20
```

**Response Example:**
```json
{
  "data": [
    {
      "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb4",
      "balance": "0",
      "transactionCount": 150,
      "isContract": true,
      "contractCode": "0x60806040526004361061...",
      "contractCreator": "0xa1b2c3d4e5f6789012345678901234567890abcd",
      "contractCreationTx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      "firstSeenBlock": "32990000",
      "lastSeenBlock": "32995000",
      "createdAt": "2025-11-02T12:00:00.000Z",
      "updatedAt": "2025-11-02T14:30:00.000Z"
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

### 2. Enhanced: Get Address Details

**Endpoint:** `GET /api/addresses/:address`

**Description:** Existing endpoint now includes contract detection fields.

**New Fields Added:**
| Field | Type | Description |
|-------|------|-------------|
| `isContract` | boolean | `true` if address is a smart contract, `false` otherwise |
| `contractCode` | string \| null | Contract bytecode (if available) |
| `contractCreator` | string \| null | Address of the account that deployed the contract |
| `contractCreationTx` | string \| null | Transaction hash of the contract deployment |

**Request Example:**
```bash
GET http://localhost:9009/api/addresses/0x742d35cc6634c0532925a3b844bc9e7595f0beb4
```

**Response Example (Contract Address):**
```json
{
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb4",
  "balance": "1500000000000000000",
  "transactionCount": 250,
  "isContract": true,
  "contractCode": "0x60806040526004361061...",
  "contractCreator": "0xa1b2c3d4e5f6789012345678901234567890abcd",
  "contractCreationTx": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "firstSeenBlock": "32990000",
  "lastSeenBlock": "32995000"
}
```

**Response Example (Regular Wallet Address):**
```json
{
  "address": "0xa1b2c3d4e5f6789012345678901234567890abcd",
  "balance": "5000000000000000000",
  "transactionCount": 150,
  "isContract": false,
  "contractCode": null,
  "contractCreator": null,
  "contractCreationTx": null,
  "firstSeenBlock": "32985000",
  "lastSeenBlock": "32995000"
}
```

---

## 💡 Use Cases

### **1. Contract Explorer Page**
Display all deployed contracts with filtering and pagination:
```javascript
// Fetch first page of contracts
fetch('http://localhost:9009/api/addresses/contracts/list?page=1&limit=20')
  .then(res => res.json())
  .then(data => {
    data.data.forEach(contract => {
      console.log(`Contract: ${contract.address}`);
      console.log(`Deployed by: ${contract.contractCreator}`);
      console.log(`Deployment Tx: ${contract.contractCreationTx}`);
    });
  });
```

### **2. Address Details Page**
Show contract-specific information when viewing an address:
```javascript
// Check if address is a contract
fetch('http://localhost:9009/api/addresses/0x742d35cc6634c0532925a3b844bc9e7595f0beb4')
  .then(res => res.json())
  .then(address => {
    if (address.isContract) {
      console.log('This is a smart contract!');
      console.log('Creator:', address.contractCreator);
      console.log('Deployment Tx:', address.contractCreationTx);
    } else {
      console.log('This is a regular wallet address');
    }
  });
```

### **3. Contract Creator Profile**
Link contracts to their deployers:
```javascript
// When viewing an address, show contracts they've deployed
const creatorAddress = "0xa1b2c3d4e5f6789012345678901234567890abcd";

fetch('http://localhost:9009/api/addresses/contracts/list?limit=100')
  .then(res => res.json())
  .then(data => {
    const deployedContracts = data.data.filter(
      c => c.contractCreator === creatorAddress.toLowerCase()
    );
    console.log(`This address deployed ${deployedContracts.length} contracts`);
  });
```

### **4. Recent Contract Deployments Widget**
Show latest contracts deployed on the network:
```javascript
// Get 10 most recently deployed contracts
fetch('http://localhost:9009/api/addresses/contracts/list?limit=10')
  .then(res => res.json())
  .then(data => {
    // data.data is already sorted by newest first
    console.log('Latest deployed contracts:', data.data);
  });
```

---

## 📊 UI/UX Recommendations

### **Contract Badge**
Add a visual indicator when displaying contract addresses:
```html
<!-- Example: Show contract badge on address -->
<div class="address-display">
  <span class="address">0x742d...0beb4</span>
  {#if isContract}
    <span class="badge contract-badge">Contract</span>
  {/if}
</div>
```

### **Contract Details Section**
When `isContract === true`, show additional information:
```html
<!-- Contract-specific section -->
{#if address.isContract}
  <div class="contract-info">
    <h3>Contract Information</h3>
    <dl>
      <dt>Creator:</dt>
      <dd>
        <a href="/address/{address.contractCreator}">
          {address.contractCreator}
        </a>
      </dd>

      <dt>Deployment Transaction:</dt>
      <dd>
        <a href="/tx/{address.contractCreationTx}">
          {address.contractCreationTx}
        </a>
      </dd>

      <dt>Deployed at Block:</dt>
      <dd>
        <a href="/block/{address.firstSeenBlock}">
          #{address.firstSeenBlock}
        </a>
      </dd>
    </dl>
  </div>
{/if}
```

### **Contracts Explorer Page**
Create a dedicated page at `/contracts`:
- Table with columns: Address, Creator, Deployment Tx, Block, Transaction Count
- Pagination controls
- Search/filter functionality
- Click to view contract details

---

## 🔍 Data Notes

### **Field Types**
- All addresses are lowercase hex strings: `0x1234...`
- `firstSeenBlock` and `lastSeenBlock` are returned as strings (not numbers) to prevent precision loss
- `balance` is returned as a string in wei (e.g., "1500000000000000000" = 1.5 ETH)
- `contractCode` contains the full contract bytecode starting with `0x`

### **Null Values**
- Regular wallet addresses will have `null` for all contract-related fields
- `contractCode` may be `null` even for contracts if the code wasn't retrieved yet

### **Pagination**
- Maximum `limit` is 100 items per page
- `total` shows total number of contracts in the database
- `totalPages` is pre-calculated for convenience

---

## 🚀 Migration Guide

### **No Breaking Changes**
All existing endpoints continue to work as before. New fields are simply added to existing responses.

### **Optional Integration**
Contract detection is automatic - no configuration needed. You can choose to:
1. Ignore the new fields (everything works as before)
2. Add contract badges to address displays
3. Create a full contracts explorer page
4. Display contract creator info on address pages

### **Recommended Updates**
1. **Address Display Component** - Add contract badge when `isContract === true`
2. **Address Details Page** - Show contract information section for contracts
3. **Navigation** - Add "Contracts" link to main menu
4. **Stats Dashboard** - Consider adding "Total Contracts" metric

---

## 📝 Example Implementation (React/Next.js)

```typescript
// types/contract.ts
export interface Address {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  contractCode: string | null;
  contractCreator: string | null;
  contractCreationTx: string | null;
  firstSeenBlock: string;
  lastSeenBlock: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractsResponse {
  data: Address[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// components/ContractBadge.tsx
export function ContractBadge({ isContract }: { isContract: boolean }) {
  if (!isContract) return null;

  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800">
      Contract
    </span>
  );
}

// pages/contracts.tsx
export default function ContractsPage() {
  const [contracts, setContracts] = useState<Address[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9009/api/addresses/contracts/list?page=${page}&limit=20`)
      .then(res => res.json())
      .then((data: ContractsResponse) => {
        setContracts(data.data);
        setLoading(false);
      });
  }, [page]);

  if (loading) return <div>Loading contracts...</div>;

  return (
    <div>
      <h1>Smart Contracts</h1>
      <table>
        <thead>
          <tr>
            <th>Contract Address</th>
            <th>Creator</th>
            <th>Deployment Tx</th>
            <th>Block</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.address}>
              <td>
                <a href={`/address/${contract.address}`}>
                  {contract.address}
                </a>
              </td>
              <td>
                <a href={`/address/${contract.contractCreator}`}>
                  {contract.contractCreator}
                </a>
              </td>
              <td>
                <a href={`/tx/${contract.contractCreationTx}`}>
                  {contract.contractCreationTx?.slice(0, 10)}...
                </a>
              </td>
              <td>
                <a href={`/block/${contract.firstSeenBlock}`}>
                  #{contract.firstSeenBlock}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ❓ FAQ

**Q: Are contracts detected automatically?**
A: Yes! All contract deployments are automatically detected and indexed in real-time.

**Q: Can I get contracts deployed by a specific address?**
A: Yes, fetch all contracts and filter by `contractCreator` field client-side, or we can add a dedicated endpoint if needed.

**Q: What about contracts deployed before indexing started?**
A: Contracts are only detected if the deployment transaction was indexed. Use the on-demand indexing feature to index historical blocks containing contract deployments.

**Q: How do I know if an address is a contract?**
A: Check the `isContract` field in the address response. If `true`, it's a contract.

**Q: Does this work for token contracts too?**
A: Yes! All contract types are detected, including ERC-20/ERC-721 tokens.

---

## 📞 Support

If you need any additional endpoints or modifications to support your frontend needs, please let us know!

**Example requests:**
- Filter contracts by creator
- Search contracts by deployment date range
- Get contract count statistics
- Bulk contract lookups

We can add these features based on your requirements.
