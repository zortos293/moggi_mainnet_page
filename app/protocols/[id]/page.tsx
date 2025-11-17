import { getProtocol } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Layers, ArrowLeft, Globe, ExternalLink, FileCode2, CheckCircle2 } from 'lucide-react';
import { formatNumber, truncateHash } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';

export const dynamic = 'force-dynamic';

interface ProtocolDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProtocolDetailPage({ params }: ProtocolDetailPageProps) {
  const { id } = await params;

  let protocol;
  let error;

  try {
    protocol = await getProtocol(id);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load protocol';
  }

  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/protocols">
            <Button variant="ghost" className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Protocols
            </Button>
          </Link>
          <div className="border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
            <h2 className="text-red-600 dark:text-red-500 font-bold text-lg">Error</h2>
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Protocol not found'}</p>
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
            {protocol.logoUrl ? (
              <img
                src={protocol.logoUrl}
                alt={protocol.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="p-3 bg-[#ff66c4] rounded-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {protocol.name}
                </h1>
                {protocol.isLive && (
                  <Badge className="bg-green-600 text-xs">Live</Badge>
                )}
              </div>
              {protocol.description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
                  {protocol.description}
                </p>
              )}
            </div>
          </div>
          <Link href="/protocols">
            <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 flex-wrap">
          {protocol.website && (
            <a
              href={protocol.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
          {protocol.twitter && (
            <a
              href={`https://twitter.com/${protocol.twitter.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              Twitter
            </a>
          )}
          {protocol.github && (
            <a
              href={protocol.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              GitHub
            </a>
          )}
          {protocol.docs && (
            <a
              href={protocol.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              Docs
            </a>
          )}
          {protocol.discord && (
            <a
              href={protocol.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              Discord
            </a>
          )}
          {protocol.telegram && (
            <a
              href={protocol.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4] px-3 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              Telegram
            </a>
          )}
        </div>

        {/* Contracts List */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-[#ff66c4]" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Protocol Contracts ({protocol.contracts?.length || 0})
            </h3>
          </div>

          {protocol.contracts && protocol.contracts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">CONTRACT</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">ADDRESS</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">NOTES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {protocol.contracts.map((contract) => (
                    <tr key={contract.address} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                            {contract.nickname || contract.contractName || 'Unknown'}
                          </span>
                          {contract.tokenInfo && (
                            <Badge variant="outline" className="text-[10px] bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 w-fit">
                              {contract.tokenInfo.symbol} Token
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link href={`/contract/${contract.address}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                            {truncateHash(contract.address, 10, 8)}
                          </Link>
                          <CopyButton text={contract.address} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {contract.isErc20 && (
                            <Badge variant="outline" className="text-[10px] bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                              ERC20
                            </Badge>
                          )}
                          {contract.isErc721 && (
                            <Badge variant="outline" className="text-[10px] bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
                              ERC721
                            </Badge>
                          )}
                          {contract.isErc1155 && (
                            <Badge variant="outline" className="text-[10px] bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300">
                              ERC1155
                            </Badge>
                          )}
                          {contract.verified && (
                            <Badge variant="outline" className="text-[10px] bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {!contract.isErc20 && !contract.isErc721 && !contract.isErc1155 && (
                            <Badge variant="outline" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                              Contract
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {contract.notes || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-12">No contracts found for this protocol</p>
          )}
        </div>
      </div>
    </div>
  );
}
