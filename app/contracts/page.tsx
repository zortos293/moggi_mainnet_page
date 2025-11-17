'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCode2, ArrowLeft, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { truncateHash, formatNumber } from '@/lib/format-utils';
import { getContracts } from '@/lib/api';
import type { Address, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<PaginatedResponse<Address> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContracts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getContracts(currentPage, 20);
        setContracts(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load contracts');
      } finally {
        setLoading(false);
      }
    }

    fetchContracts();
  }, [currentPage]);

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
              <FileCode2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Smart Contracts
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                All deployed contracts on Monad Mainnet
                {contracts?.pagination && ` (${formatNumber(contracts.pagination.total)} total)`}
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

        {/* Contracts List */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contract List</h3>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff66c4]"></div>
              <p className="mt-4 text-sm text-zinc-500">Loading contracts...</p>
            </div>
          ) : contracts && contracts.data.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">CONTRACT ADDRESS</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">CREATOR</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">DEPLOYMENT TX</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">BLOCK</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">TXS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {contracts.data.map((contract) => (
                      <tr key={contract.address} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link href={`/contract/${contract.address}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                              {truncateHash(contract.address, 10, 8)}
                            </Link>
                            <Badge variant="outline" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">
                              Contract
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contract.contractCreator ? (
                            <Link href={`/address/${contract.contractCreator}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(contract.contractCreator, 6, 4)}
                            </Link>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contract.contractCreationTx ? (
                            <Link href={`/tx/${contract.contractCreationTx}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(contract.contractCreationTx, 6, 4)}
                            </Link>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-600">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/block/${contract.firstSeenBlock}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                            #{formatNumber(contract.firstSeenBlock)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-mono font-semibold text-zinc-700 dark:text-zinc-200">
                            {formatNumber(contract.transactionCount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {contracts.pagination && contracts.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{contracts.pagination.total}</span> contracts
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || loading}
                      className={`p-2 rounded border ${currentPage === 1 || loading ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {currentPage} of {contracts.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage >= contracts.pagination.totalPages || loading}
                      className={`p-2 rounded border ${currentPage >= contracts.pagination.totalPages || loading ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-zinc-500 text-center py-12">No contracts found</p>
          )}
        </div>
      </div>
    </div>
  );
}
