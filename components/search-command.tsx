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
import { Box, ArrowRightLeft, Wallet, Search, Shield } from 'lucide-react';
import { detectSearchType, getSearchTypeLabel, getSearchUrl, SearchType } from '@/lib/search-utils';
import type { AddressMetadata } from '@/lib/api';

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('unknown');
  const [metadata, setMetadata] = useState<AddressMetadata | null>(null);
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        fetch(`${apiUrl}/api/metadata/address/${query.trim()}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            setMetadata(data);
            setLoadingMetadata(false);
          })
          .catch(() => {
            setMetadata(null);
            setLoadingMetadata(false);
          });
      } else {
        setMetadata(null);
      }
    } else {
      setSearchType('unknown');
      setMetadata(null);
    }
  }, [query]);

  const handleSearch = useCallback(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery && searchType !== 'unknown') {
      const result = detectSearchType(trimmedQuery);
      const url = getSearchUrl(result);
      setOpen(false);
      setQuery('');
      setMetadata(null);
      router.push(url);
    }
  }, [query, searchType, router]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSearchType('unknown');
      setMetadata(null);
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
        return <Wallet className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const trimmedQuery = query.trim();
  const hasValidResult = trimmedQuery && searchType !== 'unknown';

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground h-12 px-4"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search for blocks, transactions, or addresses...</span>
        <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg sm:max-w-[550px]">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5" shouldFilter={false}>
            <CommandInput
              placeholder="Type block number, transaction hash, or address..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!hasValidResult && (
                <CommandEmpty>
                  {trimmedQuery ? 'No results found. Enter a valid block number, transaction hash, or address.' : 'Start typing to search...'}
                </CommandEmpty>
              )}
              {hasValidResult && (
                <CommandGroup heading="Search Result">
                  <CommandItem
                    value={trimmedQuery}
                    onSelect={handleSearch}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {getIcon(searchType)}
                    <div className="flex-1 min-w-0 space-y-1">
                      {searchType === 'address' && metadata ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{metadata.name}</span>
                            {metadata.isVerified && (
                              <Shield className="h-3 w-3 text-green-600" />
                            )}
                            {metadata.symbol && (
                              <Badge variant="outline" className="text-xs">{metadata.symbol}</Badge>
                            )}
                          </div>
                          <div className="truncate font-mono text-xs text-muted-foreground">{trimmedQuery}</div>
                          {metadata.category && (
                            <div className="text-xs text-muted-foreground">{metadata.category}</div>
                          )}
                        </>
                      ) : (
                        <span className="truncate font-mono text-sm">{trimmedQuery}</span>
                      )}
                    </div>
                    <Badge variant="secondary">{getSearchTypeLabel(searchType)}</Badge>
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
