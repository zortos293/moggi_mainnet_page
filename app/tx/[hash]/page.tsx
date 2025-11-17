import { getEnrichedTransaction, getAddressMetadata, getAddress } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, CheckCircle2, XCircle, Clock, Zap, FileCode, ArrowLeft, Box, Wallet } from 'lucide-react';
import { formatEther, formatGwei, formatTimestamp, formatTimeAgo, truncateHash, formatNumber } from '@/lib/format-utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/copy-button';

export const dynamic = 'force-dynamic';

interface TransactionPageProps {
  params: Promise<{ hash: string }>;
}

export default async function TransactionPage({ params }: TransactionPageProps) {
  const { hash } = await params;

  let transaction;
  let fromAddress;
  let toAddress;
  let error;

  try {
    transaction = await getEnrichedTransaction(hash);

    if (transaction) {
      [fromAddress, toAddress] = await Promise.all([
        getAddress(transaction.from).catch(() => null),
        transaction.to ? getAddress(transaction.to).catch(() => null) : Promise.resolve(null),
      ]);
    }
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load transaction';
  }

  if (error || !transaction) {
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
            <p className="text-red-500 dark:text-red-400 mt-2">{error || 'Transaction not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const txFee = BigInt(transaction.gasUsed) * BigInt(transaction.effectiveGasPrice || transaction.gasPrice || '0');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#ff66c4] rounded-lg">
              <ArrowRightLeft className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
                  {truncateHash(transaction.hash, 8, 8)}
                </h1>
                <CopyButton text={transaction.hash} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                {transaction.status !== undefined && (
                  <Badge className={transaction.status ? 'bg-green-600' : 'bg-red-600'}>
                    {transaction.status ? (
                      <><CheckCircle2 className="h-3 w-3 mr-1" /> Success</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Failed</>
                    )}
                  </Badge>
                )}
              </div>
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
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">VALUE</Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatEther(transaction.value)} <span className="text-lg text-zinc-500 dark:text-zinc-400">MON</span>
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TX FEE</Badge>
            </div>
            <div className="text-xl font-mono font-bold text-zinc-900 dark:text-white">
              {formatEther(txFee.toString())} <span className="text-sm text-zinc-500 dark:text-zinc-400">MON</span>
            </div>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">BLOCK</Badge>
            </div>
            <Link href={`/block/${transaction.blockNumber}`} className="text-2xl font-mono font-bold text-[#ff66c4] hover:text-pink-400">
              #{formatNumber(transaction.blockNumber)}
            </Link>
          </div>

          <div className="border border-pink-200 dark:border-pink-900/50 bg-white dark:bg-zinc-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-[#ff66c4] text-white text-xs font-mono">TIME</Badge>
            </div>
            <div className="text-sm font-medium text-zinc-900 dark:text-white">
              {formatTimeAgo(transaction.timestamp)}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {formatTimestamp(transaction.timestamp)}
            </div>
          </div>
        </div>

        {/* Transaction Details Table */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Transaction Details</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500 w-48">Transaction Hash</td>
                  <td className="px-6 py-4 text-sm font-mono text-zinc-700 dark:text-zinc-200 break-all">{transaction.hash}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">From</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {fromAddress?.isContract ? (
                        <FileCode className="h-4 w-4 text-[#ff66c4]" />
                      ) : (
                        <Wallet className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      )}
                      <Link href={`/address/${transaction.from}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 break-all">
                        {transaction.from}
                      </Link>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">To</td>
                  <td className="px-6 py-4">
                    {transaction.to ? (
                      <div className="flex items-center gap-2">
                        {toAddress?.isContract ? (
                          <FileCode className="h-4 w-4 text-[#ff66c4]" />
                        ) : (
                          <Wallet className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        )}
                        <Link href={toAddress?.isContract ? `/contract/${transaction.to}` : `/address/${transaction.to}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400 break-all">
                          {transaction.to}
                        </Link>
                        {toAddress?.isContract && (
                          <Badge variant="outline" className="text-xs bg-transparent border-[#ff66c4] text-[#ff66c4]">Contract</Badge>
                        )}
                      </div>
                    ) : (
                      <Badge className="bg-[#ff66c4]">Contract Creation</Badge>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Value</td>
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-green-600 dark:text-green-400">{formatEther(transaction.value)} MON</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Transaction Index</td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">#{transaction.transactionIndex}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Nonce</td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{transaction.nonce}</td>
                </tr>
                {transaction.type !== undefined && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Transaction Type</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {transaction.type === 0 && 'Type 0 (Legacy)'}
                        {transaction.type === 1 && 'Type 1 (EIP-2930)'}
                        {transaction.type === 2 && 'Type 2 (EIP-1559)'}
                        {transaction.type === 4 && 'Type 4 (EIP-7702)'}
                        {![0, 1, 2, 4].includes(transaction.type) && `Type ${transaction.type}`}
                      </Badge>
                    </td>
                  </tr>
                )}
                {transaction.methodId && transaction.methodId !== '0x' && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Method</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-700 dark:text-zinc-300">
                          {transaction.methodId}
                        </code>
                        {transaction.functionSignature && (
                          <Badge className="bg-[#ff66c4] text-xs">
                            {transaction.functionSignature.split('(')[0]}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gas Details Table */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Gas Details</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500 w-48">Gas Limit</td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatNumber(transaction.gas)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Gas Used</td>
                  <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatNumber(transaction.gasUsed)}</td>
                </tr>
                {transaction.gasPrice && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Gas Price</td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatGwei(transaction.gasPrice)} Gwei</td>
                  </tr>
                )}
                {transaction.effectiveGasPrice && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Effective Gas Price</td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatGwei(transaction.effectiveGasPrice)} Gwei</td>
                  </tr>
                )}
                {transaction.maxFeePerGas && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Max Fee Per Gas</td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatGwei(transaction.maxFeePerGas)} Gwei</td>
                  </tr>
                )}
                {transaction.maxPriorityFeePerGas && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">Max Priority Fee</td>
                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-200">{formatGwei(transaction.maxPriorityFeePerGas)} Gwei</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Input Data */}
        {transaction.input && transaction.input !== '0x' && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[#ff66c4]" />
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Input Data</h3>
              {transaction.methodName && (
                <Badge className="bg-[#ff66c4] text-xs ml-2">{transaction.methodName}</Badge>
              )}
            </div>

            <div className="p-6 space-y-4">
              {transaction.inputInformation?.decodeInputData && (
                <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-900">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#ff66c4]">Decoded Function Call</Badge>
                      <span className="text-sm font-bold text-pink-900 dark:text-pink-100">{transaction.methodName}</span>
                    </div>

                    {Object.keys(transaction.inputInformation.decodeInputData).length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-pink-700 dark:text-pink-300 uppercase">Parameters:</span>
                        <div className="space-y-2">
                          {Object.entries(transaction.inputInformation.decodeInputData).map(([key, value]) => (
                            <div key={key} className="p-3 bg-white dark:bg-black/30 rounded border border-pink-300 dark:border-pink-800">
                              <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">{key}:</span>
                              <code className="block text-xs font-mono text-zinc-800 dark:text-zinc-100 break-all mt-1">
                                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-xs text-zinc-500">Raw Input:</span>
                <code className="block text-xs font-mono break-all bg-zinc-100 dark:bg-zinc-800 p-3 rounded text-zinc-600 dark:text-zinc-400">
                  {transaction.input}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Token Transfers */}
        {transaction.erc20TokensTransferred && transaction.erc20TokensTransferred.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Token Transfers ({transaction.erc20TokensTransferred.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TOKEN</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TO</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {transaction.erc20TokensTransferred.map((transfer, index) => (
                    <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600 text-xs">ERC-20</Badge>
                          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{transfer.token.name}</span>
                          <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-[#ff66c4] text-xs">
                            {transfer.token.symbol}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/address/${transfer.from}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                          {truncateHash(transfer.from)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/address/${transfer.to}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                          {truncateHash(transfer.to)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-mono font-semibold text-green-600 dark:text-green-400">
                          {(Number(transfer.value) / Math.pow(10, transfer.token.decimals)).toLocaleString()} {transfer.token.symbol}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Event Logs */}
        {transaction.logs && transaction.logs.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Event Logs ({transaction.logs.length})</h3>
            </div>

            <div className="p-6 space-y-4">
              {transaction.logs.map((log) => (
                <div key={`${log.transactionHash}-${log.logIndex}`} className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg border border-pink-200 dark:border-pink-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-pink-100 dark:bg-pink-900 border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-200">
                        Log #{log.logIndex}
                      </Badge>
                      {log.eventName && (
                        <Badge className="bg-[#ff66c4]">{log.eventName}</Badge>
                      )}
                    </div>
                    <Link href={`/address/${log.address}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                      {truncateHash(log.address)}
                    </Link>
                  </div>

                  {log.eventSignature && (
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">Event Signature:</span>
                      <code className="block text-xs font-mono bg-white dark:bg-black/30 p-2 rounded border border-pink-300 dark:border-pink-800 break-all text-zinc-700 dark:text-zinc-300">
                        {log.eventSignature}
                      </code>
                    </div>
                  )}

                  {log.decodedParams && Object.keys(log.decodedParams).length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-pink-700 dark:text-pink-300 uppercase">Decoded Parameters:</span>
                      <div className="space-y-2">
                        {Object.entries(log.decodedParams).map(([key, value]) => (
                          <div key={key} className="p-3 bg-white dark:bg-black/30 rounded border border-pink-300 dark:border-pink-800">
                            <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">{key}:</span>
                            <code className="block text-xs font-mono text-zinc-800 dark:text-zinc-100 break-all mt-1">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {log.topics.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-zinc-500">Topics:</span>
                      {log.topics.map((topic, i) => (
                        <code key={i} className="block text-xs font-mono break-all text-zinc-600 dark:text-zinc-400">
                          [{i}] {topic}
                        </code>
                      ))}
                    </div>
                  )}

                  {log.data && log.data !== '0x' && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-zinc-500">Data:</span>
                      <code className="block text-xs font-mono break-all text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
                        {log.data}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Transactions */}
        {transaction.internalTransactions && transaction.internalTransactions.length > 0 && (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Internal Transactions ({transaction.internalTransactions.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">FROM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase">TO</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">VALUE</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase">GAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {transaction.internalTransactions.map((itx, index) => (
                    <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs">
                          {itx.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/address/${itx.from}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                          {truncateHash(itx.from)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/address/${itx.to}`} className="text-sm font-mono text-[#ff66c4] hover:text-pink-400">
                          {truncateHash(itx.to)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-mono font-semibold text-green-600 dark:text-green-400">{formatEther(itx.value)} MON</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{formatNumber(itx.gasUsed)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
