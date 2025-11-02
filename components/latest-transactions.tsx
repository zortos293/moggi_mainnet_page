'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Clock, CheckCircle2, XCircle, Box } from 'lucide-react';
import { formatTimeAgo, truncateHash, formatEther, formatNumber } from '@/lib/format-utils';
import { getLatestTransactions } from '@/lib/api';
import type { Transaction, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

interface LatestTransactionsProps {
  initialData: PaginatedResponse<Transaction>;
}

export function LatestTransactions({ initialData }: LatestTransactionsProps) {
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction>>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const newTransactions = await getLatestTransactions(10);
        setTransactions(newTransactions);
      } catch (error) {
        console.error('Error refreshing transactions:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-purple-600" />
          Latest Transactions
          {isRefreshing && (
            <span className="ml-auto text-xs text-zinc-500">Updating...</span>
          )}
        </CardTitle>
        <CardDescription>Most recent transactions on the network</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions && transactions.data.length > 0 ? (
          <div className="space-y-3">
            {transactions.data.map((tx) => (
              <Link
                key={tx.hash}
                href={`/tx/${tx.hash}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-600 truncate max-w-[140px]">
                      {truncateHash(tx.hash, 8, 6)}
                    </span>
                    {tx.status !== undefined && (
                      <Badge variant={tx.status ? 'default' : 'destructive'} className="text-xs flex items-center gap-1">
                        {tx.status ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Success</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Failed</span>
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(tx.timestamp)}
                  </div>
                  <div className="text-xs text-zinc-500">
                    From {truncateHash(tx.from)} → {tx.to ? truncateHash(tx.to) : 'Contract'}
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-sm font-medium whitespace-nowrap">
                    {formatEther(tx.value)} MON
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-8">No transactions available</p>
        )}
      </CardContent>
    </Card>
  );
}
