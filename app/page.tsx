import { SearchCommand } from '@/components/search-command';
import { LatestBlocks } from '@/components/latest-blocks';
import { LatestTransactions } from '@/components/latest-transactions';
import { getLatestBlocks, getLatestTransactions, getBlockchainStats } from '@/lib/api';
import { formatCompactNumber } from '@/lib/format-utils';
import { Box, FileCode2, Coins, ArrowRightLeft, Wallet } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let latestBlocks;
  let latestTransactions;
  let stats;

  try {
    [latestBlocks, latestTransactions, stats] = await Promise.all([
      getLatestBlocks(10),
      getLatestTransactions(10),
      getBlockchainStats().catch(() => null),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Monad Explorer
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            Blockchain explorer for Monad Mainnet
          </p>
          <div className="w-full max-w-xl">
            <SearchCommand />
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <Box className="h-6 w-6 text-[#ff66c4]" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatCompactNumber(stats.latestBlock)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Latest Block</div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <ArrowRightLeft className="h-6 w-6 text-[#ff66c4]" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatCompactNumber(stats.totalTransactions)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Transactions</div>
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg p-4 text-center">
              <div className="flex justify-center mb-2">
                <FileCode2 className="h-6 w-6 text-[#ff66c4]" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatCompactNumber(stats.totalContracts)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Contracts</div>
            </div>
            <Link href="/tokens" className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg p-4 text-center hover:border-[#ff66c4] transition-colors">
              <div className="flex justify-center mb-2">
                <Coins className="h-6 w-6 text-[#ff66c4]" />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {formatCompactNumber(stats.totalErc20Tokens + stats.totalErc721Tokens)}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Tokens</div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {latestBlocks && <LatestBlocks initialData={latestBlocks} />}
          {latestTransactions && <LatestTransactions initialData={latestTransactions} />}
        </div>
      </main>
    </div>
  );
}
