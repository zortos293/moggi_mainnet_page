const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  eventName?: string;
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
  eventName?: string;
  eventSignature?: string;
  decodedParams?: Record<string, unknown>;
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
  // Protocol and metadata fields
  contractName?: string;
  nickname?: string;
  notes?: string;
  protocol?: {
    name: string;
    logoUrl?: string;
    website?: string;
  };
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
  tokenType?: 'ERC20' | 'ERC721';
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
  // Temporarily disabled - return null immediately
  return null;
  /*
  const res = await fetch(`${API_BASE_URL}/api/metadata/address/${address}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch address metadata: ${res.statusText}`);
  return res.json();
  */
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

// ABI & Function Decoding API
export interface ContractABI {
  address: string;
  abi: any[];
  name?: string;
  compiler?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DecodedFunction {
  methodId: string;
  signature: string;
  name: string;
  args: any[];
  decodedParams: Record<string, any>;
}

export interface FunctionSignature {
  id?: string;
  methodId: string;
  signature: string;
  verified?: boolean;
  occurrences?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getContractABI(address: string): Promise<ContractABI | null> {
  const res = await fetch(`${API_BASE_URL}/api/abis/${address}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch contract ABI: ${res.statusText}`);
  return res.json();
}

export async function decodeTransactionInput(
  contractAddress: string,
  inputData: string
): Promise<DecodedFunction | null> {
  const res = await fetch(`${API_BASE_URL}/api/abis/decode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractAddress, inputData }),
    cache: 'no-store',
  });
  if (res.status === 404 || !res.ok) return null;
  return res.json();
}

export async function getFunctionSignature(methodId: string): Promise<FunctionSignature | null> {
  const res = await fetch(`${API_BASE_URL}/api/abis/signatures/${methodId}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch function signature: ${res.statusText}`);
  return res.json();
}

// Enriched Transaction API
export interface EnrichedAddressLabel {
  address: string;
  name: string;
  label: string;
  isToken: boolean;
  isNFT: boolean;
  isContract: boolean;
  symbol?: string;
  verified?: boolean;
}

export interface EnrichedTokenTransfer {
  from: string;
  to: string;
  value: string;
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface EnrichedTransaction extends Transaction {
  methodName?: string;
  inputInformation?: {
    original: string;
    defaultView: string;
    decodeInputData?: Record<string, any>;
  };
  addressLabels?: Record<string, EnrichedAddressLabel>;
  erc20TokensTransferred?: EnrichedTokenTransfer[];
  erc721TokensTransferred?: any[];
  erc1155TokensTransferred?: any[];
  transactionFee?: string;
}

export async function getEnrichedTransaction(txHash: string): Promise<EnrichedTransaction> {
  const res = await fetch(`${API_BASE_URL}/api/transactions/${txHash}?enriched=true`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch enriched transaction: ${res.statusText}`);
  return res.json();
}

// Token API
export interface TokenDetail {
  address: string;
  name: string;
  symbol: string;
  decimals?: number;
  totalSupply: string;
  tokenType: 'ERC20' | 'ERC721';
  holderCount: number;
  transferCount: number;
}

export interface TokenTransferItem {
  from: string;
  to: string;
  value?: string;
  tokenId?: string;
  transactionHash: string;
  blockNumber: string;
  timestamp: string;
  logIndex: number;
}

export interface TokenHolder {
  address: string;
  balance: string;
}

export interface TokenTransfersResponse {
  data: TokenTransferItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals?: number;
  };
}

export interface TokenHoldersResponse {
  data: TokenHolder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals?: number;
  };
}

export async function getToken(address: string): Promise<TokenDetail> {
  const res = await fetch(`${API_BASE_URL}/api/tokens/${address}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch token: ${res.statusText}`);
  return res.json();
}

export async function getTokenTransfers(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<TokenTransfersResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/tokens/${address}/transfers?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch token transfers: ${res.statusText}`);
  return res.json();
}

export async function getTokenHolders(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<TokenHoldersResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/tokens/${address}/holders?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch token holders: ${res.statusText}`);
  return res.json();
}

export async function getTokensList(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Token>> {
  const res = await fetch(
    `${API_BASE_URL}/api/tokens?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch tokens list: ${res.statusText}`);
  return res.json();
}

// Stats API
export interface BlockchainStats {
  latestBlock: number;
  totalTransactions: number;
  totalContracts: number;
  totalErc20Tokens: number;
  totalErc721Tokens: number;
  totalAddresses?: number;
}

export async function getBlockchainStats(): Promise<BlockchainStats> {
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch blockchain stats: ${res.statusText}`);
  return res.json();
}

// Protocol and Contract Metadata Types
export interface Protocol {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  twitter?: string;
  github?: string;
  docs?: string;
  discord?: string;
  telegram?: string;
  isLive?: boolean;
  indexedAt?: string;
  contractCount?: number;
  contracts?: ProtocolContract[];
}

export interface ProtocolContract {
  address: string;
  contractName?: string;
  nickname?: string;
  notes?: string;
  creatorAddress?: string;
  creationTxHash?: string;
  creationBlockNumber?: string;
  isErc20?: boolean;
  isErc721?: boolean;
  isErc1155?: boolean;
  verified?: boolean;
  tokenInfo?: {
    name?: string;
    symbol?: string;
    decimals?: number;
  };
}

export interface ContractMetadata {
  address: string;
  contractName?: string;
  nickname?: string;
  notes?: string;
  indexedAt?: string;
  protocol?: {
    id: number;
    name: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    twitter?: string;
    github?: string;
    docs?: string;
    discord?: string;
    telegram?: string;
    isLive?: boolean;
  };
  creatorAddress?: string;
  creationTxHash?: string;
  creationBlockNumber?: string;
  isErc20?: boolean;
  isErc721?: boolean;
  isErc1155?: boolean;
  verified?: boolean;
}

// Protocol API Functions
export async function getProtocols(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<Protocol>> {
  const res = await fetch(
    `${API_BASE_URL}/api/protocols?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch protocols: ${res.statusText}`);
  return res.json();
}

export async function getProtocol(idOrName: string): Promise<Protocol> {
  const res = await fetch(`${API_BASE_URL}/api/protocols/${idOrName}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch protocol: ${res.statusText}`);
  return res.json();
}

export async function getProtocolContracts(
  idOrName: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<ProtocolContract> & { protocol: Protocol }> {
  const res = await fetch(
    `${API_BASE_URL}/api/protocols/${idOrName}/contracts?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch protocol contracts: ${res.statusText}`);
  return res.json();
}

// Contract Metadata API Functions
export async function getContractMetadata(address: string): Promise<ContractMetadata> {
  const res = await fetch(`${API_BASE_URL}/api/contracts/${address}/metadata`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Failed to fetch contract metadata: ${res.statusText}`);
  return res.json();
}

export async function getContractsWithMetadata(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<ContractMetadata>> {
  const res = await fetch(
    `${API_BASE_URL}/api/contracts/with-metadata?page=${page}&limit=${limit}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to fetch contracts with metadata: ${res.statusText}`);
  return res.json();
}

export async function searchContracts(
  protocol?: string,
  name?: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedResponse<ContractMetadata>> {
  const params = new URLSearchParams();
  if (protocol) params.append('protocol', protocol);
  if (name) params.append('name', name);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const res = await fetch(
    `${API_BASE_URL}/api/contracts/search?${params.toString()}`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Failed to search contracts: ${res.statusText}`);
  return res.json();
}
