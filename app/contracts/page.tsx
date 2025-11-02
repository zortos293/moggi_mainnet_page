'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCode2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Contracts</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileCode2 className="h-6 w-6 text-purple-600" />
                  Smart Contracts
                </CardTitle>
                <CardDescription>
                  All deployed smart contracts on Monad Mainnet
                  {contracts?.pagination && ` (${formatNumber(contracts.pagination.total)} total)`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-sm text-zinc-500">Loading contracts...</p>
              </div>
            ) : contracts && contracts.data.length > 0 ? (
              <div className="space-y-6">
                {/* Contracts List */}
                <div className="space-y-3">
                  {contracts.data.map((contract) => (
                    <Link
                      key={contract.address}
                      href={`/address/${contract.address}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-blue-600 truncate max-w-[300px]">
                            {contract.address}
                          </span>
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Contract
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-500">
                          {contract.contractCreator && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">Creator</span>
                              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                {truncateHash(contract.contractCreator, 8, 6)}
                              </span>
                            </div>
                          )}

                          {contract.contractCreationTx && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium">Deployment Tx</span>
                              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                {truncateHash(contract.contractCreationTx, 8, 6)}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col gap-1">
                            <span className="font-medium">Deployed at Block</span>
                            <span className="text-zinc-700 dark:text-zinc-300">
                              #{formatNumber(contract.firstSeenBlock)}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-zinc-500">
                          <span className="font-medium">{formatNumber(contract.transactionCount)}</span> transactions
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {contracts.pagination && contracts.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-zinc-500">
                      Page {contracts.pagination.page} of {contracts.pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1 || loading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage >= contracts.pagination.totalPages || loading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 text-center py-12">No contracts found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
