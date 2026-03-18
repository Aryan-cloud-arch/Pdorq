import { useState } from 'react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 92 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.86 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.75 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rate: 83 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 6.88 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 157 }
];

export default function Settings({ isOpen, onClose, currency, onCurrencyChange }: SettingsProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  if (!isOpen) return null;

  const handleCurrencySelect = (curr: Currency) => {
    setSelectedCurrency(curr);
    onCurrencyChange(curr);
    // Save to localStorage
    localStorage.setItem('preferred-currency', JSON.stringify(curr));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#0D0D0D] border border-gold/20 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gold/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-white">Settings</h2>
            <p className="text-white/60 text-sm">Customize your experience</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Currency Section */}
          <div>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <span>💱</span>
              <span>Currency</span>
            </h3>

            {/* Current Rate Display */}
            {selectedCurrency.code !== 'USD' && (
              <div className="mb-4 p-3 bg-gold/10 border border-gold/20 rounded-lg">
                <p className="text-gold text-sm">
                  1 USD = {selectedCurrency.symbol}{selectedCurrency.rate.toFixed(2)} {selectedCurrency.code}
                </p>
              </div>
            )}

            {/* Currency Grid */}
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => handleCurrencySelect(curr)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedCurrency.code === curr.code
                      ? 'border-gold bg-gold/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{curr.flag}</span>
                    <span className="text-white font-medium">{curr.code}</span>
                    {selectedCurrency.code === curr.code && (
                      <svg className="w-4 h-4 text-gold ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-white/60 text-xs">{curr.name}</p>
                  {curr.code !== 'USD' && (
                    <p className="text-white/40 text-xs mt-1">1$ = {curr.symbol}{curr.rate}</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Info */}
          <p className="text-white/40 text-xs text-center mt-6">
            Exchange rates are approximate and updated periodically.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
