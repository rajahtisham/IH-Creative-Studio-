import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1.0,
    label: 'USD ($)',
  },
  PKR: {
    code: 'PKR',
    symbol: 'Rs ',
    rate: 280.0,
    label: 'PKR (Rs)',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    label: 'EUR (€)',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.79,
    label: 'GBP (£)',
  },
};

export function formatCurrency(amountUsd: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountUsd * config.rate;

  if (currency === 'PKR') {
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${config.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
