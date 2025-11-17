'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchCommand } from './search-command';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 h-16">
          {/* Logo - Left */}
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            Moggi Explorer
          </Link>

          {/* Search Bar - Center */}
          <div className="flex justify-center">
            {!isHomePage && (
              <div className="w-full max-w-md hidden md:block">
                <SearchCommand />
              </div>
            )}
          </div>

          {/* Navigation - Right */}
          <nav className="flex items-center gap-4 text-sm font-medium whitespace-nowrap">
            <Link
              href="/"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Home
            </Link>
            <Link
              href="/tokens"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Tokens
            </Link>
            <Link
              href="/contracts"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Contracts
            </Link>
            <Link
              href="/protocols"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Protocols
            </Link>
            <Link
              href="/faq"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              FAQ
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
