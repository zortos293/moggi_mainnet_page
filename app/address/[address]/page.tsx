import {
  getAddress,
  getAddressTransactions,
  getAddressTokenBalances,
  getAddressTokenTransfers,
  getAddressMetadata,
  getAddressNFTs,
  getAddressNFTTransfers,
  getAddressInternalTransactions,
  getContractMetadata,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  FileCode,
  Copy,
  ArrowUpRight,
  ArrowDownLeft,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Globe,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { formatEther, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';

export const dynamic = 'force-dynamic';

interface AddressPageProps {
  params: Promise<{ address: string }>;
  searchParams: Promise<{
    historyPage?: string;
    transfersPage?: string;
    tokensPage?: string;
    nftsPage?: string;
    tab?: string;
  }>;
}

export default async function AddressPage({ params, searchParams }: AddressPageProps) {
  const { address } = await params;
  const search = await searchParams;

  const historyPage = parseInt(search.historyPage || '1', 10);
  const transfersPage = parseInt(search.transfersPage || '1', 10);
  const tokensPage = parseInt(search.tokensPage || '1', 10);
  const nftsPage = parseInt(search.nftsPage || '1', 10);
  const activeTab = search.tab || 'history';

  let addressData;
  let metadata;
  let contractMetadata;
  let transactions;
  let tokenBalances;
  let tokenTransfers;
  let nfts;
  let error;

  try {
    [
      addressData,
      metadata,
      contractMetadata,
      transactions,
      tokenBalances,
      tokenTransfers,
      nfts,
    ] = await Promise.all([
      getAddress(address),
      getAddressMetadata(address).catch(() => null),
      getContractMetadata(address).catch(() => null),
      getAddressTransactions(address, historyPage, 20),
      getAddressTokenBalances(address, tokensPage, 20),
      getAddressTokenTransfers(address, transfersPage, 20),
      getAddressNFTs(address, nftsPage, 20).catch(() => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } })),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load address';
  }

  if (error || !addressData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
            <h2 className="text-red-600 dark:text-red-500 font-bold text-lg">Error</h2>
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Address not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {contractMetadata?.protocol?.logoUrl ? (
              <img
                src={contractMetadata.protocol.logoUrl}
                alt={contractMetadata.protocol.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="p-3 bg-[#ff66c4] rounded-lg">
                {addressData.isContract ? (
                  <FileCode className="h-6 w-6 text-white" />
                ) : (
                  <Wallet className="h-6 w-6 text-white" />
                )}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {contractMetadata?.contractName || contractMetadata?.nickname ? (
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {contractMetadata.nickname || contractMetadata.contractName}
                  </h1>
                ) : (
                  <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                    {truncateHash(address, 6, 6)}
                  </h1>
                )}
                <CopyButton text={address} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                  {addressData.isContract ? 'CONTRACT' : 'WALLET'}
                </Badge>
                {contractMetadata?.protocol && (
                  <Badge className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-0">
                    <Layers className="h-3 w-3 mr-1" />
                    {contractMetadata.protocol.name}
                  </Badge>
                )}
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 break-all">
                {address}
              </div>
              {contractMetadata?.protocol && (
                <div className="flex items-center gap-2 mt-2">
                  {contractMetadata.protocol.website && (
                    <a
                      href={contractMetadata.protocol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4] flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contractMetadata.protocol.docs && (
                    <a
                      href={contractMetadata.protocol.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      Docs
                    </a>
                  )}
                  {contractMetadata.protocol.github && (
                    <a
                      href={contractMetadata.protocol.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )}
              {contractMetadata?.notes && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 max-w-lg">
                  {contractMetadata.notes}
                </p>
              )}
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Contract Banner */}
        {addressData.isContract && (
          <div className="border border-[#ff66c4]/30 bg-[#ff66c4]/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-[#ff66c4]" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  This address is a smart contract
                </span>
              </div>
              <Link href={`/contract/${address}`}>
                <Button size="sm" className="bg-[#ff66c4] hover:bg-pink-500 text-white">
                  View Contract Details
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">MON BALANCE</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatEther(addressData.balance)} <span className="text-lg text-zinc-500 dark:text-zinc-400">MON</span>
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TRANSACTIONS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatNumber(addressData.transactionCount)}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TOKEN BALANCE</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {tokenBalances?.data.length || 0} <span className="text-lg text-zinc-500 dark:text-zinc-400">Tokens</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 rounded-none w-full justify-start h-auto p-0 gap-0">
            <Link href={`/address/${address}?tab=history&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                HISTORY
              </TabsTrigger>
            </Link>
            <Link href={`/address/${address}?tab=transfers&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}>
              <TabsTrigger
                value="transfers"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                TRANSFERS
              </TabsTrigger>
            </Link>
            <Link href={`/address/${address}?tab=tokens&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}>
              <TabsTrigger
                value="tokens"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <Coins className="h-4 w-4 mr-2" />
                TOKENS
              </TabsTrigger>
            </Link>
            <Link href={`/address/${address}?tab=nfts&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}>
              <TabsTrigger
                value="nfts"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                NFTS
              </TabsTrigger>
            </Link>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Account transactions</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">INFO</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TIME</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">METHOD</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">HASH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {transactions && transactions.data.length > 0 ? (
                      transactions.data.map((tx) => {
                        const isOutgoing = tx.from.toLowerCase() === address.toLowerCase();
                        const isFailed = tx.status === false;
                        const isContractInteraction = tx.methodId && tx.methodId !== '0x';

                        return (
                          <tr key={tx.hash} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${tx.hash}`} className="flex items-center gap-2">
                                {isFailed ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : isContractInteraction ? (
                                  <FileCode className="h-4 w-4 text-[#ff66c4]" />
                                ) : isOutgoing ? (
                                  <ArrowUpRight className="h-4 w-4 text-[#ff66c4]" />
                                ) : (
                                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                  {isFailed ? 'Failed' : isContractInteraction ? 'Interact' : isOutgoing ? 'Sent' : 'Received'}
                                </span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${tx.hash}`} className="flex items-center gap-2">
                                <span className={`text-sm font-mono ${isOutgoing ? 'text-[#ff66c4]' : 'text-green-600 dark:text-green-400'}`}>
                                  {isOutgoing ? '-' : '+'} {formatEther(tx.value)}
                                </span>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">MON</span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${tx.hash}`}>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatTimeAgo(tx.timestamp)}</span>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${tx.hash}`}>
                                {tx.eventName ? (
                                  <Badge variant="outline" className="text-xs font-mono bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700 text-[#ff66c4]">
                                    {tx.eventName}
                                  </Badge>
                                ) : tx.logs && tx.logs.length > 0 && tx.logs.some(log => log.eventName) ? (
                                  <Badge variant="outline" className="text-xs font-mono bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700 text-[#ff66c4]">
                                    {tx.logs.find(log => log.eventName)?.eventName}
                                  </Badge>
                                ) : tx.methodId && tx.methodId !== '0x' ? (
                                  <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                                    {tx.functionSignature ? tx.functionSignature.split('(')[0] : tx.methodId.slice(0, 10)}
                                  </Badge>
                                ) : (
                                  <span className="text-zinc-400 dark:text-zinc-600">-</span>
                                )}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 flex items-center gap-1">
                                {truncateHash(tx.hash, 4, 4)}
                                <Copy className="h-3 w-3 opacity-50" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactions?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{transactions.pagination.total}</span> transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/address/${address}?tab=history&historyPage=${Math.max(1, historyPage - 1)}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${historyPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {historyPage} of {transactions.pagination.totalPages}
                    </span>
                    <Link
                      href={`/address/${address}?tab=history&historyPage=${Math.min(transactions.pagination.totalPages, historyPage + 1)}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${historyPage >= transactions.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transfers Tab */}
          <TabsContent value="transfers" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Token transfers</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TX HASH</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TOKEN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM / TO</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">AMOUNT</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {tokenTransfers && tokenTransfers.data.length > 0 ? (
                      tokenTransfers.data.map((transfer) => {
                        const isOutgoing = transfer.from.toLowerCase() === address.toLowerCase();
                        return (
                          <tr key={`${transfer.transactionHash}-${transfer.logIndex}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/tx/${transfer.transactionHash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                                {truncateHash(transfer.transactionHash, 6, 4)}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/token/${transfer.tokenAddress}`}>
                                <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4] hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer">
                                  {transfer.token.symbol}
                                </Badge>
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {isOutgoing ? (
                                  <ArrowUpRight className="h-4 w-4 text-[#ff66c4]" />
                                ) : (
                                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                  {isOutgoing ? 'Out' : 'In'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs space-y-0.5">
                                <div>
                                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">From:</span>{' '}
                                  <Link href={`/address/${transfer.from}`} className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff66c4]">
                                    {truncateHash(transfer.from, 6, 4)}
                                  </Link>
                                </div>
                                <div>
                                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">To:</span>{' '}
                                  <Link href={`/address/${transfer.to}`} className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff66c4]">
                                    {truncateHash(transfer.to, 6, 4)}
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className={`text-sm font-mono font-semibold ${isOutgoing ? 'text-[#ff66c4]' : 'text-green-600 dark:text-green-400'}`}>
                                {isOutgoing ? '-' : '+'}{(Number(transfer.value) / Math.pow(10, transfer.token.decimals)).toLocaleString('en-US', { maximumFractionDigits: 4 })}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-zinc-500 dark:text-zinc-400">{formatTimeAgo(transfer.timestamp)}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No token transfers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {tokenTransfers?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{tokenTransfers.pagination.total}</span> transfers
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/address/${address}?tab=transfers&historyPage=${historyPage}&transfersPage=${Math.max(1, transfersPage - 1)}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${transfersPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {transfersPage} of {tokenTransfers.pagination.totalPages}
                    </span>
                    <Link
                      href={`/address/${address}?tab=transfers&historyPage=${historyPage}&transfersPage=${Math.min(tokenTransfers.pagination.totalPages, transfersPage + 1)}&tokensPage=${tokensPage}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${transfersPage >= tokenTransfers.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tokens Tab */}
          <TabsContent value="tokens" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Token balances</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TOKEN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">CONTRACT</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">BALANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {tokenBalances && tokenBalances.data.length > 0 ? (
                      tokenBalances.data.map((balance) => (
                        <tr key={balance.tokenAddress} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/token/${balance.tokenAddress}`} className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{balance.token.name}</span>
                              <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">
                                {balance.token.symbol}
                              </Badge>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/token/${balance.tokenAddress}`}>
                              <span className="text-sm font-mono text-zinc-500 dark:text-zinc-400">{truncateHash(balance.tokenAddress, 8, 6)}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Link href={`/token/${balance.tokenAddress}`}>
                              <span className="text-sm font-mono font-semibold text-green-600 dark:text-green-400">
                                {(Number(balance.balance) / Math.pow(10, balance.token.decimals)).toLocaleString('en-US', { maximumFractionDigits: 4 })}
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">No tokens found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {tokenBalances?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{tokenBalances.pagination.total}</span> tokens
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/address/${address}?tab=tokens&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${Math.max(1, tokensPage - 1)}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${tokensPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {tokensPage} of {tokenBalances.pagination.totalPages}
                    </span>
                    <Link
                      href={`/address/${address}?tab=tokens&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${Math.min(tokenBalances.pagination.totalPages, tokensPage + 1)}&nftsPage=${nftsPage}`}
                      className={`p-2 rounded border ${tokensPage >= tokenBalances.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">NFT holdings</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">COLLECTION</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TOKEN ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {nfts && nfts.data.length > 0 ? (
                      nfts.data.map((nft) => (
                        <tr key={`${nft.collectionAddress}-${nft.tokenId}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{nft.collection?.name || 'Unknown'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-mono text-[#ff66c4]">#{nft.tokenId}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                              {nft.collection?.tokenType || 'ERC721'}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">No NFTs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {nfts?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{nfts.pagination.total}</span> NFTs
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/address/${address}?tab=nfts&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${Math.max(1, nftsPage - 1)}`}
                      className={`p-2 rounded border ${nftsPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {nftsPage} of {nfts.pagination.totalPages}
                    </span>
                    <Link
                      href={`/address/${address}?tab=nfts&historyPage=${historyPage}&transfersPage=${transfersPage}&tokensPage=${tokensPage}&nftsPage=${Math.min(nfts.pagination.totalPages, nftsPage + 1)}`}
                      className={`p-2 rounded border ${nftsPage >= nfts.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
