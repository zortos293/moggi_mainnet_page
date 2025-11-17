'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  iconSize?: string;
}

export function CopyButton({ text, className, iconSize = 'h-4 w-4' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors',
        className
      )}
    >
      {copied ? (
        <Check className={cn(iconSize, 'text-green-500')} />
      ) : (
        <Copy className={iconSize} />
      )}
    </button>
  );
}
