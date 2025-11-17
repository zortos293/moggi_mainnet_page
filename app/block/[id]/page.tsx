import { getBlock } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Box, Clock, User, Zap, Database, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { formatEther, formatGwei, formatTimestamp, formatTimeAgo, truncateHash, formatNumber, formatBytes, calculatePercentage } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';

export const dynamic = 'force-dynamic';

interface BlockPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { id } = await params;

  let block;
  let error;

  try {
    block = await getBlock(id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load block';
  }

  if (error || !block) {
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
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Block not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const gasUsedPercentage = calculatePercentage(BigInt(block.gasUsed), BigInt(block.gasLimit));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#ff66c4] rounded-lg">
              <Box className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                  Block #{formatNumber(block.number)}
                </h1>
                <CopyButton text={block.number.toString()} />
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                <Clock className="h-4 w-4" />
                {formatTimestamp(block.timestamp)} ({formatTimeAgo(block.timestamp)})
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
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TRANSACTIONS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {block.transactionCount}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">GAS USED</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {gasUsedPercentage}%
            </div>
            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[#ff66c4] rounded-full transition-all"
                style={{ width: `${gasUsedPercentage}%` }}
              />
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">BASE FEE</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatGwei(block.baseFeePerGas)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Gwei</div>
          </div>

          {block.size && (
            <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#ff66c4] text-white text-xs font-mono">BLOCK SIZE</Badge>
              </div>
              <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
                {formatBytes(block.size)}
              </div>
            </div>
          )}
        </div>

        {/* Block Details */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Block Details</h3>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase">Block Hash</span>
              </div>
              <div className="col-span-3">
                <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 break-all">{block.hash}</code>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase">Parent Hash</span>
              </div>
              <div className="col-span-3">
                <code className="text-sm font-mono text-zinc-700 dark:text-zinc-300 break-all">{block.parentHash}</code>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Miner
                </span>
              </div>
              <div className="col-span-3">
                <Link href={`/address/${block.miner}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 break-all">
                  {block.miner}
                </Link>
              </div>
            </div>

            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1">
                <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Gas Used
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {formatNumber(block.gasUsed)} / {formatNumber(block.gasLimit)} ({gasUsedPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        {block.transactions && block.transactions.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Transactions ({block.transactionCount})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">INDEX</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TX HASH</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">METHOD</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM / TO</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">VALUE</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-zinc-500 uppercase">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {block.transactions.map((tx) => (
                    <tr key={tx.hash} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-zinc-500">#{tx.transactionIndex}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                          {truncateHash(tx.hash, 8, 6)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tx.eventName ? (
                          <Badge variant="outline" className="text-xs font-mono bg-pink-100 dark:bg-pink-900/50 border-pink-300 dark:border-pink-700 text-[#ff66c4]">
                            {tx.eventName}
                          </Badge>
                        ) : tx.methodId && tx.methodId !== '0x' ? (
                          <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">
                            {tx.functionSignature ? tx.functionSignature.split('(')[0] : tx.methodId.slice(0, 10)}
                          </Badge>
                        ) : (
                          <span className="text-zinc-400 dark:text-zinc-600">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">From:</span>{' '}
                            <Link href={`/address/${tx.from}`} className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff66c4]">
                              {truncateHash(tx.from, 6, 4)}
                            </Link>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">To:</span>{' '}
                            {tx.to ? (
                              <Link href={`/address/${tx.to}`} className="font-mono text-zinc-700 dark:text-zinc-300 hover:text-[#ff66c4]">
                                {truncateHash(tx.to, 6, 4)}
                              </Link>
                            ) : (
                              <span className="text-[#ff66c4]">Contract Creation</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-mono font-semibold text-[#ff66c4]">
                          {formatEther(tx.value)}
                        </span>
                        <span className="text-xs text-zinc-500 ml-1">MON</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {tx.status ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {block.transactionCount > block.transactions.length && (
              <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-sm text-zinc-500">
                  Showing {block.transactions.length} of {block.transactionCount} transactions
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
