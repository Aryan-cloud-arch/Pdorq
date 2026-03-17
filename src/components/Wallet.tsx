import { useState, useEffect } from 'react';
import { Currency, formatPrice } from '../types';

interface WalletProps {
  balance: number;
  onAddFunds: (amount: number) => void;
  isScrolled: boolean;
  isMobile?: boolean;
  currency: Currency;
}

const fundOptions = [
  { amount: 25, bonus: 0, label: 'Starter' },
  { amount: 50, bonus: 5, label: 'Popular', popular: true },
  { amount: 100, bonus: 15, label: 'Value' },
  { amount: 250, bonus: 50, label: 'Pro' },
  { amount: 500, bonus: 125, label: 'Business' },
  { amount: 1000, bonus: 300, label: 'Enterprise', best: true },
];

const paymentMethods = [
  { id: 'crypto', name: 'Crypto', icon: '₿', desc: 'BTC, ETH, USDT', bonus: true },
  { id: 'upi', name: 'UPI', icon: '', desc: 'Google Pay, PhonePe, Paytm', upi: true },
  { id: 'card', name: 'Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', desc: 'IMPS, NEFT, RTGS' },
];

// UPI Icon SVG Component
const UpiIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7">
    <path fill="#097939" d="M12.5 2L21 6.5v11L12.5 22 4 17.5v-11z"/>
    <path fill="#F47920" d="M12.5 2L4 6.5v11L12.5 22V2z"/>
    <text x="12.5" y="15" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">UPI</text>
  </svg>
);

export default function Wallet({ balance, onAddFunds, isScrolled, isMobile = false, currency }: WalletProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedOption = fundOptions.find(f => f.amount === selectedAmount);
  const finalAmount = selectedAmount || (customAmount ? parseInt(customAmount) : 0);
  const bonus = selectedOption?.bonus || (finalAmount >= 1000 ? Math.floor(finalAmount * 0.3) : finalAmount >= 500 ? Math.floor(finalAmount * 0.25) : finalAmount >= 250 ? Math.floor(finalAmount * 0.2) : finalAmount >= 100 ? Math.floor(finalAmount * 0.15) : finalAmount >= 50 ? Math.floor(finalAmount * 0.1) : 0);
  const cryptoBonus = selectedPayment === 'crypto' ? finalAmount * 0.05 : 0;
  const totalCredit = finalAmount + bonus + cryptoBonus;

  // Lock body scroll when modal is open
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

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onAddFunds(totalCredit);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setSelectedPayment(null);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const canProceed = step === 1 ? (selectedAmount || parseInt(customAmount) >= 10) : step === 2 ? selectedPayment : true;

  return (
    <>
      {/* Wallet Button - Different styles for mobile vs desktop */}
      {isMobile ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl bg-[#C5A572] text-[#0D0D0D] font-outfit font-semibold text-xs sm:text-sm tracking-[0.1em] uppercase transition-all active:scale-[0.98] touch-manipulation"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Funds</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`group flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border transition-all duration-500 ${
            isScrolled
              ? 'border-[#0D0D0D]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10'
              : 'border-white/20 hover:border-[#C5A572] hover:bg-white/5'
          }`}
        >
          {/* Wallet Icon */}
          <svg className="w-4 h-4 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
          </svg>
          
          {/* Balance */}
          <span className={`font-outfit font-semibold text-sm transition-colors duration-500 ${isScrolled ? 'text-[#0D0D0D]' : 'text-white'}`}>
            {formatPrice(balance, currency)}
          </span>
          
          {/* Add Button */}
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C5A572] text-[#0D0D0D] text-xs font-bold group-hover:scale-110 transition-transform">
            +
          </span>
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal - Slides up on mobile, centered on desktop */}
          <div className="relative w-full sm:max-w-lg bg-gradient-to-b from-[#1a1a1a] to-[#0D0D0D] sm:rounded-2xl rounded-t-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden animate-slide-up sm:animate-fade-in max-h-[90vh] sm:max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#C5A572]/10 via-transparent to-[#C5A572]/10" />
              
              {/* Mobile drag indicator */}
              <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="font-cormorant text-xl sm:text-2xl text-white">Add Funds</h2>
                  <p className="text-white/50 text-xs sm:text-sm font-outfit mt-1">
                    Balance: <span className="text-[#C5A572] font-semibold">{formatPrice(balance, currency)}</span>
                  </p>
                </div>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all touch-manipulation"
                >
                  ✕
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center gap-1 sm:gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-1 sm:gap-2 flex-1">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-outfit font-semibold transition-all ${
                      step >= s ? 'bg-[#C5A572] text-[#0D0D0D]' : 'bg-white/10 text-white/30'
                    }`}>
                      {step > s ? '✓' : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-0.5 transition-all ${step > s ? 'bg-[#C5A572]' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
              {isSuccess ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-cormorant text-xl sm:text-2xl text-white mb-2">Funds Added Successfully!</h3>
                  
                  {/* Breakdown */}
                  <div className="bg-white/5 rounded-xl p-4 text-left max-w-xs mx-auto mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/50 font-outfit text-sm">Base Amount</span>
                      <span className="text-white font-outfit text-sm">{formatPrice(finalAmount, currency)}</span>
                    </div>
                    {bonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50 font-outfit text-sm">Amount Bonus</span>
                        <span className="text-green-400 font-outfit text-sm">+{formatPrice(bonus, currency)}</span>
                      </div>
                    )}
                    {cryptoBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50 font-outfit text-sm">Crypto Bonus (5%)</span>
                        <span className="text-green-400 font-outfit text-sm">+{formatPrice(cryptoBonus, currency)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-white font-outfit font-semibold text-sm">Total Added</span>
                      <span className="text-[#C5A572] font-outfit font-bold">{formatPrice(totalCredit, currency)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 py-3 px-4 rounded-xl bg-[#C5A572]/10 border border-[#C5A572]/20 max-w-xs mx-auto">
                    <p className="text-white/50 text-xs font-outfit">New Balance</p>
                    <p className="text-[#C5A572] font-cormorant text-2xl font-bold">{formatPrice(balance, currency)}</p>
                  </div>
                </div>
              ) : isProcessing ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full border-4 border-[#C5A572]/30 border-t-[#C5A572] animate-spin mb-4" />
                  <h3 className="font-cormorant text-lg sm:text-xl text-white">Processing Payment...</h3>
                  <p className="text-white/50 text-sm mt-2">Please wait</p>
                </div>
              ) : step === 1 ? (
                <>
                  <h3 className="font-outfit text-white/70 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Select Amount</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {fundOptions.map((option) => (
                      <button
                        key={option.amount}
                        onClick={() => { setSelectedAmount(option.amount); setCustomAmount(''); }}
                        className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-300 text-left touch-manipulation ${
                          selectedAmount === option.amount
                            ? 'border-[#C5A572] bg-[#C5A572]/10'
                            : 'border-white/10 hover:border-white/30 active:border-white/30 bg-white/5'
                        }`}
                      >
                        {/* Badges */}
                        {option.popular && (
                          <span className="absolute -top-2 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 bg-[#C5A572] text-[#0D0D0D] text-[8px] sm:text-[10px] font-outfit font-bold uppercase rounded-full">Popular</span>
                        )}
                        {option.best && (
                          <span className="absolute -top-2 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 bg-green-500 text-white text-[8px] sm:text-[10px] font-outfit font-bold uppercase rounded-full">Best</span>
                        )}
                        
                        <div className="text-white/40 text-[10px] sm:text-xs font-outfit uppercase tracking-wider">{option.label}</div>
                        <div className="font-cormorant text-xl sm:text-2xl text-white mt-0.5 sm:mt-1">{formatPrice(option.amount, currency)}</div>
                        {option.bonus > 0 && (
                          <div className="text-green-400 text-xs sm:text-sm font-outfit mt-0.5 sm:mt-1">+{formatPrice(option.bonus, currency)} bonus</div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="mt-4">
                    <label className="font-outfit text-white/50 text-xs sm:text-sm">Or enter custom amount (min {formatPrice(10, currency)})</label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/50 font-outfit">{currency.symbol}</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="10"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                        placeholder="Enter amount"
                        className="w-full pl-8 sm:pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-outfit focus:border-[#C5A572] focus:outline-none transition-all text-base"
                      />
                    </div>
                    {customAmount && parseInt(customAmount) >= 10 && bonus > 0 && (
                      <p className="text-green-400 text-xs sm:text-sm mt-2 font-outfit">+{formatPrice(bonus, currency)} bonus included!</p>
                    )}
                  </div>
                </>
              ) : step === 2 ? (
                <>
                  <h3 className="font-outfit text-white/70 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Payment Method</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-3 sm:p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 sm:gap-4 touch-manipulation ${
                          selectedPayment === method.id
                            ? 'border-[#C5A572] bg-[#C5A572]/10'
                            : 'border-white/10 hover:border-white/30 active:border-white/30 bg-white/5'
                        }`}
                      >
                        {method.upi ? <UpiIcon /> : <span className="text-xl sm:text-2xl">{method.icon}</span>}
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-outfit font-medium text-sm sm:text-base">{method.name}</span>
                            {method.bonus && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full font-outfit">+5% BONUS</span>
                            )}
                          </div>
                          <div className="text-white/50 text-xs sm:text-sm">{method.desc}</div>
                        </div>
                        {selectedPayment === method.id && (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#C5A572] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#0D0D0D] text-xs sm:text-sm">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Bonus Notices */}
                  {selectedPayment === 'crypto' && (
                    <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-green-400 text-xs sm:text-sm font-outfit">💎 5% extra bonus for crypto payments!</p>
                    </div>
                  )}
                  
                  {selectedPayment === 'upi' && (
                    <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-[#C5A572]/10 border border-[#C5A572]/20">
                      <p className="text-[#C5A572] text-xs sm:text-sm font-outfit">⚡ Instant payment via UPI — No additional charges!</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="font-outfit text-white/70 text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Review & Confirm</h3>
                  
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 font-outfit text-sm">Amount</span>
                      <span className="text-white font-outfit">{formatPrice(finalAmount, currency)}</span>
                    </div>
                    {bonus > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 font-outfit text-sm">Bonus</span>
                        <span className="text-green-400 font-outfit">+{formatPrice(bonus, currency)}</span>
                      </div>
                    )}
                    {selectedPayment === 'crypto' && (
                      <div className="flex justify-between items-center">
                        <span className="text-white/50 font-outfit text-sm">Crypto Bonus (5%)</span>
                        <span className="text-green-400 font-outfit">+{formatPrice(cryptoBonus, currency)}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2.5 sm:pt-3 flex justify-between items-center">
                      <span className="text-white font-outfit font-medium text-sm">Total Credit</span>
                      <span className="text-[#C5A572] font-cormorant text-xl sm:text-2xl">
                        {formatPrice(totalCredit, currency)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-white/70 text-xs sm:text-sm font-outfit">
                      {paymentMethods.find(p => p.id === selectedPayment)?.upi ? (
                        <div className="w-5 h-5"><UpiIcon /></div>
                      ) : (
                        <span>{paymentMethods.find(p => p.id === selectedPayment)?.icon}</span>
                      )}
                      <span>Paying via {paymentMethods.find(p => p.id === selectedPayment)?.name}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            {!isSuccess && !isProcessing && (
              <div className="p-4 sm:p-6 border-t border-white/10 flex gap-2 sm:gap-3 flex-shrink-0 bg-[#0D0D0D]">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 sm:px-6 py-3 rounded-xl border border-white/20 text-white font-outfit text-sm hover:bg-white/5 active:bg-white/5 transition-all touch-manipulation"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
                  disabled={!canProceed}
                  className={`flex-1 py-3 rounded-xl font-outfit font-semibold text-sm sm:text-base transition-all touch-manipulation ${
                    canProceed
                      ? 'bg-gradient-to-r from-[#C5A572] to-[#E5C992] text-[#0D0D0D] hover:shadow-lg hover:shadow-[#C5A572]/30 active:scale-[0.98]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {step < 3 ? 'Continue' : `Pay ${formatPrice(finalAmount, currency)} → Get ${formatPrice(totalCredit, currency)}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
