import { getAddress, getAddressTransactions, getAddressTokenBalances, getAddressTokenTransfers } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Coins, ArrowRightLeft, CheckCircle2, XCircle, ArrowLeft, Box } from 'lucide-react';
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
  let transactions;
  let tokenBalances;
  let tokenTransfers;
  let error;

  try {
    [addressData, transactions, tokenBalances, tokenTransfers] = await Promise.all([
      getAddress(address),
      getAddressTransactions(address, 1, 20),
      getAddressTokenBalances(address, 1, 50),
      getAddressTokenTransfers(address, 1, 20),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load address';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-6xl">
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
        <div className="mx-auto max-w-6xl">
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
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6 text-green-600" />
                  <CardTitle className="text-2xl">{addressData.isContract ? 'Contract' : 'Address'}</CardTitle>
                </div>
                <code className="text-sm font-mono break-all block">{addressData.address}</code>
              </div>
              {addressData.isContract && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  Contract
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Balance
                  </span>
                  <span className="text-2xl font-bold">{formatEther(addressData.balance)} MON</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Transactions</span>
                  <span className="text-2xl font-bold">{formatNumber(addressData.transactionCount)}</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">First Seen</span>
                  <Link href={`/block/${addressData.firstSeenBlock}`} className="text-sm text-blue-600 hover:underline">
                    Block #{formatNumber(addressData.firstSeenBlock)}
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Last Seen</span>
                  <Link href={`/block/${addressData.lastSeenBlock}`} className="text-sm text-blue-600 hover:underline">
                    Block #{formatNumber(addressData.lastSeenBlock)}
                  </Link>
                </div>
              </div>

              {addressData.isContract && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contract Information</h3>
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
                            {truncateHash(addressData.contractCreationTx, 10, 8)}
                          </Link>
                        </div>
                      )}
                    </div>

                    {addressData.contractCode && (
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Contract Bytecode</span>
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded border overflow-x-auto">
                          <code className="text-xs font-mono break-all">
                            {addressData.contractCode.slice(0, 200)}
                            {addressData.contractCode.length > 200 && '...'}
                          </code>
                        </div>
                        {addressData.contractCode.length > 200 && (
                          <span className="text-xs text-zinc-500">
                            Showing first 200 characters of {addressData.contractCode.length} total
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">
              Transactions ({transactions?.pagination?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="tokens">
              Token Balances ({tokenBalances?.data?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="transfers">
              Token Transfers ({tokenTransfers?.pagination?.total || 0})
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
                    {tokenTransfers.data.map((transfer, index) => (
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
        </Tabs>
      </div>
    </div>
  );
}
