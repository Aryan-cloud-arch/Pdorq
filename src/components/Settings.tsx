import { useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Rate relative to USD
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 92 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.86 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.75 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺', rate: 83 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', rate: 6.88 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 157 },
];

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export default function Settings({ isOpen, onClose, currentCurrency, onCurrencyChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'currency' | 'appearance'>('currency');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md bg-[#0D0D0D] border border-[#C5A572]/30 rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-[#C5A572]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A572] to-[#8B7355] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-['Cormorant_Garamond'] font-semibold text-[#FAF9F6]">Settings</h2>
                <p className="text-xs text-[#FAF9F6]/50 tracking-widest uppercase">Customize Your Experience</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#FAF9F6]/10 flex items-center justify-center text-[#FAF9F6]/70 hover:bg-[#FAF9F6]/20 hover:text-[#FAF9F6] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#C5A572]/20">
            <button
              onClick={() => setActiveTab('currency')}
              className={`flex-1 py-3 text-sm tracking-widest uppercase transition-all ${
                activeTab === 'currency'
                  ? 'text-[#C5A572] border-b-2 border-[#C5A572] bg-[#C5A572]/5'
                  : 'text-[#FAF9F6]/50 hover:text-[#FAF9F6]/70'
              }`}
            >
              Currency
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-3 text-sm tracking-widest uppercase transition-all ${
                activeTab === 'appearance'
                  ? 'text-[#C5A572] border-b-2 border-[#C5A572] bg-[#C5A572]/5'
                  : 'text-[#FAF9F6]/50 hover:text-[#FAF9F6]/70'
              }`}
            >
              Display
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
{activeTab === 'currency' && (
               <div className="space-y-3">
                 <p className="text-sm text-[#FAF9F6]/60 mb-4">
                   Select your preferred currency for displaying prices
                 </p>
                 
                 {/* Exchange Rate Banner */}
                 <div className="p-4 rounded-xl bg-gradient-to-r from-[#C5A572]/20 to-[#8B7355]/20 border border-[#C5A572]/30 mb-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-[#C5A572] flex items-center justify-center">
                         <span className="text-[#0D0D0D] font-bold text-sm">$</span>
                       </div>
                       <div>
                         <span className="text-xs text-[#FAF9F6]/50 tracking-widest uppercase block">Base Currency</span>
                         <span className="text-[#FAF9F6] font-semibold">1 USD</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="text-xs text-[#FAF9F6]/50 tracking-widest uppercase block">Current Rate</span>
                       <span className="text-[#C5A572] font-bold text-lg">
                         {currentCurrency.code === 'USD' ? '—' : `${currentCurrency.symbol}${currentCurrency.rate.toFixed(2)}`}
                       </span>
                     </div>
                   </div>
                 </div>
                 
                 {currencies.map((currency) => (
                   <button
                     key={currency.code}
                     onClick={() => onCurrencyChange(currency)}
                     className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 sm:gap-4 ${
                       currentCurrency.code === currency.code
                         ? 'border-[#C5A572] bg-[#C5A572]/10'
                         : 'border-[#FAF9F6]/10 hover:border-[#FAF9F6]/30 bg-[#FAF9F6]/5'
                     }`}
                   >
                     <span className="text-2xl">{currency.flag}</span>
                     <div className="flex-1 text-left min-w-0">
                       <div className="flex items-center gap-2">
                         <span className="text-[#FAF9F6] font-medium">{currency.code}</span>
                         <span className="text-lg text-[#C5A572]">{currency.symbol}</span>
                       </div>
                       <span className="text-sm text-[#FAF9F6]/50 truncate block">{currency.name}</span>
                     </div>
                     
                     {/* Exchange Rate Display */}
                     <div className="text-right shrink-0">
                       {currency.code === 'USD' ? (
                         <span className="text-xs text-[#FAF9F6]/40 tracking-wider">BASE</span>
                       ) : (
                         <>
                           <div className="text-xs text-[#FAF9F6]/40 tracking-wider">1 USD =</div>
                           <div className="text-[#C5A572] font-semibold">
                             {currency.symbol}{currency.rate % 1 === 0 ? currency.rate : currency.rate.toFixed(2)}
                           </div>
                         </>
                       )}
                     </div>
                     
                     {currentCurrency.code === currency.code && (
                       <div className="w-6 h-6 rounded-full bg-[#C5A572] flex items-center justify-center shrink-0">
                         <svg className="w-4 h-4 text-[#0D0D0D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                     )}
                   </button>
                 ))}

                 <div className="mt-6 p-4 rounded-xl bg-[#0D0D0D] border border-[#FAF9F6]/10">
                   <div className="flex items-center gap-2 mb-3">
                     <svg className="w-4 h-4 text-[#C5A572]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                     </svg>
                     <span className="text-xs text-[#C5A572] tracking-widest uppercase font-semibold">Live Exchange Rates</span>
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                     {currencies.filter(c => c.code !== 'USD').slice(0, 4).map(c => (
                       <div key={c.code} className="p-2 rounded-lg bg-[#FAF9F6]/5">
                         <span className="text-xs text-[#FAF9F6]/50 block">{c.code}</span>
                         <span className="text-sm text-[#FAF9F6] font-medium">{c.symbol}{c.rate % 1 === 0 ? c.rate : c.rate.toFixed(2)}</span>
                       </div>
                     ))}
                   </div>
                   <p className="text-xs text-[#FAF9F6]/40 mt-3 text-center">
                     Rates updated periodically. Final payment calculated at checkout.
                   </p>
                 </div>
               </div>
             )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-[#FAF9F6]/60 tracking-widest uppercase mb-3 block">
                    Theme
                  </label>
                  <div className="flex gap-3">
                    <button className="flex-1 p-4 rounded-xl border border-[#C5A572] bg-[#C5A572]/10 transition-all">
                      <div className="w-8 h-8 rounded-full bg-[#0D0D0D] border-2 border-[#C5A572] mx-auto mb-2" />
                      <span className="text-sm text-[#C5A572]">Dark</span>
                    </button>
                    <button className="flex-1 p-4 rounded-xl border border-[#FAF9F6]/10 opacity-50 cursor-not-allowed">
                      <div className="w-8 h-8 rounded-full bg-[#FAF9F6] border-2 border-[#FAF9F6]/30 mx-auto mb-2" />
                      <span className="text-sm text-[#FAF9F6]/50">Light</span>
                      <span className="block text-[10px] text-[#FAF9F6]/30 mt-1">Coming Soon</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-[#FAF9F6]/60 tracking-widest uppercase mb-3 block">
                    Animations
                  </label>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#FAF9F6]/10 bg-[#FAF9F6]/5">
                    <span className="text-[#FAF9F6]">Enable Animations</span>
                    <div className="w-12 h-6 rounded-full bg-[#C5A572] p-1 cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-[#0D0D0D] ml-auto" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#C5A572]/20 bg-[#0D0D0D]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-semibold tracking-wider uppercase text-sm hover:opacity-90 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
