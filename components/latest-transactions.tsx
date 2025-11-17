'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { formatTimeAgo, truncateHash, formatEther } from '@/lib/format-utils';
import { getLatestTransactions } from '@/lib/api';
import type { Transaction, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

interface LatestTransactionsProps {
  initialData: PaginatedResponse<Transaction>;
}

export function LatestTransactions({ initialData }: LatestTransactionsProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction>>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTxHashes, setNewTxHashes] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const previousTxHashesRef = useRef<Set<string>>(
    new Set(initialData.data.map(tx => tx.hash))
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const newTransactions = await getLatestTransactions(10);

        const currentTxHashes = new Set(newTransactions.data.map(tx => tx.hash));
        const newHashes = new Set<string>();

        currentTxHashes.forEach(hash => {
          if (!previousTxHashesRef.current.has(hash)) {
            newHashes.add(hash);
          }
        });

        setNewTxHashes(newHashes);
        setTransactions(newTransactions);
        previousTxHashesRef.current = currentTxHashes;

        setTimeout(() => {
          setNewTxHashes(new Set());
        }, 3000);
      } catch (error) {
        console.error('Error refreshing transactions:', error);
      } finally {
        setIsRefreshing(false);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-[#ff66c4]" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Latest Transactions</h3>
        </div>
        {isRefreshing && (
          <span className="text-xs text-zinc-500 animate-pulse">Updating...</span>
        )}
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">HASH</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">METHOD</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">AGE</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM / TO</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">VALUE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {transactions && transactions.data.length > 0 ? (
              transactions.data.slice(0, 8).map((tx) => {
                const isNew = newTxHashes.has(tx.hash);
                return (
                  <tr
                    key={tx.hash}
                    onClick={() => router.push(`/tx/${tx.hash}`)}
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer ${isNew ? 'animate-slideInAndHighlight' : ''}`}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-[#ff66c4]">
                          {truncateHash(tx.hash, 6, 4)}
                        </span>
                        {tx.status !== undefined && (
                          tx.status ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-500" />
                          )
                        )}
                        {isNew && (
                          <Badge className="text-[10px] bg-green-500 px-1.5 py-0.5">New</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {tx.methodId && tx.methodId !== '0x' ? (
                        <Badge variant="outline" className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4] px-1.5 py-0.5">
                          {tx.functionSignature ? tx.functionSignature.split('(')[0] : tx.methodId.slice(0, 10)}
                        </Badge>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeAgo(tx.timestamp)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs space-y-0.5">
                        <div>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">From:</span>{' '}
                          <span className="font-mono text-zinc-700 dark:text-zinc-300">
                            {truncateHash(tx.from, 6, 4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">To:</span>{' '}
                          {tx.to ? (
                            <span className="font-mono text-zinc-700 dark:text-zinc-300">
                              {truncateHash(tx.to, 6, 4)}
                            </span>
                          ) : (
                            <span className="text-[#ff66c4]">Contract Creation</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div>
                        <span className="text-xs font-mono font-semibold text-[#ff66c4]">
                          {formatEther(tx.value)}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 ml-1">MON</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-sm">No transactions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
