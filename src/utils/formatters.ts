export function formatUGX(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'UGX 0';
  return `UGX ${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatCompactUGX(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'UGX 0';
  if (amount >= 1_000_000_000) {
    return `UGX ${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `UGX ${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `UGX ${(amount / 1_000).toFixed(0)}K`;
  }
  return `UGX ${amount}`;
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
