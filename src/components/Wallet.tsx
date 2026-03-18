import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { paymentMethods, getPaymentAddress, isCryptoMethod, paymentConfig } from '../lib/paymentConfig';
import { qrCodeApi } from '../lib/invoiceApi';

interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  currency: { code: string; symbol: string; rate: number };
  onAddFunds: (amount: number) => void;
  isMobile: boolean;
}

const fundOptions = [
  { amount: 10, bonus: 0, label: 'Starter' },
  { amount: 25, bonus: 2, label: 'Basic' },
  { amount: 50, bonus: 7, label: 'Popular', popular: true },
  { amount: 100, bonus: 20, label: 'Value' },
  { amount: 250, bonus: 60, label: 'Pro' },
  { amount: 500, bonus: 150, label: 'Business', best: true },
];

type Step = 'amount' | 'method' | 'pay' | 'proof' | 'pending' | 'success';

export default function Wallet({ isOpen, onClose, balance, currency, onAddFunds }: WalletProps) {
  const { user, refreshWallet } = useAuth();
  const [step, setStep] = useState<Step>('amount');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [proofReference, setProofReference] = useState('');
  const [proofScreenshot, setProofScreenshot] = useState<File | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep('amount');
      setSelectedAmount(null);
      setCustomAmount('');
      setPaymentMethod(null);
      setProofReference('');
      setProofScreenshot(null);
      setQrCodeUrl(null);
      setError('');
      setTransactionId(null);
    }
  }, [isOpen]);

  // Load QR code when payment method selected
  useEffect(() => {
    if (paymentMethod) {
      qrCodeApi.getByMethod(paymentMethod).then(setQrCodeUrl);
    }
  }, [paymentMethod]);

  if (!isOpen) return null;

  const finalAmount = selectedAmount || Number(customAmount) || 0;
  const amountBonus = fundOptions.find(f => f.amount === selectedAmount)?.bonus || 
    (finalAmount >= 500 ? finalAmount * 0.3 : finalAmount >= 250 ? finalAmount * 0.24 : finalAmount >= 100 ? finalAmount * 0.2 : finalAmount >= 50 ? finalAmount * 0.14 : 0);
  const selectedMethodData = paymentMethods.find(m => m.id === paymentMethod);
  const cryptoBonus = selectedMethodData && isCryptoMethod(paymentMethod || '') ? (finalAmount + amountBonus) * 0.05 : 0;
  const totalCredit = finalAmount + amountBonus + cryptoBonus;

  // Convert to local currency (for UPI)
  const localAmount = paymentMethod === 'upi' ? finalAmount * 92 : finalAmount; // INR rate
  const localCurrency = paymentMethod === 'upi' ? 'INR' : 'USD';
  const localSymbol = paymentMethod === 'upi' ? '₹' : '$';

  const paymentAddress = paymentMethod ? getPaymentAddress(paymentMethod) : '';

  const formatCurrency = (amount: number) => {
    const converted = amount * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleSelectMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    setStep('pay');
  };

  const handlePaymentMade = () => {
    setStep('proof');
  };

  const handleSubmitProof = async () => {
    if (!user || !paymentMethod) return;
    if (!proofReference.trim()) {
      setError('Please enter transaction reference');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (proofScreenshot) {
        const fileExt = proofScreenshot.name.split('.').pop();
        const fileName = `proof-${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, proofScreenshot);
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(fileName);
          screenshotUrl = publicUrl;
        }
      }

      // Create pending transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: totalCredit,
          payment_method: paymentMethod,
          status: 'pending',
          description: `Deposit $${finalAmount} + Bonus $${(amountBonus + cryptoBonus).toFixed(2)}`,
          proof_type: isCryptoMethod(paymentMethod) ? 'tx_hash' : 'utr',
          proof_reference: proofReference.trim(),
          proof_screenshot_url: screenshotUrl,
          payment_amount_local: localAmount,
          payment_currency: localCurrency,
          metadata: {
            base_amount: finalAmount,
            amount_bonus: amountBonus,
            crypto_bonus: cryptoBonus,
            total_credit: totalCredit
          }
        })
        .select()
        .single();

      if (txError) {
        setError('Failed to submit. Please try again.');
        setLoading(false);
        return;
      }

      setTransactionId(transaction.id);
      setStep('pending');
      setLoading(false);

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-[#0D0D0D] border border-gold/20 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gold/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-white">
                {step === 'pending' ? 'Payment Submitted' : step === 'success' ? 'Success!' : 'Add Funds'}
              </h2>
              <p className="text-white/60 text-sm">Balance: {formatCurrency(balance)}</p>
            </div>
            <button onClick={handleClose} className="text-white/50 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress */}
          {!['pending', 'success'].includes(step) && (
            <div className="flex gap-1 mt-4">
              {['amount', 'method', 'pay', 'proof'].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-all ${
                  ['amount', 'method', 'pay', 'proof'].indexOf(step) >= i ? 'bg-gold' : 'bg-white/20'
                }`} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Amount */}
          {step === 'amount' && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm">Select amount to add:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fundOptions.map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => { setSelectedAmount(option.amount); setCustomAmount(''); }}
                    className={`relative p-4 rounded-xl border text-center transition-all ${
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
                    <p className="text-white text-xl font-semibold">${option.amount}</p>
                    {option.bonus > 0 && (
                      <p className="text-green-400 text-xs">+${option.bonus} bonus</p>
                    )}
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

              {finalAmount >= 10 && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">
                    You'll get: <strong>${totalCredit.toFixed(2)}</strong> credits
                    {amountBonus > 0 && <span className="text-green-400/70"> (incl. ${amountBonus.toFixed(2)} bonus)</span>}
                  </p>
                  <p className="text-green-400/60 text-xs mt-1">+ Extra 5% bonus on crypto payments!</p>
                </div>
              )}

              <button
                onClick={() => setStep('method')}
                disabled={finalAmount < 10}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 'method' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('amount')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <p className="text-gold font-semibold">${finalAmount} → ${totalCredit.toFixed(2)}</p>
              </div>

              <p className="text-white/80 text-sm">Select payment method:</p>

              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const address = getPaymentAddress(method.id);
                  const isAvailable = !!address;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => isAvailable && handleSelectMethod(method.id)}
                      disabled={!isAvailable}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                        !isAvailable
                          ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                          : 'border-white/10 bg-white/5 hover:border-gold/50 hover:bg-gold/5'
                      }`}
                    >
                      <span className="text-3xl">{method.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{method.name}</p>
                        <p className="text-white/50 text-sm">{method.desc}</p>
                      </div>
                      {method.bonus > 0 && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          +{method.bonus}%
                        </span>
                      )}
                      {!isAvailable && (
                        <span className="text-white/40 text-xs">Coming Soon</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Pay */}
          {step === 'pay' && selectedMethodData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('method')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              {/* Amount to pay */}
              <div className="text-center p-4 bg-gold/10 border border-gold/20 rounded-xl">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Amount to Pay</p>
                <p className="text-gold text-3xl font-bold">{localSymbol}{localAmount.toFixed(2)}</p>
                <p className="text-white/50 text-sm">{localCurrency}</p>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl">
                    <img src={qrCodeUrl} alt="Payment QR" className="w-48 h-48 object-contain" />
                  </div>
                </div>
              )}

              {/* Payment Address */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                  {paymentMethod === 'upi' ? 'UPI ID' : 'Wallet Address'}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-gold text-sm break-all bg-black/30 p-2 rounded">
                    {paymentAddress}
                  </code>
                  <button
                    onClick={() => copyToClipboard(paymentAddress)}
                    className="p-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">{selectedMethodData.instructions}</p>
              </div>

              {/* What you'll get */}
              <div className="p-4 bg-white/5 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Base Amount</span>
                  <span className="text-white">${finalAmount.toFixed(2)}</span>
                </div>
                {amountBonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Amount Bonus</span>
                    <span className="text-green-400">+${amountBonus.toFixed(2)}</span>
                  </div>
                )}
                {cryptoBonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Crypto Bonus (5%)</span>
                    <span className="text-green-400">+${cryptoBonus.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between">
                  <span className="text-white font-medium">Total Credits</span>
                  <span className="text-gold font-semibold">${totalCredit.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePaymentMade}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90"
              >
                I've Made the Payment
              </button>

              <p className="text-white/40 text-xs text-center">
                Need help? Contact {paymentConfig.supportTelegram}
              </p>
            </div>
          )}

          {/* Step 4: Proof */}
          {step === 'proof' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('pay')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-white/60 text-sm">Almost done! Enter your payment proof.</p>
              </div>

              {/* Transaction Reference */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  {paymentMethod === 'upi' ? 'UTR Number / Transaction ID *' : 'Transaction Hash (TxID) *'}
                </label>
                <input
                  type="text"
                  value={proofReference}
                  onChange={(e) => setProofReference(e.target.value)}
                  placeholder={paymentMethod === 'upi' ? '412345678901' : '0x...'}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                />
                <p className="text-white/40 text-xs mt-1">
                  {paymentMethod === 'upi' 
                    ? 'Find UTR in your UPI app transaction details' 
                    : 'Copy the transaction hash from your wallet'}
                </p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Payment Screenshot (Optional but recommended)
                </label>
                <label className="block w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-gold/50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofScreenshot(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {proofScreenshot ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">{proofScreenshot.name}</span>
                    </div>
                  ) : (
                    <div className="text-white/50">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Click to upload screenshot</p>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={handleSubmitProof}
                disabled={loading || !proofReference.trim()}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </button>
            </div>
          )}

          {/* Step 5: Pending */}
          {step === 'pending' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-2xl font-serif text-white mb-2">Payment Submitted!</h3>
              <p className="text-white/60 mb-6">Your payment is being verified.</p>

              <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Amount</span>
                  <span className="text-white">{localSymbol}{localAmount.toFixed(2)} {localCurrency}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Credits</span>
                  <span className="text-gold">${totalCredit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Reference</span>
                  <span className="text-white font-mono text-xs">{proofReference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Status</span>
                  <span className="text-yellow-400">⏳ Pending Verification</span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                <p className="text-blue-400 text-sm">
                  ⏱️ Verification usually takes 5-30 minutes. You'll see the balance update once approved.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20"
              >
                Close
              </button>

              <p className="text-white/40 text-xs mt-4">
                Need help? Contact {paymentConfig.supportTelegram}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
