import Link from 'next/link';
import { getTokensList } from '@/lib/api';
import { formatCompactNumber, truncateHash } from '@/lib/format-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Coins } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface TokensPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TokensPage({ searchParams }: TokensPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const limit = 25;

  let tokensData;
  let error = null;

  try {
    tokensData = await getTokensList(page, limit);
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch tokens';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  const tokens = tokensData?.data || [];
  const pagination = tokensData?.pagination;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="h-8 w-8 text-[#ff66c4]" />
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Tokens
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              {pagination?.total ? `${formatCompactNumber(pagination.total)} total tokens` : 'All tokens on Monad'}
            </p>
          </div>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Total Supply
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Holders
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Transfers
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                      No tokens found
                    </td>
                  </tr>
                ) : (
                  tokens.map((token, index) => (
                    <tr
                      key={token.address}
                      className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {(page - 1) * limit + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/token/${token.address}`} className="flex items-center gap-2 hover:text-[#ff66c4] transition-colors">
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {token.name || 'Unknown Token'}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                              {token.symbol || '???'}
                            </div>
                          </div>
                          {token.tokenType === 'ERC20' && (
                            <Badge variant="outline" className="text-xs bg-transparent border-[#ff66c4] text-[#ff66c4]">
                              ERC-20
                            </Badge>
                          )}
                          {token.tokenType === 'ERC721' && (
                            <Badge variant="outline" className="text-xs bg-transparent border-purple-500 text-purple-500">
                              ERC-721
                            </Badge>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/token/${token.address}`}
                          className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 transition-colors"
                        >
                          {truncateHash(token.address, 10, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-900 dark:text-zinc-100">
                        {token.totalSupply ? formatCompactNumber(token.totalSupply) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-900 dark:text-zinc-100">
                        {token.holderCount !== undefined ? formatCompactNumber(token.holderCount) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-zinc-900 dark:text-zinc-100">
                        {token.transferCount !== undefined ? formatCompactNumber(token.transferCount) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link href={`/tokens?page=${page - 1}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/tokens?page=${page + 1}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
