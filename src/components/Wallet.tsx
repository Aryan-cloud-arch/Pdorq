import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { walletApi, transactionApi } from '../lib/api';

interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  currency: { code: string; symbol: string; rate: number };
  onAddFunds: (amount: number) => void;
  isMobile: boolean;
}

const fundOptions = [
  { amount: 25, bonus: 0, label: 'Starter' },
  { amount: 50, bonus: 5, label: 'Popular', popular: true },
  { amount: 100, bonus: 15, label: 'Value' },
  { amount: 250, bonus: 50, label: 'Pro' },
  { amount: 500, bonus: 125, label: 'Business' },
  { amount: 1000, bonus: 300, label: 'Best Value', best: true },
];

const paymentMethods = [
  { id: 'crypto', name: 'Crypto', icon: '₿', desc: 'BTC, ETH, USDT', bonus: 5 },
  { id: 'upi', name: 'UPI', icon: '⚡', desc: 'Instant Transfer', bonus: 0 },
  { id: 'card', name: 'Card', icon: '💳', desc: 'Visa, Mastercard', bonus: 0 },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦', desc: '1-2 days', bonus: 0 },
];

export default function Wallet({ isOpen, onClose, balance, currency, onAddFunds, isMobile }: WalletProps) {
  const { user, refreshWallet } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const finalAmount = selectedAmount || Number(customAmount) || 0;
  const amountBonus = fundOptions.find(f => f.amount === selectedAmount)?.bonus || 
    (finalAmount >= 1000 ? finalAmount * 0.3 : finalAmount >= 500 ? finalAmount * 0.25 : finalAmount >= 100 ? finalAmount * 0.15 : 0);
  const cryptoBonus = paymentMethod === 'crypto' ? (finalAmount + amountBonus) * 0.05 : 0;
  const totalCredit = finalAmount + amountBonus + cryptoBonus;

  const handleConfirm = async () => {
    if (!user || !paymentMethod) return;

    setLoading(true);
    setError('');

    try {
      // For now, simulate payment success (later integrate real gateway)
      // In production, you'd redirect to payment gateway and handle callback
      
      const { error: txError } = await walletApi.addFunds(
        user.id,
        finalAmount,
        paymentMethod,
        amountBonus + cryptoBonus
      );

      if (txError) {
        setError('Failed to add funds. Please try again.');
        setLoading(false);
        return;
      }

      await refreshWallet();
      setSuccess(true);
      setLoading(false);

      // Auto close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedAmount(null);
    setCustomAmount('');
    setPaymentMethod(null);
    setLoading(false);
    setSuccess(false);
    setError('');
    onClose();
  };

  const formatCurrency = (amount: number) => {
    const converted = amount * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className={`relative bg-[#0D0D0D] border border-gold/20 w-full max-w-lg overflow-hidden ${isMobile ? 'rounded-t-2xl max-h-[90vh]' : 'rounded-2xl max-h-[85vh]'}`}>
        
        {/* Drag indicator for mobile */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gold/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-white">Add Funds</h2>
              <p className="text-white/60 text-sm">Current Balance: {formatCurrency(balance)}</p>
            </div>
            <button onClick={handleClose} className="text-white/50 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          {!success && (
            <div className="flex gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gold' : 'bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">{formatCurrency(totalCredit)} Added!</h3>
              
              <div className="bg-white/5 rounded-lg p-4 mt-4 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Base Amount</span>
                  <span className="text-white">{formatCurrency(finalAmount)}</span>
                </div>
                {amountBonus > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Amount Bonus</span>
                    <span className="text-green-400">+{formatCurrency(amountBonus)}</span>
                  </div>
                )}
                {cryptoBonus > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Crypto Bonus (5%)</span>
                    <span className="text-green-400">+{formatCurrency(cryptoBonus)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                  <span className="text-white font-medium">Total Added</span>
                  <span className="text-gold font-medium">{formatCurrency(totalCredit)}</span>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-2 border-t border-white/10">
                  <span className="text-white/60">New Balance</span>
                  <span className="text-white font-medium">{formatCurrency(balance)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Select Amount */}
          {!success && step === 1 && (
            <div>
              <p className="text-white/80 text-sm mb-4">Select amount to add:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {fundOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => { setSelectedAmount(option.amount); setCustomAmount(''); }}
                    className={`relative p-3 sm:p-4 rounded-xl border text-center transition-all ${
                      selectedAmount === option.amount
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold text-black text-[10px] font-bold rounded-full">
                        POPULAR
                      </span>
                    )}
                    {option.best && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                        BEST
                      </span>
                    )}
                    <p className="text-white text-lg font-semibold">${option.amount}</p>
                    {option.bonus > 0 && (
                      <p className="text-green-400 text-xs">+${option.bonus} bonus</p>
                    )}
                    <p className="text-white/40 text-xs mt-1">{option.label}</p>
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="Custom amount (min $10)"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                  min="10"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!finalAmount || finalAmount < 10}
                className="w-full mt-4 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {!success && step === 2 && (
            <div>
              <p className="text-white/80 text-sm mb-4">Select payment method:</p>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                      paymentMethod === method.id
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-white/50 text-sm">{method.desc}</p>
                    </div>
                    {method.bonus > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        +{method.bonus}% bonus
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!paymentMethod}
                  className="flex-1 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {!success && step === 3 && (
            <div>
              <p className="text-white/80 text-sm mb-4">Review your deposit:</p>

              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Amount</span>
                  <span className="text-white">${finalAmount.toFixed(2)}</span>
                </div>
                {amountBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Amount Bonus</span>
                    <span className="text-green-400">+${amountBonus.toFixed(2)}</span>
                  </div>
                )}
                {cryptoBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Crypto Bonus (5%)</span>
                    <span className="text-green-400">+${cryptoBonus.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-medium">Total Credits</span>
                  <span className="text-gold text-lg font-semibold">${totalCredit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Payment Method</span>
                  <span className="text-white capitalize">{paymentMethod}</span>
                </div>
              </div>

              <p className="text-green-400 text-sm text-center mt-4">
                🎉 You're saving ${(amountBonus + cryptoBonus).toFixed(2)} with bonuses!
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ${finalAmount.toFixed(2)} → Get ${totalCredit.toFixed(2)}</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
