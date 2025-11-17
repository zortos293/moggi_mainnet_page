import { getProtocols } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Layers, ArrowLeft, ChevronLeft, ChevronRight, Globe, ExternalLink, FileCode2 } from 'lucide-react';
import { formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface ProtocolsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProtocolsPage({ searchParams }: ProtocolsPageProps) {
  const search = await searchParams;
  const currentPage = parseInt(search.page || '1', 10);

  let protocols;
  let error;

  try {
    protocols = await getProtocols(currentPage, 20);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load protocols';
  }

  if (error) {
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
            <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
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
            <div className="p-3 bg-[#ff66c4] rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Protocols
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Protocols deployed on Monad Mainnet
                {protocols?.pagination && ` (${formatNumber(protocols.pagination.total)} total)`}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols && protocols.data.length > 0 ? (
            protocols.data.map((protocol) => (
              <div
                key={protocol.id}
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-lg p-5 hover:border-[#ff66c4] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {protocol.logoUrl ? (
                      <img
                        src={protocol.logoUrl}
                        alt={protocol.name}
                        className="w-10 h-10 rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {protocol.name}
                      </h3>
                      {protocol.isLive && (
                        <Badge className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-0">
                          Live
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {protocol.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                    {protocol.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <FileCode2 className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                    {formatNumber(protocol.contractCount || 0)} contracts
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {protocol.website && (
                    <a
                      href={protocol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4] flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Website
                    </a>
                  )}
                  {protocol.twitter && (
                    <a
                      href={`https://twitter.com/${protocol.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      Twitter
                    </a>
                  )}
                  {protocol.github && (
                    <a
                      href={protocol.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      GitHub
                    </a>
                  )}
                  {protocol.docs && (
                    <a
                      href={protocol.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      Docs
                    </a>
                  )}
                  {protocol.discord && (
                    <a
                      href={protocol.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      Discord
                    </a>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <Link
                    href={`/protocols/${protocol.id}`}
                    className="text-sm text-[#ff66c4] hover:text-pink-400 flex items-center gap-1"
                  >
                    View contracts
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-zinc-500">
              No protocols found
            </div>
          )}
        </div>

        {/* Pagination */}
        {protocols?.pagination && protocols.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900/30">
            <div className="text-sm text-zinc-500">
              Total: <span className="text-zinc-700 dark:text-zinc-300">{protocols.pagination.total}</span> protocols
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/protocols?page=${Math.max(1, currentPage - 1)}`}
                className={`p-2 rounded border ${currentPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                Page {currentPage} of {protocols.pagination.totalPages}
              </span>
              <Link
                href={`/protocols?page=${Math.min(protocols.pagination.totalPages, currentPage + 1)}`}
                className={`p-2 rounded border ${currentPage >= protocols.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
