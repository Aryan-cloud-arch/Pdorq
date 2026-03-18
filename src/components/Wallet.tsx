import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

const allPaymentMethods = [
  { id: 'upi', name: 'UPI', icon: '⚡', desc: 'GPay, PhonePe, Paytm', bonus: 0, envKey: 'VITE_UPI_ID', proofLabel: 'UTR Number', proofPlaceholder: '412345678901', instructions: 'Pay using any UPI app and enter UTR number.' },
  { id: 'btc', name: 'Bitcoin', icon: '₿', desc: 'BTC Network', bonus: 5, envKey: 'VITE_BTC_ADDRESS', proofLabel: 'Transaction Hash', proofPlaceholder: '0x...', instructions: 'Send exact BTC amount. 1 confirmation needed.' },
  { id: 'eth', name: 'Ethereum', icon: 'Ξ', desc: 'ETH Network', bonus: 5, envKey: 'VITE_ETH_ADDRESS', proofLabel: 'Transaction Hash', proofPlaceholder: '0x...', instructions: 'Send exact ETH amount. 3 confirmations needed.' },
  { id: 'usdt_trc20', name: 'USDT (TRC20)', icon: '₮', desc: 'Tron Network', bonus: 5, envKey: 'VITE_USDT_TRC20_ADDRESS', proofLabel: 'Transaction Hash', proofPlaceholder: 'T...', instructions: 'Send USDT on TRC20 network only.' },
  { id: 'usdt_erc20', name: 'USDT (ERC20)', icon: '₮', desc: 'Ethereum Network', bonus: 5, envKey: 'VITE_USDT_ERC20_ADDRESS', proofLabel: 'Transaction Hash', proofPlaceholder: '0x...', instructions: 'Send USDT on ERC20 network.' },
];

type Step = 'amount' | 'method' | 'pay' | 'proof' | 'pending';

export default function Wallet({ isOpen, onClose, balance, currency }: WalletProps) {
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('amount'); setSelectedAmount(null); setCustomAmount('');
      setPaymentMethod(null); setProofReference(''); setProofScreenshot(null);
      setQrCodeUrl(null); setError(''); setCopied(false);
    }
  }, [isOpen]);

  // Fetch QR code from database when method changes
  useEffect(() => {
    if (paymentMethod) {
      supabase
        .from('payment_qr_codes')
        .select('qr_image_url')
        .eq('payment_method', paymentMethod)
        .eq('is_active', true)
        .single()
        .then(({ data }) => {
          setQrCodeUrl(data?.qr_image_url || null);
        });
    }
  }, [paymentMethod]);

  if (!isOpen) return null;

  const finalAmount = selectedAmount || Number(customAmount) || 0;
  const selectedMethodData = allPaymentMethods.find(m => m.id === paymentMethod);
  const isCrypto = paymentMethod && paymentMethod !== 'upi';
  
  const amountBonus = fundOptions.find(f => f.amount === selectedAmount)?.bonus ||
    (finalAmount >= 500 ? finalAmount * 0.3 : finalAmount >= 250 ? finalAmount * 0.24 : finalAmount >= 100 ? finalAmount * 0.2 : finalAmount >= 50 ? finalAmount * 0.14 : 0);
  const cryptoBonus = isCrypto ? (finalAmount + amountBonus) * 0.05 : 0;
  const totalCredit = finalAmount + amountBonus + cryptoBonus;

  const localAmount = paymentMethod === 'upi' ? finalAmount * 92 : finalAmount;
  const localCurrency = paymentMethod === 'upi' ? 'INR' : 'USD';
  const localSymbol = paymentMethod === 'upi' ? '₹' : '$';

  // Get payment address from env
  const getAddress = () => {
    if (!selectedMethodData) return '';
    const envValue = import.meta.env[selectedMethodData.envKey] || '';
    return envValue;
  };

  const paymentAddress = getAddress();

  const formatCurrency = (amount: number) => `${currency.symbol}${(amount * currency.rate).toFixed(2)}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = async () => {
    if (!user || !paymentMethod) return;
    if (!proofReference.trim()) { setError('Please enter transaction reference'); return; }

    setLoading(true); setError('');

    try {
      let screenshotUrl = null;

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

      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: totalCredit,
          payment_method: paymentMethod,
          status: 'pending',
          description: `Deposit $${finalAmount} + Bonus $${(amountBonus + cryptoBonus).toFixed(2)}`,
          proof_type: isCrypto ? 'tx_hash' : 'utr',
          proof_reference: proofReference.trim(),
          proof_screenshot_url: screenshotUrl,
          payment_amount_local: localAmount,
          payment_currency: localCurrency,
          metadata: { base_amount: finalAmount, amount_bonus: amountBonus, crypto_bonus: cryptoBonus, total_credit: totalCredit }
        });

      if (txError) { setError('Failed to submit. Try again.'); setLoading(false); return; }

      setStep('pending');
      setLoading(false);
    } catch (err) {
      setError('Something went wrong'); setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0D0D0D] border border-gold/20 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gold/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif text-white">
                {step === 'pending' ? 'Payment Submitted' : 'Add Funds'}
              </h2>
              <p className="text-white/60 text-sm">Balance: {formatCurrency(balance)}</p>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {!['pending'].includes(step) && (
            <div className="flex gap-1 mt-4">
              {['amount', 'method', 'pay', 'proof'].map((s, i) => (
                <div key={s} className={`h-1 flex-1 rounded-full ${['amount', 'method', 'pay', 'proof'].indexOf(step) >= i ? 'bg-gold' : 'bg-white/20'}`} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
          )}

          {/* Step 1: Amount */}
          {step === 'amount' && (
            <div className="space-y-4">
              <p className="text-white/80 text-sm">Select amount:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fundOptions.map((opt) => (
                  <button key={opt.amount} onClick={() => { setSelectedAmount(opt.amount); setCustomAmount(''); }}
                    className={`relative p-4 rounded-xl border text-center transition-all ${selectedAmount === opt.amount ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}>
                    {opt.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gold text-black text-[10px] font-bold rounded-full">POPULAR</span>}
                    {opt.best && <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">BEST</span>}
                    <p className="text-white text-xl font-semibold">${opt.amount}</p>
                    {opt.bonus > 0 && <p className="text-green-400 text-xs">+${opt.bonus} bonus</p>}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  placeholder="Custom amount (min $10)" min="10"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" />
              </div>
              {finalAmount >= 10 && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">You'll get: <strong>${totalCredit.toFixed(2)}</strong> credits</p>
                  <p className="text-green-400/60 text-xs mt-1">+5% extra on crypto!</p>
                </div>
              )}
              <button onClick={() => setStep('method')} disabled={finalAmount < 10}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50">
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Method */}
          {step === 'method' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('amount')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <p className="text-gold font-semibold">${finalAmount} → ${totalCredit.toFixed(2)}</p>
              </div>
              <p className="text-white/80 text-sm">Select payment method:</p>
              <div className="space-y-3">
                {allPaymentMethods.map((method) => (
                  <button key={method.id} onClick={() => { setPaymentMethod(method.id); setStep('pay'); }}
                    className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:border-gold/50 hover:bg-gold/5 transition-all text-left flex items-center gap-4">
                    <span className="text-3xl">{method.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{method.name}</p>
                      <p className="text-white/50 text-sm">{method.desc}</p>
                    </div>
                    {method.bonus > 0 && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">+{method.bonus}%</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Pay */}
          {step === 'pay' && selectedMethodData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('method')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                <p className="text-white/60 text-sm">{selectedMethodData.name}</p>
              </div>

              {/* Amount to pay */}
              <div className="text-center p-5 bg-gold/10 border border-gold/20 rounded-xl">
                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Amount to Pay</p>
                <p className="text-gold text-4xl font-bold">{localSymbol}{localAmount.toFixed(2)}</p>
                <p className="text-white/50 text-sm mt-1">{localCurrency}</p>
              </div>

              {/* QR Code from database */}
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl shadow-lg">
                    <img src={qrCodeUrl} alt="Payment QR" className="w-52 h-52 object-contain" />
                  </div>
                </div>
              )}

              {/* Payment Address */}
              {paymentAddress ? (
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                    {paymentMethod === 'upi' ? 'UPI ID' : 'Wallet Address'}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-gold text-sm break-all bg-black/40 p-3 rounded-lg select-all font-mono">
                      {paymentAddress}
                    </code>
                    <button onClick={() => copyToClipboard(paymentAddress)}
                      className="p-3 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 flex-shrink-0">
                      {copied ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              ) : !qrCodeUrl ? (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <p className="text-orange-400 text-sm">
                    ⚠️ Payment address not configured yet. Please contact support on Telegram: <a href="https://t.me/pdorq" className="underline">@pdorq</a>
                  </p>
                </div>
              ) : null}

              {/* Instructions */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">{selectedMethodData.instructions}</p>
              </div>

              {/* What you'll get */}
              <div className="p-4 bg-white/5 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Base Amount</span>
                  <span className="text-white">${finalAmount.toFixed(2)}</span>
                </div>
                {amountBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Bonus</span>
                    <span className="text-green-400">+${amountBonus.toFixed(2)}</span>
                  </div>
                )}
                {cryptoBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/60">Crypto Bonus (5%)</span>
                    <span className="text-green-400">+${cryptoBonus.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 flex justify-between font-medium">
                  <span className="text-white">Total Credits</span>
                  <span className="text-gold">${totalCredit.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={() => setStep('proof')}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90">
                I've Made the Payment →
              </button>
            </div>
          )}

          {/* Step 4: Proof */}
          {step === 'proof' && selectedMethodData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('pay')} className="text-white/60 hover:text-white text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-white text-lg font-medium">Almost Done!</p>
                <p className="text-white/60 text-sm mt-1">Enter your payment proof below</p>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">{selectedMethodData.proofLabel} *</label>
                <input type="text" value={proofReference} onChange={(e) => setProofReference(e.target.value)}
                  placeholder={selectedMethodData.proofPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" />
                <p className="text-white/40 text-xs mt-1">
                  {paymentMethod === 'upi' ? 'Find UTR in your UPI app → Transaction details' : 'Copy transaction hash from your wallet'}
                </p>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Screenshot (Optional)</label>
                <label className="block w-full p-4 border-2 border-dashed border-white/20 rounded-xl text-center cursor-pointer hover:border-gold/50 transition-all">
                  <input type="file" accept="image/*" onChange={(e) => setProofScreenshot(e.target.files?.[0] || null)} className="hidden" />
                  {proofScreenshot ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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

              {/* Summary */}
              <div className="p-4 bg-white/5 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">You Paid</span>
                  <span className="text-white">{localSymbol}{localAmount.toFixed(2)} {localCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">You'll Get</span>
                  <span className="text-gold font-semibold">${totalCredit.toFixed(2)} credits</span>
                </div>
              </div>

              <button onClick={handleSubmitProof} disabled={loading || !proofReference.trim()}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</>
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

              <div className="bg-white/5 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Amount</span>
                  <span className="text-white">{localSymbol}{localAmount.toFixed(2)} {localCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Credits</span>
                  <span className="text-gold">${totalCredit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Reference</span>
                  <span className="text-white font-mono text-xs">{proofReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Status</span>
                  <span className="text-yellow-400">⏳ Pending Verification</span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                <p className="text-blue-400 text-sm">⏱️ Usually takes 5-30 minutes. Balance updates once approved.</p>
              </div>

              <button onClick={onClose} className="w-full py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
