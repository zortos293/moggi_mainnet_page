import { getToken, getTokenTransfers, getTokenHolders } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, Users, ArrowRightLeft, ArrowLeft, Clock, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNumber, truncateHash, formatTimeAgo } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface TokenPageProps {
  params: Promise<{ address: string }>;
  searchParams: Promise<{
    transfersPage?: string;
    holdersPage?: string;
    tab?: string;
  }>;
}

export default async function TokenPage({ params, searchParams }: TokenPageProps) {
  const { address } = await params;
  const search = await searchParams;

  const transfersPage = parseInt(search.transfersPage || '1', 10);
  const holdersPage = parseInt(search.holdersPage || '1', 10);
  const activeTab = search.tab || 'transfers';

  let token;
  let transfers;
  let holders;
  let error;

  try {
    [token, transfers, holders] = await Promise.all([
      getToken(address),
      getTokenTransfers(address, transfersPage, 20).catch(() => null),
      getTokenHolders(address, holdersPage, 20).catch(() => null),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load token';
  }

  if (error || !token) {
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
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Token not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatTokenAmount = (amount: string, decimals: number = 18) => {
    const value = Number(amount) / Math.pow(10, decimals);
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#ff66c4] rounded-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {token.name}
                </h1>
                <Badge variant="outline" className="text-sm bg-transparent border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">
                  {token.symbol}
                </Badge>
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 break-all">
                  {token.address}
                </span>
                <Badge variant="outline" className="text-xs bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                  {token.tokenType}
                </Badge>
              </div>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TOTAL SUPPLY</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatTokenAmount(token.totalSupply, token.decimals || 18)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{token.symbol}</div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">HOLDERS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatNumber(token.holderCount)}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TRANSFERS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatNumber(token.transferCount)}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">DECIMALS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {token.decimals || 18}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 rounded-none w-full justify-start h-auto p-0 gap-0">
            <Link href={`/token/${address}?tab=transfers&transfersPage=${transfersPage}&holdersPage=${holdersPage}`}>
              <TabsTrigger
                value="transfers"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                TRANSFERS ({transfers?.pagination.total || 0})
              </TabsTrigger>
            </Link>
            <Link href={`/token/${address}?tab=holders&transfersPage=${transfersPage}&holdersPage=${holdersPage}`}>
              <TabsTrigger
                value="holders"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <Users className="h-4 w-4 mr-2" />
                HOLDERS ({holders?.pagination.total || 0})
              </TabsTrigger>
            </Link>
          </TabsList>

          {/* Transfers Tab */}
          <TabsContent value="transfers" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recent token transfers</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TX HASH</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TO</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">AMOUNT</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {transfers && transfers.data.length > 0 ? (
                      transfers.data.map((transfer) => (
                        <tr key={`${transfer.transactionHash}-${transfer.logIndex}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/tx/${transfer.transactionHash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                              {truncateHash(transfer.transactionHash, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/address/${transfer.from}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(transfer.from, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/address/${transfer.to}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(transfer.to, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-mono font-semibold text-zinc-700 dark:text-zinc-200">
                              {transfer.value ? (
                                formatTokenAmount(transfer.value, token.decimals || 18)
                              ) : transfer.tokenId ? (
                                `#${transfer.tokenId}`
                              ) : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatTimeAgo(transfer.timestamp)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No transfers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transfers?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{transfers.pagination.total}</span> transfers
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/token/${address}?tab=transfers&transfersPage=${Math.max(1, transfersPage - 1)}&holdersPage=${holdersPage}`}
                      className={`p-2 rounded border ${transfersPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {transfersPage} of {transfers.pagination.totalPages}
                    </span>
                    <Link
                      href={`/token/${address}?tab=transfers&transfersPage=${Math.min(transfers.pagination.totalPages, transfersPage + 1)}&holdersPage=${holdersPage}`}
                      className={`p-2 rounded border ${transfersPage >= transfers.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Holders Tab */}
          <TabsContent value="holders" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Top token holders</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">RANK</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">ADDRESS</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">BALANCE</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">PERCENTAGE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {holders && holders.data.length > 0 ? (
                      holders.data.map((holder, index) => {
                        const balance = Number(holder.balance) / Math.pow(10, token.decimals || 18);
                        const totalSupply = Number(token.totalSupply) / Math.pow(10, token.decimals || 18);
                        const percentage = totalSupply > 0 ? ((balance / totalSupply) * 100).toFixed(2) : '0';

                        return (
                          <tr key={holder.address} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                #{(holdersPage - 1) * 20 + index + 1}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link href={`/address/${holder.address}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                                {truncateHash(holder.address, 10, 8)}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-mono font-semibold text-zinc-700 dark:text-zinc-200">
                                {formatTokenAmount(holder.balance, token.decimals || 18)}
                              </span>
                              <span className="text-xs text-zinc-500 ml-1">{token.symbol}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">
                                {percentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">No holders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {holders?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{holders.pagination.total}</span> holders
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/token/${address}?tab=holders&transfersPage=${transfersPage}&holdersPage=${Math.max(1, holdersPage - 1)}`}
                      className={`p-2 rounded border ${holdersPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {holdersPage} of {holders.pagination.totalPages}
                    </span>
                    <Link
                      href={`/token/${address}?tab=holders&transfersPage=${transfersPage}&holdersPage=${Math.min(holders.pagination.totalPages, holdersPage + 1)}`}
                      className={`p-2 rounded border ${holdersPage >= holders.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
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
