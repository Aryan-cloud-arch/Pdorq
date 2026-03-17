export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 92 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.86 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.75 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rate: 83 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 6.88 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 157 }
];

export const formatPrice = (priceUSD: number, currency: Currency): string => {
  const converted = priceUSD * currency.rate;
  
  if (currency.code === 'JPY') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
  
  return `${currency.symbol}${converted.toFixed(2)}`;
};
