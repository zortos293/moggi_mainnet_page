import { SearchCommand } from '@/components/search-command';
import { LatestBlocks } from '@/components/latest-blocks';
import { LatestTransactions } from '@/components/latest-transactions';
import { getLatestBlocks, getLatestTransactions } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let latestBlocks;
  let latestTransactions;

  try {
    [latestBlocks, latestTransactions] = await Promise.all([
      getLatestBlocks(10),
      getLatestTransactions(10),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Welcome Monad Dev
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Fast, composable blockchain explorer for Monad Mainnet
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <SearchCommand />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {latestBlocks && <LatestBlocks initialData={latestBlocks} />}
          {latestTransactions && <LatestTransactions initialData={latestTransactions} />}
        </div>
      </main>
    </div>
  );
}
