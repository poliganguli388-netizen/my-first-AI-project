export function formatCurrency(amount: number, currency: string = '₹'): string {
  const rounded = Math.round(amount || 0);
  if (currency === '₹') {
    return '₹' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(rounded);
  } else if (currency === '$') {
    return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(rounded);
  } else if (currency === '€') {
    return '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(rounded);
  } else if (currency === '£') {
    return '£' + new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(rounded);
  }
  return `${currency} ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(rounded)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'Date not set';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
