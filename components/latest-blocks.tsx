'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Box, Clock, ArrowRightLeft, FileCode2 } from 'lucide-react';
import { formatNumber, formatTimeAgo, truncateHash } from '@/lib/format-utils';
import { getLatestBlocks } from '@/lib/api';
import type { Block, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

interface LatestBlocksProps {
  initialData: PaginatedResponse<Block>;
}

export function LatestBlocks({ initialData }: LatestBlocksProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState<PaginatedResponse<Block>>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newBlockNumbers, setNewBlockNumbers] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const previousBlockNumbersRef = useRef<Set<string>>(
    new Set(initialData.data.map(b => b.number))
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
        const newBlocks = await getLatestBlocks(10);

        const currentBlockNumbers = new Set(newBlocks.data.map(b => b.number));
        const newNumbers = new Set<string>();

        currentBlockNumbers.forEach(num => {
          if (!previousBlockNumbersRef.current.has(num)) {
            newNumbers.add(num);
          }
        });

        setNewBlockNumbers(newNumbers);
        setBlocks(newBlocks);
        previousBlockNumbersRef.current = currentBlockNumbers;

        setTimeout(() => {
          setNewBlockNumbers(new Set());
        }, 3000);
      } catch (error) {
        console.error('Error refreshing blocks:', error);
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
          <Box className="h-5 w-5 text-[#ff66c4]" />
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Latest Blocks</h3>
        </div>
        {isRefreshing && (
          <span className="text-xs text-zinc-500 animate-pulse">Updating...</span>
        )}
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">BLOCK</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">AGE</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TXS</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">MINER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {blocks && blocks.data.length > 0 ? (
              blocks.data.slice(0, 8).map((block) => {
                const isNew = newBlockNumbers.has(block.number);
                const contractCount = block.transactions?.filter(tx => tx.to === null).length || 0;
                const regularTxCount = block.transactionCount - contractCount;

                return (
                  <tr
                    key={block.number}
                    onClick={() => router.push(`/block/${block.number}`)}
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer ${isNew ? 'animate-slideInAndHighlight' : ''}`}
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#ff66c4] font-mono text-xs px-2 py-0.5">
                          #{formatNumber(block.number)}
                        </Badge>
                        {isNew && (
                          <Badge className="text-[10px] bg-green-500 px-1.5 py-0.5">New</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeAgo(block.timestamp)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs">
                        {regularTxCount > 0 && (
                          <div className="flex items-center gap-1 text-[#ff66c4]">
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                            <span>{regularTxCount}</span>
                          </div>
                        )}
                        {contractCount > 0 && (
                          <div className="flex items-center gap-1 text-pink-400">
                            <FileCode2 className="h-3.5 w-3.5" />
                            <span>{contractCount}</span>
                          </div>
                        )}
                        {block.transactionCount === 0 && (
                          <span className="text-zinc-400 dark:text-zinc-600">0</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs font-mono text-[#ff66c4]">
                        {truncateHash(block.miner, 6, 4)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-sm">No blocks available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
