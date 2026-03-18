// Payment configuration from environment variables
export const paymentConfig = {
  upiId: import.meta.env.VITE_UPI_ID || '',
  crypto: {
    btc: import.meta.env.VITE_BTC_ADDRESS || '',
    eth: import.meta.env.VITE_ETH_ADDRESS || '',
    usdtTrc20: import.meta.env.VITE_USDT_TRC20_ADDRESS || '',
    usdtErc20: import.meta.env.VITE_USDT_ERC20_ADDRESS || '',
  },
  supportTelegram: import.meta.env.VITE_PAYMENT_SUPPORT_TELEGRAM || '@pdorq',
};

export const paymentMethods = [
  { 
    id: 'upi', 
    name: 'UPI', 
    icon: '⚡', 
    desc: 'Instant Transfer',
    bonus: 0,
    currencies: ['INR'],
    instructions: 'Pay using any UPI app (GPay, PhonePe, Paytm, etc.)'
  },
  { 
    id: 'btc', 
    name: 'Bitcoin', 
    icon: '₿', 
    desc: 'BTC Network',
    bonus: 5,
    currencies: ['BTC'],
    instructions: 'Send exact BTC amount to the address below. Confirmations: 1'
  },
  { 
    id: 'eth', 
    name: 'Ethereum', 
    icon: 'Ξ', 
    desc: 'ETH Network',
    bonus: 5,
    currencies: ['ETH'],
    instructions: 'Send exact ETH amount to the address below. Confirmations: 3'
  },
  { 
    id: 'usdt_trc20', 
    name: 'USDT', 
    icon: '₮', 
    desc: 'TRC20 Network',
    bonus: 5,
    currencies: ['USDT'],
    instructions: 'Send USDT on TRC20 network only. Lower fees!'
  },
  { 
    id: 'usdt_erc20', 
    name: 'USDT', 
    icon: '₮', 
    desc: 'ERC20 Network',
    bonus: 5,
    currencies: ['USDT'],
    instructions: 'Send USDT on ERC20 network. Higher fees but faster.'
  },
];

export const getPaymentAddress = (methodId: string): string => {
  switch (methodId) {
    case 'upi': return paymentConfig.upiId;
    case 'btc': return paymentConfig.crypto.btc;
    case 'eth': return paymentConfig.crypto.eth;
    case 'usdt_trc20': return paymentConfig.crypto.usdtTrc20;
    case 'usdt_erc20': return paymentConfig.crypto.usdtErc20;
    default: return '';
  }
};

export const isCryptoMethod = (methodId: string): boolean => {
  return ['btc', 'eth', 'usdt_trc20', 'usdt_erc20'].includes(methodId);
};
