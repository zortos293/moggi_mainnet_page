import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { AddToMetaMask } from '@/components/add-to-metamask';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#ff66c4] rounded-lg">
                <HelpCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Learn more about Moggi Explorer
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>

          {/* Add to MetaMask Section */}
          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">QUICK ACTION</Badge>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              Add Monad Mainnet to MetaMask
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Connect to Monad Mainnet with one click
            </p>
            <div className="flex flex-col items-center gap-3">
              <AddToMetaMask />
              <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                Click the button above to automatically add Monad Mainnet to your MetaMask wallet
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">General Questions</h3>
            </div>
            <div className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    How do you fetch this data before launch?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    We made our own custom indexer that indexes the Monad mainnet before the official launch.
                    Our indexer continuously monitors the blockchain in real-time, capturing blocks, transactions,
                    and smart contract events as they occur. This allows us to provide comprehensive blockchain
                    data from day one.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    What is Moggi Explorer?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Moggi Explorer is a fast, modern blockchain explorer specifically built for Monad Mainnet.
                    It allows you to search and explore blocks, transactions, addresses, and token transfers on
                    the Monad blockchain with a clean, intuitive interface powered by real-time data.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    How often is the data updated?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Our indexer processes new blocks in near real-time as they are confirmed on the Monad network.
                    The explorer displays the latest blocks and transactions with minimal delay, typically within
                    seconds of block finalization. You can refresh the homepage to see the most recent activity.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    What can I search for on Moggi Explorer?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    You can search for:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Block Numbers</strong> - e.g., 32992500</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Block Hashes</strong> - 0x followed by 64 hexadecimal characters</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Transaction Hashes</strong> - 0x followed by 64 hexadecimal characters</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Addresses</strong> - 0x followed by 40 hexadecimal characters</li>
                    </ul>
                    <p className="mt-2">
                      Our smart search automatically detects what you're looking for based on the format.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    Is this an official Monad explorer?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Moggi Explorer is an independent, community-built explorer for the Monad Mainnet.
                    While not an official Monad Labs product, we are committed to providing accurate,
                    reliable blockchain data to the Monad community through our custom-built indexing
                    infrastructure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    What information can I see for each transaction?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    For each transaction, you can view:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Transaction hash and status (success/failed)</li>
                      <li>Block number and timestamp</li>
                      <li>From and To addresses</li>
                      <li>Transaction value in MON</li>
                      <li>Gas usage and gas prices</li>
                      <li>Transaction input data</li>
                      <li>Event logs emitted</li>
                      <li>Internal transactions (if any)</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    Can I see token balances and transfers?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Yes! When viewing an address, you can see:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Token Balances</strong> - All ERC-20 tokens held by the address</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Token Transfers</strong> - Complete history of token transfers to/from the address</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Transaction History</strong> - All transactions involving the address</li>
                    </ul>
                    <p className="mt-2">
                      Each token displays its name, symbol, and properly formatted balance based on its decimals.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    How accurate is the data?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Our indexer connects directly to Monad nodes and processes blockchain data exactly as it
                    appears on-chain. All information displayed is sourced directly from the blockchain with no
                    modifications. However, like any indexer, there may be brief delays during periods of high
                    network activity or during indexer maintenance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-9" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    Do you have an API?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Yes! Moggi Explorer is powered by a comprehensive REST API that provides access to blocks,
                    transactions, addresses, and token data. The API supports pagination, filtering, and real-time
                    queries. Check our API documentation for detailed endpoint information and usage examples.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-10" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    What makes Moggi Explorer different?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    Moggi Explorer focuses on:
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Speed</strong> - Built with Next.js 16 and React 19 for blazing-fast performance</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Clean Design</strong> - Modern, intuitive interface using shadcn/ui components</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Smart Search</strong> - Automatic detection of search types with keyboard shortcuts</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Custom Indexer</strong> - Our own indexing infrastructure for reliable data</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Developer-Friendly</strong> - Full API access for building on Monad</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-11" className="border-zinc-200 dark:border-zinc-800">
                  <AccordionTrigger className="text-zinc-900 dark:text-zinc-100 hover:text-[#ff66c4]">
                    How do I add Monad Mainnet to MetaMask?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 dark:text-zinc-400">
                    <p className="mb-3">
                      Click the "Add Monad to MetaMask" button at the top of the page or in the header.
                      This will automatically configure MetaMask with the following network details:
                    </p>
                    <ul className="ml-4 list-disc space-y-1 text-sm">
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Network Name:</strong> Monad Mainnet</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Chain ID:</strong> 143 (0x8F)</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Currency Symbol:</strong> MON</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">RPC URL:</strong> https://rpc-mainnet.monadinfra.com/rpc/...</li>
                      <li><strong className="text-zinc-700 dark:text-zinc-300">Block Explorer URL:</strong> https://mainnet.moggi.tools</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      Once added, you'll be able to view your transactions directly in Moggi Explorer
                      by clicking "View on Explorer" in MetaMask.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Still have questions?</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                If you have additional questions or need support, feel free to reach out to us on Twitter:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://x.com/Moggi_tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#ff66c4] hover:text-pink-400 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Follow @Moggi_tools
                </a>
                <a
                  href="https://x.com/ZortosCrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#ff66c4] hover:text-pink-400 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  DM @ZortosCrypto
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
