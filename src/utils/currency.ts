import { Currency } from '../types';

export const formatPrice = (price: number, currency: Currency): string => {
  const converted = price * currency.rate;
  
  if (currency.code === 'JPY') {
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
  
  return `${currency.symbol}${converted.toFixed(2)}`;
};
