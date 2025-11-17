import {
  getAddress,
  getAddressTransactions,
  getAddressInternalTransactions,
  getAddressMetadata,
  getContractMetadata,
} from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileCode2,
  ArrowRightLeft,
  ArrowLeft,
  Clock,
  User,
  Hash,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Zap,
  Globe,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { formatEther, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';

export const dynamic = 'force-dynamic';

interface ContractPageProps {
  params: Promise<{ address: string }>;
  searchParams: Promise<{
    txPage?: string;
    internalPage?: string;
    tab?: string;
  }>;
}

export default async function ContractPage({ params, searchParams }: ContractPageProps) {
  const { address } = await params;
  const search = await searchParams;

  const txPage = parseInt(search.txPage || '1', 10);
  const internalPage = parseInt(search.internalPage || '1', 10);
  const activeTab = search.tab || 'transactions';

  let contractData;
  let metadata;
  let contractMetadata;
  let transactions;
  let internalTxs;
  let error;

  try {
    [contractData, metadata, contractMetadata, transactions, internalTxs] = await Promise.all([
      getAddress(address),
      getAddressMetadata(address).catch(() => null),
      getContractMetadata(address).catch(() => null),
      getAddressTransactions(address, txPage, 20),
      getAddressInternalTransactions(address, internalPage, 20).catch(() => ({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      })),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load contract';
  }

  if (error || !contractData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
            <h2 className="text-red-600 dark:text-red-500 font-bold text-lg">Error</h2>
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Contract not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if it's a contract from either address data or metadata
  const isContractAddress = contractData.isContract ||
    metadata?.entityType === 'contract' ||
    metadata?.name === 'Contract' ||
    (contractData.contractCode && contractData.contractCode !== '0x');

  // If not a contract, redirect to address page
  if (!isContractAddress) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
        <div className="mx-auto max-w-7xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="border border-yellow-300 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg p-6">
            <h2 className="text-yellow-600 dark:text-yellow-500 font-bold text-lg">Not a Contract</h2>
            <p className="text-yellow-500 dark:text-yellow-400 mt-2">
              This address is not a contract.{' '}
              <Link href={`/address/${address}`} className="text-[#ff66c4] hover:text-pink-400 underline">
                View as wallet address
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {contractMetadata?.protocol?.logoUrl ? (
              <img
                src={contractMetadata.protocol.logoUrl}
                alt={contractMetadata.protocol.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="p-3 bg-[#ff66c4] rounded-lg">
                <FileCode2 className="h-6 w-6 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {contractMetadata?.contractName || contractMetadata?.nickname ? (
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {contractMetadata.nickname || contractMetadata.contractName}
                  </h1>
                ) : (
                  <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                    {truncateHash(address, 8, 8)}
                  </h1>
                )}
                <Badge variant="outline" className="text-xs bg-transparent border-[#ff66c4] text-[#ff66c4]">
                  CONTRACT
                </Badge>
                <CopyButton text={address} />
              </div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1 break-all">
                {address}
              </div>
              {contractMetadata?.protocol && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-0">
                    <Layers className="h-3 w-3 mr-1" />
                    {contractMetadata.protocol.name}
                  </Badge>
                  {contractMetadata.protocol.website && (
                    <a
                      href={contractMetadata.protocol.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4] flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {contractMetadata.protocol.docs && (
                    <a
                      href={contractMetadata.protocol.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      Docs
                    </a>
                  )}
                  {contractMetadata.protocol.github && (
                    <a
                      href={contractMetadata.protocol.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-500 hover:text-[#ff66c4]"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">BALANCE</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatEther(contractData.balance)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">MON</div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TRANSACTIONS</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatNumber(contractData.transactionCount)}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">FIRST SEEN</Badge>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-900 dark:text-white">
              Block #{formatNumber(contractData.firstSeenBlock)}
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">LAST ACTIVE</Badge>
            </div>
            <div className="text-lg font-mono font-bold text-zinc-900 dark:text-white">
              Block #{formatNumber(contractData.lastSeenBlock)}
            </div>
          </div>
        </div>

        {/* Contract Details */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contract Information</h3>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {contractMetadata?.notes && (
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase">
                    Notes
                  </span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {contractMetadata.notes}
                  </p>
                </div>
              </div>
            )}

            {contractData.contractCreator && (
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Creator
                  </span>
                </div>
                <div className="col-span-3">
                  <Link href={`/address/${contractData.contractCreator}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 break-all">
                    {contractData.contractCreator}
                  </Link>
                </div>
              </div>
            )}

            {contractData.contractCreationTx && (
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Creation Tx
                  </span>
                </div>
                <div className="col-span-3">
                  <Link href={`/tx/${contractData.contractCreationTx}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 break-all">
                    {contractData.contractCreationTx}
                  </Link>
                </div>
              </div>
            )}

            {contractData.contractCode && (
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
                    <FileCode2 className="h-4 w-4" />
                    Bytecode
                  </span>
                </div>
                <div className="col-span-3">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded p-3 max-h-32 overflow-y-auto">
                    <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all">
                      {contractData.contractCode.length > 500
                        ? `${contractData.contractCode.slice(0, 500)}...`
                        : contractData.contractCode}
                    </code>
                  </div>
                  <div className="text-xs text-zinc-500 mt-2">
                    {contractData.contractCode.length} characters
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 rounded-none w-full justify-start h-auto p-0 gap-0">
            <Link href={`/contract/${address}?tab=transactions&txPage=${txPage}&internalPage=${internalPage}`}>
              <TabsTrigger
                value="transactions"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                TRANSACTIONS
              </TabsTrigger>
            </Link>
            <Link href={`/contract/${address}?tab=internal&txPage=${txPage}&internalPage=${internalPage}`}>
              <TabsTrigger
                value="internal"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#ff66c4] data-[state=active]:border-b-2 data-[state=active]:border-[#ff66c4] rounded-none px-6 py-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <Zap className="h-4 w-4 mr-2" />
                INTERNAL TXS
              </TabsTrigger>
            </Link>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contract Transactions</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TX HASH</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">METHOD</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">VALUE</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TIME</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-zinc-500 uppercase">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {transactions && transactions.data.length > 0 ? (
                      transactions.data.map((tx) => (
                        <tr key={tx.hash} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/tx/${tx.hash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                              {truncateHash(tx.hash, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {tx.methodId && tx.methodId !== '0x' ? (
                              <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4]">
                                {tx.functionSignature ? tx.functionSignature.split('(')[0] : tx.methodId.slice(0, 10)}
                              </Badge>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/address/${tx.from}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(tx.from, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-mono font-semibold text-[#ff66c4]">
                              {formatEther(tx.value)}
                            </span>
                            <span className="text-xs text-zinc-500 ml-1">MON</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatTimeAgo(tx.timestamp)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {tx.status ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {transactions?.pagination && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{transactions.pagination.total}</span> transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/contract/${address}?tab=transactions&txPage=${Math.max(1, txPage - 1)}&internalPage=${internalPage}`}
                      className={`p-2 rounded border ${txPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {txPage} of {transactions.pagination.totalPages}
                    </span>
                    <Link
                      href={`/contract/${address}?tab=transactions&txPage=${Math.min(transactions.pagination.totalPages, txPage + 1)}&internalPage=${internalPage}`}
                      className={`p-2 rounded border ${txPage >= transactions.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Internal Transactions Tab */}
          <TabsContent value="internal" className="mt-0">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-b-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Internal Transactions</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">PARENT TX</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TO</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">VALUE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {internalTxs && internalTxs.data.length > 0 ? (
                      internalTxs.data.map((itx, index) => (
                        <tr key={`${itx.transactionHash}-${index}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {itx.transactionHash ? (
                              <Link href={`/tx/${itx.transactionHash}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                                {truncateHash(itx.transactionHash, 6, 4)}
                              </Link>
                            ) : (
                              <span className="text-zinc-400 dark:text-zinc-600">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                              {itx.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/address/${itx.from}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(itx.from, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/address/${itx.to}`} className="text-sm font-mono text-zinc-600 dark:text-zinc-400 hover:text-[#ff66c4]">
                              {truncateHash(itx.to, 6, 4)}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-mono font-semibold text-[#ff66c4]">
                              {formatEther(itx.value)}
                            </span>
                            <span className="text-xs text-zinc-500 ml-1">MON</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">No internal transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {internalTxs?.pagination && internalTxs.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="text-sm text-zinc-500">
                    Total: <span className="text-zinc-700 dark:text-zinc-300">{internalTxs.pagination.total}</span> internal transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/contract/${address}?tab=internal&txPage=${txPage}&internalPage=${Math.max(1, internalPage - 1)}`}
                      className={`p-2 rounded border ${internalPage <= 1 ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      Page {internalPage} of {internalTxs.pagination.totalPages}
                    </span>
                    <Link
                      href={`/contract/${address}?tab=internal&txPage=${txPage}&internalPage=${Math.min(internalTxs.pagination.totalPages, internalPage + 1)}`}
                      className={`p-2 rounded border ${internalPage >= internalTxs.pagination.totalPages ? 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed pointer-events-none' : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
