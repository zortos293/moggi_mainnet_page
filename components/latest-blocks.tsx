'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Clock } from 'lucide-react';
import { formatNumber, formatTimeAgo, truncateHash } from '@/lib/format-utils';
import { getLatestBlocks } from '@/lib/api';
import type { Block, PaginatedResponse } from '@/lib/api';
import Link from 'next/link';

interface LatestBlocksProps {
  initialData: PaginatedResponse<Block>;
}

export function LatestBlocks({ initialData }: LatestBlocksProps) {
  const [blocks, setBlocks] = useState<PaginatedResponse<Block>>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newBlockNumbers, setNewBlockNumbers] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(Date.now());
  const previousBlockNumbersRef = useRef<Set<string>>(
    new Set(initialData.data.map(b => b.number))
  );

  // Update current time every second for live timestamps
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Fetch new blocks every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setIsRefreshing(true);
        const newBlocks = await getLatestBlocks(10);

        // Find new block numbers
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

        // Remove the "new" indicator after animation
        setTimeout(() => {
          setNewBlockNumbers(new Set());
        }, 3000);
      } catch (error) {
        console.error('Error refreshing blocks:', error);
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
          <Box className="h-5 w-5 text-blue-600" />
          Latest Blocks
          {isRefreshing && (
            <span className="ml-auto text-xs text-zinc-500 animate-pulse">Updating...</span>
          )}
        </CardTitle>
        <CardDescription>Most recent blocks on the Monad network</CardDescription>
      </CardHeader>
      <CardContent>
        {blocks && blocks.data.length > 0 ? (
          <div className="space-y-3">
            {blocks.data.map((block) => {
              const isNew = newBlockNumbers.has(block.number);
              return (
                <Link
                  key={block.number}
                  href={`/block/${block.number}`}
                  className={`flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all ${
                    isNew ? 'animate-slideInAndHighlight' : ''
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        #{formatNumber(block.number)}
                      </Badge>
                      {isNew && (
                        <Badge className="text-xs bg-green-500 hover:bg-green-600">New</Badge>
                      )}
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(block.timestamp)}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">
                      {block.transactionCount} transactions
                    </div>
                  </div>
                  <div className="text-right text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="font-mono text-xs truncate max-w-[120px]">
                      {truncateHash(block.miner, 6, 4)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 text-center py-8">No blocks available</p>
        )}
      </CardContent>
    </Card>
  );
}
