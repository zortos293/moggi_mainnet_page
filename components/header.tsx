'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchCommand } from './search-command';

export function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-6">
        <Link href="/" className="text-xl font-bold">
          Moggi Explorer
        </Link>

        {!isHomePage && (
          <div className="flex-1 max-w-md hidden md:block">
            <SearchCommand />
          </div>
        )}

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/contracts"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Contracts
          </Link>
          <Link
            href="/faq"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}
