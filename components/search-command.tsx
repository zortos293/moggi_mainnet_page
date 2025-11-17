'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Box, ArrowRightLeft, Wallet, Search, Shield, Coins, FileCode2 } from 'lucide-react';
import { detectSearchType, getSearchTypeLabel, getSearchUrl, SearchType } from '@/lib/search-utils';
import type { AddressMetadata } from '@/lib/api';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('unknown');
  const [metadata, setMetadata] = useState<AddressMetadata | null>(null);
  const [isContract, setIsContract] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const result = detectSearchType(query.trim());
      setSearchType(result.type);

      // Fetch metadata if it's an address
      if (result.type === 'address') {
        setLoadingMetadata(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        // Fetch both metadata and address info in parallel
        Promise.all([
          fetch(`${apiUrl}/api/metadata/address/${query.trim()}`).then(res => res.ok ? res.json() : null).catch(() => null),
          fetch(`${apiUrl}/api/addresses/${query.trim()}`).then(res => res.ok ? res.json() : null).catch(() => null)
        ])
          .then(([metadataData, addressData]) => {
            setMetadata(metadataData);
            setIsContract(addressData?.isContract || false);
            setLoadingMetadata(false);
          })
          .catch(() => {
            setMetadata(null);
            setIsContract(false);
            setLoadingMetadata(false);
          });
      } else {
        setMetadata(null);
        setIsContract(false);
      }
    } else {
      setSearchType('unknown');
      setMetadata(null);
      setIsContract(false);
    }
  }, [query]);

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && searchType !== 'unknown') {
      const result = detectSearchType(trimmedQuery);
      let url = getSearchUrl(result);

      // If it's an address, check if it's a token or contract
      if (searchType === 'address') {
        if (metadata?.isToken) {
          url = `/token/${trimmedQuery.toLowerCase()}`;
        } else if (isContract || metadata?.entityType === 'contract' || metadata?.name === 'Contract') {
          url = `/contract/${trimmedQuery.toLowerCase()}`;
        }
      }

      setOpen(false);
      setQuery('');
      setMetadata(null);
      setIsContract(false);
      router.push(url);
    }
  }, [query, searchType, metadata, isContract, router]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSearchType('unknown');
      setMetadata(null);
      setIsContract(false);
      setLoadingMetadata(false);
    }
  }, [open]);

  const getIcon = (type: SearchType) => {
    switch (type) {
      case 'block':
        return <Box className="h-4 w-4" />;
      case 'transaction':
        return <ArrowRightLeft className="h-4 w-4" />;
      case 'address':
        // Show coin icon if it's a token
        if (metadata?.isToken) {
          return <Coins className="h-4 w-4 text-yellow-600" />;
        }
        // Show contract icon if it's a contract
        if (isContract || metadata?.entityType === 'contract' || metadata?.name === 'Contract') {
          return <FileCode2 className="h-4 w-4 text-[#ff66c4]" />;
        }
        return <Wallet className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getDisplayLabel = (type: SearchType) => {
    if (type === 'address') {
      if (metadata?.isToken) {
        return metadata.tokenStandard || 'Token';
      }
      if (isContract || metadata?.entityType === 'contract' || metadata?.name === 'Contract') {
        return 'Contract';
      }
    }
    return getSearchTypeLabel(type);
  };

  const trimmedQuery = query.trim();
  const hasValidResult = trimmedQuery && searchType !== 'unknown';

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-zinc-500 dark:text-zinc-400 h-12 px-4 bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search for blocks, transactions, or addresses...</span>
        <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-6 select-none items-center gap-1 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg sm:max-w-[550px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700">
          <Command className="bg-white dark:bg-zinc-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-600 dark:[&_[cmdk-group-heading]]:text-zinc-400 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5" shouldFilter={false}>
            <CommandInput
              placeholder="Type block number, transaction hash, or address..."
              value={query}
              onValueChange={setQuery}
              className="border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            <CommandList className="text-zinc-900 dark:text-zinc-100">
              {!hasValidResult && (
                <CommandEmpty className="text-zinc-500 dark:text-zinc-400">
                  {trimmedQuery ? 'No results found. Enter a valid block number, transaction hash, or address.' : 'Start typing to search...'}
                </CommandEmpty>
              )}
              {hasValidResult && (
                <CommandGroup heading="Search Result">
                  <CommandItem
                    value={trimmedQuery}
                    onSelect={handleSearch}
                    className="flex items-center gap-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                  >
                    {getIcon(searchType)}
                    <div className="flex-1 min-w-0 space-y-1">
                      {searchType === 'address' && metadata ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{metadata.name}</span>
                            {metadata.isVerified && (
                              <Shield className="h-3 w-3 text-green-500" />
                            )}
                            {metadata.symbol && (
                              <Badge variant="outline" className="text-xs bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">{metadata.symbol}</Badge>
                            )}
                          </div>
                          <div className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">{trimmedQuery}</div>
                          {metadata.category && (
                            <div className="text-xs text-zinc-500">{metadata.category}</div>
                          )}
                        </>
                      ) : (
                        <span className="truncate font-mono text-sm text-zinc-900 dark:text-zinc-100">{trimmedQuery}</span>
                      )}
                    </div>
                    <Badge className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200">{getDisplayLabel(searchType)}</Badge>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
