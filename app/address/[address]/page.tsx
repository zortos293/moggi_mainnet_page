import {
  getAddress,
  getAddressTransactions,
  getAddressTokenBalances,
  getAddressTokenTransfers,
  getAddressMetadata,
  getAddressNFTs,
  getAddressNFTTransfers,
  getAddressInternalTransactions
} from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Box,
  ExternalLink,
  Globe,
  Github,
  Twitter,
  BookOpen,
  Shield,
  ImageIcon,
  Repeat
} from 'lucide-react';
import { formatEther, formatTimestamp, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface AddressPageProps {
  params: Promise<{ address: string }>;
}

export default async function AddressPage({ params }: AddressPageProps) {
  const { address } = await params;

  let addressData;
  let metadata;
  let transactions;
  let tokenBalances;
  let tokenTransfers;
  let nfts;
  let nftTransfers;
  let internalTxs;
  let error;

  try {
    [
      addressData,
      metadata,
      transactions,
      tokenBalances,
      tokenTransfers,
      nfts,
      nftTransfers,
      internalTxs
    ] = await Promise.all([
      getAddress(address),
      getAddressMetadata(address).catch(() => null),
      getAddressTransactions(address, 1, 20),
      getAddressTokenBalances(address, 1, 50),
      getAddressTokenTransfers(address, 1, 20),
      getAddressNFTs(address, 1, 20).catch(() => ({ data: [], count: 0 })),
      getAddressNFTTransfers(address, 1, 20).catch(() => ({ data: [], count: 0 })),
      getAddressInternalTransactions(address, 1, 20).catch(() => ({ data: [], count: 0 })),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load address';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Address</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle>Address Not Found</CardTitle>
              <CardDescription>Address {address} could not be found.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Header with Metadata */}
        <Card>
          <CardHeader>
            <div className="space-y-3">
              {/* Title and Badges */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Wallet className="h-5 w-5 text-green-600 flex-shrink-0" />
                    {metadata ? (
                      <>
                        <h1 className="text-2xl font-bold">{metadata.name}</h1>
                        {metadata.isVerified && (
                          <Badge variant="default" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                        {metadata.isCanonical && (
                          <Badge variant="secondary">
                            Canonical
                          </Badge>
                        )}
                      </>
                    ) : (
                      <h1 className="text-2xl font-bold">
                        {addressData.isContract ? 'Contract' : 'Address'}
                      </h1>
                    )}
                  </div>

                  {/* Symbol, Category, and Project */}
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    {metadata?.symbol && (
                      <Badge variant="outline" className="font-mono">{metadata.symbol}</Badge>
                    )}
                    {metadata?.category && (
                      <span className="text-zinc-600 dark:text-zinc-400">{metadata.category}</span>
                    )}
                    {metadata?.projectName && (
                      <>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-600 dark:text-zinc-400">{metadata.projectName}</span>
                      </>
                    )}
                    {addressData.isContract && !metadata && (
                      <Badge variant="secondary">Contract</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address */}
              <div className="space-y-1">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">ADDRESS</div>
                <code className="text-sm font-mono break-all block text-zinc-900 dark:text-zinc-100">
                  {addressData.address}
                </code>
              </div>

              {/* Description */}
              {metadata?.description && (
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {metadata.description}
                </p>
              )}

              {/* Social Links */}
              {metadata && (metadata.website || metadata.twitter || metadata.github || metadata.docs) && (
                <>
                  <Separator />
                  <div className="flex items-center gap-4 flex-wrap">
                    {metadata.website && (
                      <a
                        href={metadata.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {metadata.twitter && (
                      <a
                        href={metadata.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {metadata.github && (
                      <a
                        href={metadata.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {metadata.docs && (
                      <a
                        href={metadata.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Docs</span>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Balance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatEther(addressData.balance)} MON</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(addressData.transactionCount)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>First Seen</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/block/${addressData.firstSeenBlock}`} className="text-lg font-semibold text-blue-600 hover:underline">
                Block #{formatNumber(addressData.firstSeenBlock)}
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Last Seen</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/block/${addressData.lastSeenBlock}`} className="text-lg font-semibold text-blue-600 hover:underline">
                Block #{formatNumber(addressData.lastSeenBlock)}
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contract Information */}
        {addressData.isContract && (
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addressData.contractCreator && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Creator</span>
                    <Link href={`/address/${addressData.contractCreator}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                      {addressData.contractCreator}
                    </Link>
                  </div>
                )}

                {addressData.contractCreationTx && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Deployment Transaction</span>
                    <Link href={`/tx/${addressData.contractCreationTx}`} className="text-sm font-mono text-blue-600 hover:underline break-all">
                      {truncateHash(addressData.contractCreationTx, 12, 10)}
                    </Link>
                  </div>
                )}
              </div>

              {addressData.contractCode && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Contract Bytecode</span>
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg border overflow-x-auto">
                    <code className="text-xs font-mono break-all text-zinc-700 dark:text-zinc-300">
                      {addressData.contractCode.slice(0, 300)}
                      {addressData.contractCode.length > 300 && '...'}
                    </code>
                  </div>
                  {addressData.contractCode.length > 300 && (
                    <span className="text-xs text-zinc-500">
                      Showing first 300 characters of {addressData.contractCode.length} total
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="transactions">
              <span className="hidden sm:inline">Transactions</span>
              <span className="sm:hidden">Txs</span>
              <span className="ml-1">({transactions?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="internal">
              <span className="hidden sm:inline">Internal</span>
              <span className="sm:hidden">Int</span>
              <span className="ml-1">({internalTxs?.pagination?.total || internalTxs?.count || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="tokens">
              <span className="hidden sm:inline">Tokens</span>
              <span className="sm:hidden">ERC20</span>
              <span className="ml-1">({tokenBalances?.data?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="transfers">
              <span className="hidden sm:inline">Transfers</span>
              <span className="sm:hidden">Trans</span>
              <span className="ml-1">({tokenTransfers?.pagination?.total || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="nfts">
              <span className="hidden sm:inline">NFTs</span>
              <span className="sm:hidden">NFT</span>
              <span className="ml-1">({nfts?.pagination?.total || nfts?.count || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="nft-transfers">
              <span className="hidden sm:inline">NFT Transfers</span>
              <span className="sm:hidden">NFT Tx</span>
              <span className="ml-1">({nftTransfers?.pagination?.total || nftTransfers?.count || 0})</span>
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Transactions
                </CardTitle>
                <CardDescription>All transactions involving this address</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions && transactions.data.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.data.map((tx) => (
                      <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-blue-600 hover:underline truncate">
                              {truncateHash(tx.hash, 10, 8)}
                            </Link>
                            {tx.status !== undefined && (
                              <Badge variant={tx.status ? 'default' : 'destructive'} className="text-xs">
                                {tx.status ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Link href={`/block/${tx.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              {formatNumber(tx.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(tx.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>From: {truncateHash(tx.from)}</span>
                            <span>→</span>
                            <span>To: {tx.to ? truncateHash(tx.to) : 'Contract Creation'}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">{formatEther(tx.value)} MON</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No transactions found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Internal Transactions Tab */}
          <TabsContent value="internal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Repeat className="h-5 w-5" />
                  Internal Transactions
                </CardTitle>
                <CardDescription>Internal contract-to-contract transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {internalTxs && internalTxs.data.length > 0 ? (
                  <div className="space-y-3">
                    {internalTxs.data.map((tx, idx) => (
                      <div key={`${tx.transactionHash}-${idx}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            {tx.transactionHash && (
                              <Link href={`/tx/${tx.transactionHash}`} className="text-sm font-mono text-blue-600 hover:underline truncate">
                                {truncateHash(tx.transactionHash, 10, 8)}
                              </Link>
                            )}
                            <Badge variant="outline" className="text-xs">{tx.type}</Badge>
                          </div>
                          {tx.blockNumber && tx.timestamp && (
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <Link href={`/block/${tx.blockNumber}`} className="hover:underline flex items-center gap-1">
                                <Box className="h-3 w-3" />
                                {formatNumber(tx.blockNumber)}
                              </Link>
                              <span>•</span>
                              <span>{formatTimeAgo(tx.timestamp)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>From: {truncateHash(tx.from)}</span>
                            <span>→</span>
                            <span>To: {truncateHash(tx.to)}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">{formatEther(tx.value)} MON</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No internal transactions found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Token Balances Tab */}
          <TabsContent value="tokens" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Token Balances
                </CardTitle>
                <CardDescription>ERC-20 tokens held by this address</CardDescription>
              </CardHeader>
              <CardContent>
                {tokenBalances && tokenBalances.data.length > 0 ? (
                  <div className="space-y-3">
                    {tokenBalances.data.map((balance) => (
                      <div key={balance.tokenAddress} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{balance.token.name}</span>
                            <Badge variant="outline">{balance.token.symbol}</Badge>
                          </div>
                          <Link href={`/address/${balance.tokenAddress}`} className="text-xs font-mono text-blue-600 hover:underline block">
                            {balance.tokenAddress}
                          </Link>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">
                            {(Number(balance.balance) / Math.pow(10, balance.token.decimals)).toLocaleString('en-US', {
                              maximumFractionDigits: 4,
                            })}
                          </div>
                          <div className="text-xs text-zinc-500">{balance.token.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No token balances found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Token Transfers Tab */}
          <TabsContent value="transfers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Token Transfers
                </CardTitle>
                <CardDescription>ERC-20 token transfer history</CardDescription>
              </CardHeader>
              <CardContent>
                {tokenTransfers && tokenTransfers.data.length > 0 ? (
                  <div className="space-y-3">
                    {tokenTransfers.data.map((transfer) => (
                      <div key={`${transfer.transactionHash}-${transfer.logIndex}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{transfer.token.symbol}</Badge>
                            <Link href={`/tx/${transfer.transactionHash}`} className="text-sm font-mono text-blue-600 hover:underline truncate">
                              {truncateHash(transfer.transactionHash, 8, 6)}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Link href={`/block/${transfer.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              {formatNumber(transfer.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(transfer.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>From: {truncateHash(transfer.from)}</span>
                            <span>→</span>
                            <span>To: {truncateHash(transfer.to)}</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-sm font-medium">
                            {(Number(transfer.value) / Math.pow(10, transfer.token.decimals)).toLocaleString('en-US', {
                              maximumFractionDigits: 4,
                            })}
                          </div>
                          <div className="text-xs text-zinc-500">{transfer.token.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No token transfers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  NFT Holdings
                </CardTitle>
                <CardDescription>ERC-721 and ERC-1155 tokens owned by this address</CardDescription>
              </CardHeader>
              <CardContent>
                {nfts && nfts.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.data.map((nft) => (
                      <div key={`${nft.collectionAddress}-${nft.tokenId}`} className="p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {nft.collection?.name && (
                              <span className="font-medium text-sm">{nft.collection.name}</span>
                            )}
                            {nft.collection?.tokenType && (
                              <Badge variant="outline" className="text-xs">
                                {nft.collection.tokenType}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Token ID: <span className="font-mono">{nft.tokenId}</span>
                          </div>
                          {nft.amount && nft.amount !== '1' && (
                            <div className="text-xs text-zinc-500">
                              Amount: {nft.amount}
                            </div>
                          )}
                          <Link href={`/address/${nft.collectionAddress}`} className="text-xs font-mono text-blue-600 hover:underline block break-all">
                            {truncateHash(nft.collectionAddress, 10, 8)}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No NFTs found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Transfers Tab */}
          <TabsContent value="nft-transfers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  NFT Transfers
                </CardTitle>
                <CardDescription>NFT transfer history for this address</CardDescription>
              </CardHeader>
              <CardContent>
                {nftTransfers && nftTransfers.data.length > 0 ? (
                  <div className="space-y-3">
                    {nftTransfers.data.map((transfer, idx) => (
                      <div key={`${transfer.transactionHash}-${transfer.tokenId}-${idx}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            {transfer.collection?.name && (
                              <span className="font-medium text-sm">{transfer.collection.name}</span>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {transfer.tokenType}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">Token ID: {transfer.tokenId}</span>
                            <Link href={`/tx/${transfer.transactionHash}`} className="text-xs font-mono text-blue-600 hover:underline">
                              {truncateHash(transfer.transactionHash, 8, 6)}
                            </Link>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Link href={`/block/${transfer.blockNumber}`} className="hover:underline flex items-center gap-1">
                              <Box className="h-3 w-3" />
                              {formatNumber(transfer.blockNumber)}
                            </Link>
                            <span>•</span>
                            <span>{formatTimeAgo(transfer.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>From: {truncateHash(transfer.from)}</span>
                            <span>→</span>
                            <span>To: {truncateHash(transfer.to)}</span>
                          </div>
                        </div>
                        {transfer.amount && transfer.amount !== '1' && (
                          <div className="ml-4 text-right">
                            <div className="text-sm font-medium">×{transfer.amount}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">No NFT transfers found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
