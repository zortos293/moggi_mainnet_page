# Feature: Transaction Method ID (Function Selector)

## Overview

Added support for capturing and displaying transaction function selectors (method IDs), similar to Etherscan.

**Example**: `0xa9059cbb` (transfer function), `0x095ea7b3` (approve function)

---

## What is a Method ID?

The **method ID** (also called function selector) is the first 4 bytes of the keccak256 hash of the function signature.

### How It Works:

1. **Function signature**: `transfer(address,uint256)`
2. **Keccak256 hash**: `0xa9059cbb2ab09eb219583f4a59a5d0623ade346d962bcd4e46b11da047c9049b`
3. **Method ID** (first 4 bytes): `0xa9059cbb`

When you call a smart contract function, the transaction `input` data starts with this 4-byte method ID, followed by the encoded parameters.

### Example Transaction Input:
```
0xa9059cbb
000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e
0000000000000000000000000000000000000000000000000de0b6b3a7640000
^^^^^^^^^^
Method ID   ^^ Rest is encoded parameters (recipient address, amount)
```

---

## Database Schema

### New Fields Added to `Transaction` Model:

```prisma
model Transaction {
  // ... existing fields ...

  input                String   @db.Text
  methodId             String?  // First 4 bytes e.g. "0xa9059cbb"
  functionSignature    String?  // Decoded name e.g. "transfer(address,uint256)"

  // ... rest of fields ...

  @@index([methodId])  // Index for filtering by method
}
```

**Migration**: `20251103202747_add_method_id_to_transactions`

---

## Implementation

### 1. Extraction in Processor

**File**: `src/services/processor.ts:114-121`

```typescript
// Extract function selector (method ID) from transaction input
// Method ID is the first 4 bytes (8 hex characters) after "0x"
let methodId: string | null = null;
if (tx.data && tx.data.length >= 10) {
  // tx.data format: "0x" + hex string
  // Method ID: first 4 bytes = "0x" + 8 hex chars
  methodId = tx.data.slice(0, 10).toLowerCase();
}
```

**Logic**:
- Check if `tx.data` exists and is at least 10 characters (`0x` + 8 hex chars)
- Extract first 10 characters: `tx.data.slice(0, 10)`
- Convert to lowercase for consistency
- Store in database

### 2. Storage in Database

**File**: `src/services/processor.ts:136-137`

```typescript
const txData = {
  // ... other fields ...
  input: tx.data,
  methodId,
  functionSignature: null, // TODO: Lookup from 4byte.directory
  // ... other fields ...
};
```

---

## API Response

### Transaction Endpoints

All transaction endpoints now include `methodId` and `functionSignature` in the response.

#### Example: GET /api/transactions/:hash

```json
{
  "hash": "0xabc123...",
  "from": "0x123...",
  "to": "0x456...",
  "value": "1000000000000000000",
  "input": "0xa9059cbb000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e0000000000000000000000000000000000000000000000000de0b6b3a7640000",
  "methodId": "0xa9059cbb",
  "functionSignature": null,
  "blockNumber": "33279793",
  "timestamp": "1730556000"
}
```

---

## Common Method IDs

### ERC20 Token Functions

| Method ID | Function Signature | Description |
|-----------|-------------------|-------------|
| `0xa9059cbb` | `transfer(address,uint256)` | Transfer tokens |
| `0x095ea7b3` | `approve(address,uint256)` | Approve spending |
| `0x23b872dd` | `transferFrom(address,address,uint256)` | Transfer from approved |
| `0x70a08231` | `balanceOf(address)` | Get balance |
| `0xdd62ed3e` | `allowance(address,address)` | Get allowance |

### ERC721 NFT Functions

| Method ID | Function Signature | Description |
|-----------|-------------------|-------------|
| `0x42842e0e` | `safeTransferFrom(address,address,uint256)` | Safe transfer NFT |
| `0x23b872dd` | `transferFrom(address,address,uint256)` | Transfer NFT |
| `0x095ea7b3` | `approve(address,uint256)` | Approve NFT transfer |
| `0xa22cb465` | `setApprovalForAll(address,bool)` | Set operator approval |

### Uniswap V2 Router Functions

| Method ID | Function Signature | Description |
|-----------|-------------------|-------------|
| `0x38ed1739` | `swapExactTokensForTokens(...)` | Swap exact tokens |
| `0x8803dbee` | `swapTokensForExactTokens(...)` | Swap for exact tokens |
| `0x7ff36ab5` | `swapExactETHForTokens(...)` | Swap ETH for tokens |
| `0x18cbafe5` | `swapExactTokensForETH(...)` | Swap tokens for ETH |
| `0xe8e33700` | `addLiquidity(...)` | Add liquidity |
| `0xf305d719` | `addLiquidityETH(...)` | Add liquidity with ETH |

### Other Common Functions

| Method ID | Function Signature | Description |
|-----------|-------------------|-------------|
| `0x` | (empty) | Simple ETH transfer |
| `0x60806040` | (contract creation) | Contract deployment |

---

## Querying by Method ID

### Database Query Examples

```typescript
// Find all transfer transactions
const transfers = await prisma.transaction.findMany({
  where: { methodId: '0xa9059cbb' },
  take: 100,
});

// Find all Uniswap swaps
const swaps = await prisma.transaction.findMany({
  where: {
    methodId: {
      in: ['0x38ed1739', '0x8803dbee', '0x7ff36ab5', '0x18cbafe5']
    }
  },
});

// Count transactions by method
const methodCounts = await prisma.transaction.groupBy({
  by: ['methodId'],
  _count: true,
  orderBy: { _count: { methodId: 'desc' } },
  take: 10,
});
```

### API Endpoint Ideas (Future Enhancement)

```
GET /api/transactions?methodId=0xa9059cbb
GET /api/transactions/methods/popular
GET /api/transactions/methods/{methodId}/stats
```

---

## Future Enhancements

### 1. Function Signature Lookup (4byte.directory Integration)

**What**: Automatically resolve method IDs to human-readable function signatures

**How**:
```typescript
// Call 4byte.directory API
const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${methodId}`);
const data = await response.json();

if (data.results && data.results.length > 0) {
  functionSignature = data.results[0].text_signature;
  // e.g., "transfer(address,uint256)"
}
```

**Implementation Location**: `src/services/processor.ts` or create new `src/services/methodResolver.ts`

**Benefits**:
- Human-readable function names in API responses
- Better UX (users see "transfer" instead of "0xa9059cbb")
- Searchable by function name

**Considerations**:
- Rate limiting on 4byte.directory API
- Cache results locally (create `method_signatures` table)
- Fallback for unknown methods

### 2. Parameter Decoding

**What**: Decode function parameters from transaction input

**Example**:
```json
{
  "methodId": "0xa9059cbb",
  "functionSignature": "transfer(address,uint256)",
  "decodedParams": {
    "recipient": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "amount": "1000000000000000000"
  }
}
```

**Requires**:
- Contract ABI
- ABI decoder (ethers.js `Interface`)

### 3. Method Statistics

**What**: Track most popular methods, usage trends

**Endpoints**:
- `GET /api/stats/methods/popular` - Top 10 methods
- `GET /api/stats/methods/{methodId}` - Stats for specific method
- `GET /api/stats/methods/trends` - Method usage over time

### 4. Contract-Specific Method Mapping

**What**: Store known contract ABIs for better decoding

**Table**:
```prisma
model ContractABI {
  address     String @id
  abi         Json
  createdAt   DateTime @default(now())
}
```

---

## Example Usage

### Frontend Display

```jsx
function TransactionMethodBadge({ tx }) {
  // Show method ID with tooltip
  if (!tx.methodId) {
    return <Badge>ETH Transfer</Badge>;
  }

  if (tx.functionSignature) {
    return (
      <Tooltip title={tx.methodId}>
        <Badge>{tx.functionSignature}</Badge>
      </Tooltip>
    );
  }

  return <Badge>{tx.methodId}</Badge>;
}
```

### Analytics Query

```sql
-- Most popular contract functions
SELECT
  methodId,
  functionSignature,
  COUNT(*) as count,
  COUNT(DISTINCT "from") as unique_callers
FROM transactions
WHERE methodId IS NOT NULL
GROUP BY methodId, functionSignature
ORDER BY count DESC
LIMIT 20;
```

---

## Benefits

1. **User Experience**: Users can see what function was called (like Etherscan)
2. **Analytics**: Track popular contract interactions
3. **Filtering**: Filter transactions by method type
4. **Debugging**: Identify contract call patterns
5. **Monitoring**: Alert on specific method calls

---

## Deployment

### Migration Steps

```bash
# Apply database migration
npx prisma migrate deploy

# Rebuild application
docker-compose down
docker-compose up --build -d
```

### Backfilling Existing Data (Optional)

If you want to add method IDs to existing transactions:

```sql
-- Update existing transactions with method IDs
UPDATE transactions
SET "methodId" = LEFT(input, 10)
WHERE input IS NOT NULL
  AND LENGTH(input) >= 10
  AND "methodId" IS NULL;
```

**Note**: This will add method IDs to all historical transactions.

---

## Testing

### Test Cases

1. **Simple ETH Transfer** (no methodId)
   ```
   input: "0x"
   methodId: null
   ```

2. **ERC20 Transfer**
   ```
   input: "0xa9059cbb000000..."
   methodId: "0xa9059cbb"
   ```

3. **Contract Deployment**
   ```
   input: "0x60806040..." (long bytecode)
   methodId: "0x60806040"
   ```

4. **Short Input** (< 10 chars)
   ```
   input: "0xabc"
   methodId: null
   ```

### API Test

```bash
# Get transaction and check methodId field
curl http://localhost:9009/api/transactions/0x{hash}

# Should see:
# {
#   ...
#   "methodId": "0xa9059cbb",
#   "functionSignature": null,
#   ...
# }
```

---

## References

- [Ethereum Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html)
- [4byte.directory](https://www.4byte.directory/) - Function signature database
- [Etherscan Transaction Decoder](https://info.etherscan.com/understanding-an-ethereum-transaction/)

---

## Summary

✅ **Implemented**: Method ID extraction and storage
✅ **Database**: New fields `methodId` and `functionSignature`
✅ **API**: Automatic inclusion in all transaction endpoints
✅ **Indexed**: Can filter transactions by method ID
⏳ **Future**: 4byte.directory integration for function signatures
⏳ **Future**: Parameter decoding with ABI

**Status**: Production ready for method ID capture. Function signature resolution can be added later.
