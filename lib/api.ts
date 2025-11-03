const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Block {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  miner: string;
  gasLimit: string;
  gasUsed: string;
  baseFeePerGas: string;
  difficulty: string;
  totalDifficulty: string;
  transactionCount: number;
  nonce?: string;
  sha3Uncles?: string;
  logsBloom?: string;
  transactionsRoot?: string;
  stateRoot?: string;
  receiptsRoot?: string;
  extraData?: string;
  size?: number;
  transactions?: Transaction[];
}

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  gas: string;
  gasPrice?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  gasUsed: string;
  cumulativeGasUsed?: string;
  effectiveGasPrice?: string;
  blockNumber: string;
  blockHash?: string;
  timestamp: string;
  transactionIndex: number;
  nonce: number;
  input?: string;
  methodId?: string;
  functionSignature?: string;
  status?: boolean;
  type?: number;
  chainId?: number;
  accessList?: { address: string; storageKeys: string[] }[];
  authorizationList?: { chainId: string; address: string; nonce: string; v: string; r: string; s: string }[];
  v?: string;
  r?: string;
  s?: string;
  logs?: Log[];
  internalTransactions?: InternalTransaction[];
}

export interface Log {
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
  blockNumber: string;
  transactionHash: string;
}

export interface InternalTransaction {
  from: string;
  to: string;
  value: string;
  gas: string;
  gasUsed: string;
  type: string;
  transactionHash?: string;
  blockNumber?: string;
  timestamp?: string;
}

export interface Address {
  address: string;
  balance: string;
  transactionCount: number;
  firstSeenBlock: string;
  lastSeenBlock: string;
  isContract: boolean;
  contractCode: string | null;
  contractCreator: string | null;
  contractCreationTx: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TokenBalance {
  tokenAddress: string;
  holderAddress: string;
  balance: string;
  token: Token;
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: string;
  transferCount?: number;
  holderCount?: number;
  createdAt?: string;
}

export interface TokenTransfer {
  from: string;
  to: string;
  value: string;
  tokenAddress: string;
  transactionHash: string;
  blockNumber: string;
  timestamp: string;
  logIndex: number;
  token: Token;
}

export interface AddressMetadata {
  address: string;
  name: string;
  label: string;
  symbol?: string;
  category?: string;
  entityType?: string;
  isToken?: boolean;
  tokenStandard?: string;
  decimals?: number;
  projectName?: string;
  isCanonical?: boolean;
  isVerified?: boolean;
  description?: string;
  website?: string;
  twitter?: string;
  github?: string;
  docs?: string;
  logoUri?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NFTCollection {
  address: string;
  name: string;
  symbol: string;
  tokenType: 'ERC721' | 'ERC1155';
  totalSupply?: string;
  contractUri?: string;
  transferCount?: number;
  holderCount?: number;
  createdAt?: string;
}

export interface NFTToken {
  collectionAddress: string;
  tokenId: string;
  owner?: string;
  owners?: { owner: string; amount: string }[];
  tokenUri?: string;
  metadata?: string;
  amount?: string;
  collection?: NFTCollection;
}

export interface NFTTransfer {
  collectionAddress: string;
  tokenId: string;
  from: string;
  to: string;
  amount: string;
  tokenType: 'ERC721' | 'ERC1155';
  transactionHash: string;
  blockNumber: string;
  timestamp: string;
  collection?: NFTCollection;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  count?: number;
}

// Block API
export async function getBlock(blockNumber: string): Promise<Block> {
  const res = await fetch(`${API_BASE_URL}/api/blocks/${blockNumber}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch block: ${res.statusText}`);
  return res.json();
}

export async function getBlockByHash(blockHash: string): Promise<Block> {
  const res = await fetch(`${API_BASE_URL}/api/blocks/hash/${blockHash}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch block: ${res.statusText}`);
  return res.json();
}

export async function getLatestBlocks(limit: number = 10): Promise<PaginatedResponse<Block>> {
  const res = await fetch(`${API_BASE_URL}/api/blocks/latest?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch latest blocks: ${res.statusText}`);
  return res.json();
}

// Transaction API
export async function getTransaction(txHash: string): Promise<Transaction> {
  const res = await fetch(`${API_BASE_URL}/api/transactions/${txHash}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch transaction: ${res.statusText}`);
  return res.json();
}

export async function getLatestTransactions(limit: number = 10): Promise<PaginatedResponse<Transaction>> {
  const res = await fetch(`${API_BASE_URL}/api/transactions/latest?limit=${limit}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch latest transactions: ${res.statusText}`);
  return res.json();
}

// Address API
export async function getAddress(address: string): Promise<Address> {
  const res = await fetch(`${API_BASE_URL}/api/addresses/${address}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch address: ${res.statusText}`);
  return res.json();
}

export async function getAddressTransactions(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Transaction>> {
  const res = await fetch(
    `${API_BASE_URL}/api/addresses/${address}/transactions?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch address transactions: ${res.statusText}`);
  return res.json();
}

export async function getAddressTokenBalances(
  address: string,
  page: number = 1,
  limit: number = 50
): Promise<PaginatedResponse<TokenBalance>> {
  const res = await fetch(
    `${API_BASE_URL}/api/addresses/${address}/token-balances?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch token balances: ${res.statusText}`);
  return res.json();
}

export async function getAddressTokenTransfers(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<TokenTransfer>> {
  const res = await fetch(
    `${API_BASE_URL}/api/addresses/${address}/token-transfers?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch token transfers: ${res.statusText}`);
  return res.json();
}

export async function getContracts(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Address>> {
  const res = await fetch(
    `${API_BASE_URL}/api/addresses/contracts/list?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch contracts: ${res.statusText}`);
  return res.json();
}

export async function getAddressInternalTransactions(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<InternalTransaction>> {
  const res = await fetch(
    `${API_BASE_URL}/api/addresses/${address}/internal-transactions?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch internal transactions: ${res.statusText}`);
  return res.json();
}

// Metadata API
export async function getAddressMetadata(address: string): Promise<AddressMetadata | null> {
  const res = await fetch(`${API_BASE_URL}/api/metadata/address/${address}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch address metadata: ${res.statusText}`);
  return res.json();
}

// NFT API
export async function getAddressNFTs(
  address: string,
  page: number = 1,
  limit: number = 20,
  type?: 'ERC721' | 'ERC1155'
): Promise<PaginatedResponse<NFTToken>> {
  const typeParam = type ? `&type=${type}` : '';
  const res = await fetch(
    `${API_BASE_URL}/api/nfts/address/${address}/nfts?page=${page}&limit=${limit}${typeParam}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch NFTs: ${res.statusText}`);
  return res.json();
}

export async function getAddressNFTTransfers(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<NFTTransfer>> {
  const res = await fetch(
    `${API_BASE_URL}/api/nfts/address/${address}/nft-transfers?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch NFT transfers: ${res.statusText}`);
  return res.json();
}
