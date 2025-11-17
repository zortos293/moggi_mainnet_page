/**
 * Format a wei value to ether
 */
export function formatEther(wei: string | bigint): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  const etherValue = Number(weiValue) / 1e18;

  if (etherValue === 0) return '0';
  if (etherValue < 0.000001) return etherValue.toExponential(4);
  if (etherValue < 1) return etherValue.toFixed(6);
  if (etherValue < 1000) return etherValue.toFixed(4);

  return etherValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

/**
 * Format gas price in gwei
 */
export function formatGwei(wei: string | bigint): string {
  const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
  const gweiValue = Number(weiValue) / 1e9;

  if (gweiValue === 0) return '0';
  if (gweiValue < 0.01) return gweiValue.toFixed(4);

  return gweiValue.toFixed(2);
}

/**
 * Format a timestamp to a human readable date
 */
export function formatTimestamp(timestamp: string | number): string {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  const date = new Date(ts * 1000);

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Format a timestamp to relative time (e.g., "2 minutes ago")
 */
export function formatTimeAgo(timestamp: string | number): string {
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  const now = Date.now();
  const diff = now - ts * 1000;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
}

/**
 * Truncate a hash or address for display
 */
export function truncateHash(hash: string, startChars: number = 6, endChars: number = 4): string {
  if (!hash) return '';
  if (hash.length <= startChars + endChars) return hash;

  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Format a large number with commas
 */
export function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num;
  return n.toLocaleString('en-US');
}

/**
 * Format a large number in compact form (e.g., 1.2M, 3.5B)
 */
export function formatCompactNumber(num: string | number | undefined | null): string {
  if (num === undefined || num === null) return '0';

  const n = typeof num === 'string' ? parseInt(num) : num;

  if (isNaN(n)) return '0';

  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;

  return n.toString();
}

/**
 * Format bytes to human readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: bigint, total: bigint): string {
  if (total === 0n) return '0';
  const percentage = (Number(value) / Number(total)) * 100;
  return percentage.toFixed(2);
}
