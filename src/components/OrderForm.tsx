import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderApi, walletApi } from '../lib/api';
import { PlatformIcons } from './Icons';

interface Platform {
  id: string;
  name: string;
  services: {
    id: string;
    name: string;
    price: number;
    discount: number;
    tat: string;
  }[];
}

interface OrderFormProps {
  platforms: Platform[];
  currency: { code: string; symbol: string; rate: number };
  selectedPlatform: string | null;
  selectedService: string | null;
  onSubmit: (order: any) => void;
  userBalance: number;
}

export default function OrderForm({ 
  platforms, 
  currency, 
  selectedPlatform: initialPlatform, 
  selectedService: initialService,
  onSubmit,
  userBalance
}: OrderFormProps) {
  const { user, refreshWallet } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(initialPlatform);
  const [selectedService, setSelectedService] = useState<string | null>(initialService);
  const [targetUrl, setTargetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState<'standard' | 'priority' | 'urgent'>('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (initialPlatform) {
      setSelectedPlatform(initialPlatform);
      if (initialService) {
        setSelectedService(initialService);
        setStep(3);
      } else {
        setStep(2);
      }
    }
  }, [initialPlatform, initialService]);

  const platform = platforms.find(p => p.id === selectedPlatform);
  const service = platform?.services.find(s => s.id === selectedService);
  
  const basePrice = service?.price || 0;
  const discountPercent = service?.discount || 0;
  const discountedPrice = basePrice * (1 - discountPercent / 100);
  const urgencyMultiplier = urgency === 'urgent' ? 2 : urgency === 'priority' ? 1.5 : 1;
  const finalPrice = discountedPrice * urgencyMultiplier;

  const formatPrice = (price: number) => {
    const converted = price * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const handleSubmit = async () => {
    if (!user || !service || !platform) return;

    // Check balance
    if (userBalance < finalPrice) {
      setError(`Insufficient balance. You need ${formatPrice(finalPrice)} but have ${formatPrice(userBalance)}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create order in database
      const { data: newOrder, error: orderError } = await orderApi.create({
        user_id: user.id,
        platform: platform.name,
        service: service.name,
        target_url: targetUrl,
        urgency: urgency,
        base_price: basePrice,
        discount_percent: discountPercent,
        final_price: finalPrice,
        currency: currency.code,
        notes: notes || null
      });

      if (orderError || !newOrder) {
        setError('Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      // Deduct from wallet
      const { error: walletError } = await walletApi.deductFunds(
        user.id,
        finalPrice,
        newOrder.id
      );

      if (walletError) {
        setError('Failed to process payment. Please try again.');
        setLoading(false);
        return;
      }

      await refreshWallet();
      
      setOrderNumber(newOrder.order_number);
      setSuccess(true);
      setLoading(false);

      onSubmit({
        id: newOrder.order_number,
        platform: platform.name,
        service: service.name,
        targetUrl,
        urgency,
        finalPrice,
        status: 'processing'
      });

    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedPlatform(null);
    setSelectedService(null);
    setTargetUrl('');
    setNotes('');
    setUrgency('standard');
    setSuccess(false);
    setError('');
  };

  const Icon = selectedPlatform ? PlatformIcons[selectedPlatform as keyof typeof PlatformIcons] : null;

  return (
    <section className="min-h-screen bg-[#0D0D0D] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Place Order</p>
          <h1 className="text-3xl sm:text-4xl font-serif text-white">
            {success ? 'Order Placed!' : 'New Takedown Order'}
          </h1>
        </div>

        {/* Progress Steps */}
        {!success && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {['Platform', 'Service', 'Details', 'Confirm'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i + 1 <= step ? 'bg-gold text-black' : 'bg-white/10 text-white/40'
                }`}>
                  {i + 1}
                </div>
                <span className={`hidden sm:block text-sm ${i + 1 <= step ? 'text-white' : 'text-white/40'}`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-8 h-px ${i + 1 < step ? 'bg-gold' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="bg-white/5 border border-gold/20 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-serif text-white mb-2">Order Submitted Successfully!</h2>
            <p className="text-white/60 mb-6">Your order is now being processed.</p>
            
            <div className="bg-[#0D0D0D] rounded-xl p-6 mb-6">
              <p className="text-white/50 text-xs tracking-wider uppercase mb-2">Order Number</p>
              <p className="text-gold text-2xl font-mono">{orderNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-xs uppercase mb-1">Platform</p>
                <p className="text-white">{platform?.name}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-xs uppercase mb-1">Service</p>
                <p className="text-white">{service?.name}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-xs uppercase mb-1">Amount Paid</p>
                <p className="text-gold">{formatPrice(finalPrice)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-white/50 text-xs uppercase mb-1">Status</p>
                <p className="text-yellow-400">Processing</p>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Place Another Order
            </button>
          </div>
        )}

        {/* Step 1: Select Platform */}
        {!success && step === 1 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white text-lg mb-4">Select Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {platforms.map((p) => {
                const PIcon = PlatformIcons[p.id as keyof typeof PlatformIcons];
                return (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPlatform(p.id); setStep(2); }}
                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/50 hover:bg-gold/5 transition-all text-center group"
                  >
                    {PIcon && <PIcon className="w-8 h-8 mx-auto mb-2 text-white/60 group-hover:text-gold transition-colors" />}
                    <p className="text-white text-sm">{p.name}</p>
                    <p className="text-white/40 text-xs">{p.services.length} services</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {!success && step === 2 && platform && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(1)} className="text-white/50 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Icon && <Icon className="w-6 h-6 text-gold" />}
              <h3 className="text-white text-lg">{platform.name} Services</h3>
            </div>
            
            <div className="space-y-3">
              {platform.services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedService(s.id); setStep(3); }}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:border-gold/50 hover:bg-gold/5 transition-all text-left flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{s.name}</p>
                    <p className="text-white/50 text-sm">TAT: {s.tat}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-sm line-through">${s.price}</p>
                    <p className="text-gold font-semibold">${(s.price * (1 - s.discount / 100)).toFixed(2)}</p>
                    <span className="text-green-400 text-xs">{s.discount}% OFF</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Enter Details */}
        {!success && step === 3 && service && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(2)} className="text-white/50 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-white text-lg">Order Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Target URL / Username *</label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com/... or @username"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Urgency</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'standard', label: 'Standard', multiplier: '1x', time: 'Normal TAT' },
                    { id: 'priority', label: 'Priority', multiplier: '1.5x', time: '50% faster' },
                    { id: 'urgent', label: 'Urgent', multiplier: '2x', time: 'ASAP' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as typeof urgency)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        urgency === u.id
                          ? 'border-gold bg-gold/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <p className="text-white text-sm font-medium">{u.label}</p>
                      <p className="text-white/50 text-xs">{u.multiplier} price</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!targetUrl.trim()}
              className="w-full mt-6 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              Continue to Review
            </button>
          </div>
        )}

        {/* Step 4: Review & Confirm */}
        {!success && step === 4 && service && platform && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setStep(3)} className="text-white/50 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-white text-lg">Review Order</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0D0D0D] rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">Platform</p>
                    <p className="text-white">{platform.name}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Service</p>
                    <p className="text-white">{service.name}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-white/50 mb-1">Target</p>
                    <p className="text-white break-all">{targetUrl}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">TAT</p>
                    <p className="text-white">{service.tat}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Urgency</p>
                    <p className="text-white capitalize">{urgency}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0D0D0D] rounded-xl p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Original Price</span>
                    <span className="text-white/40 line-through">${basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Discount ({discountPercent}%)</span>
                    <span className="text-green-400">-${(basePrice - discountedPrice).toFixed(2)}</span>
                  </div>
                  {urgency !== 'standard' && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Urgency ({urgency})</span>
                      <span className="text-white">x{urgencyMultiplier}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-gold text-lg font-semibold">{formatPrice(finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-white/50 text-xs uppercase">Your Balance</p>
                  <p className={`text-lg font-semibold ${userBalance >= finalPrice ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPrice(userBalance)}
                  </p>
                </div>
                {userBalance < finalPrice && (
                  <span className="text-red-400 text-sm">Insufficient funds</span>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || userBalance < finalPrice || !targetUrl.trim()}
              className="w-full mt-6 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>Confirm & Pay {formatPrice(finalPrice)}</>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
