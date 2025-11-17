'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';

interface AddressDisplayProps {
  address: string;
}

export function AddressDisplay({ address }: AddressDisplayProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">ADDRESS</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-sm font-mono p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border">
          {address}
        </code>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="shrink-0"
        >
          <div className="flex items-center justify-center">
            <CopyButton text={address} />
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="shrink-0"
        >
          <a
            href={`https://monadscan.com/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Monadscan
          </a>
        </Button>
      </div>
    </div>
  );
}
