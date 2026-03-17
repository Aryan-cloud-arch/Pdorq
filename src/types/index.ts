export interface Service {
  id: string;
  name: string;
  description: string;
  tat: string;
  price: number; // Base price in USD
  discount: number; // percentage discount (50-80)
}

export interface Platform {
  id: string;
  name: string;
  color: string;
  services: Service[];
}

export interface OrderData {
  platform: Platform | null;
  service: Service | null;
  targetUrl: string;
  urgency: 'standard' | 'priority' | 'urgent';
  notes: string;
  contactInfo: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  createdAt: Date;
}

// Helper function to format price in selected currency
export const formatPrice = (usdPrice: number, currency: Currency): string => {
  const convertedPrice = usdPrice * currency.rate;
  
  // Format based on currency
  if (currency.code === 'INR') {
    return `${currency.symbol}${Math.round(convertedPrice).toLocaleString('en-IN')}`;
  } else if (currency.code === 'RUB') {
    return `${Math.round(convertedPrice).toLocaleString('ru-RU')}${currency.symbol}`;
  } else if (currency.code === 'EUR') {
    return `€${convertedPrice.toFixed(2)}`;
  } else if (currency.code === 'GBP') {
    return `£${convertedPrice.toFixed(2)}`;
  } else if (currency.code === 'AED') {
    return `${currency.symbol}${convertedPrice.toFixed(2)}`;
  }
  return `$${convertedPrice.toFixed(2)}`;
};

export const convertPrice = (usdPrice: number, currency: Currency): number => {
  return usdPrice * currency.rate;
};
