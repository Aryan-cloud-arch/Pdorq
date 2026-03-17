import React, { useState, useEffect } from 'react';
import { platforms } from '../data/platforms';
import { getPlatformIcon, CheckIcon } from './Icons';
import { Platform, Service, OrderData, Currency, formatPrice } from '../types';

interface OrderFormProps {
  preSelectedPlatform?: Platform | null;
  preSelectedService?: Service | null;
  onClearPreselection: () => void;
  currency: Currency;
  onOrderSubmit?: (orderData: any) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  preSelectedPlatform, 
  preSelectedService,
  onClearPreselection,
  currency,
  onOrderSubmit
}) => {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    platform: null,
    service: null,
    targetUrl: '',
    urgency: 'standard',
    notes: '',
    contactInfo: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Handle preselection
  useEffect(() => {
    if (preSelectedPlatform) {
      setOrderData(prev => ({ ...prev, platform: preSelectedPlatform }));
      if (preSelectedService) {
        setOrderData(prev => ({ ...prev, service: preSelectedService }));
        setStep(3);
      } else {
        setStep(2);
      }
    }
  }, [preSelectedPlatform, preSelectedService]);

  const generateOrderId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'PDQ-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setIsSubmitted(true);
    
    // Call the callback if provided
    if (onOrderSubmit && orderData.platform && orderData.service) {
      onOrderSubmit({
        platform: orderData.platform.name,
        service: orderData.service.name,
        target: orderData.targetUrl,
        urgency: orderData.urgency,
        notes: orderData.notes,
        contactInfo: orderData.contactInfo,
        price: orderData.service.price,
        discount: orderData.service.discount,
        finalPrice: calculateFinalPrice(),
        estimatedCompletion: orderData.service.tat,
      });
    }
  };
  
  

  const handleReset = () => {
    setStep(1);
    setOrderData({
      platform: null,
      service: null,
      targetUrl: '',
      urgency: 'standard',
      notes: '',
      contactInfo: '',
    });
    setIsSubmitted(false);
    setOrderId('');
    onClearPreselection();
  };

  const urgencyOptions = [
    { id: 'standard', label: 'Standard', multiplier: 1, description: 'Normal queue' },
    { id: 'priority', label: 'Priority', multiplier: 1.5, description: 'Faster processing' },
    { id: 'urgent', label: 'Urgent', multiplier: 2, description: 'Immediate action' },
  ];

  const getUrgencyMultiplier = () => {
    const option = urgencyOptions.find(o => o.id === orderData.urgency);
    return option ? option.multiplier : 1;
  };

  // Helper to calculate discounted price
  const getDiscountedPrice = (price: number, discount: number) => {
    return Math.round(price * (1 - discount / 100));
  };

  const calculateFinalPrice = () => {
    if (!orderData.service) return 0;
    const discountedPrice = getDiscountedPrice(orderData.service.price, orderData.service.discount);
    return Math.round(discountedPrice * getUrgencyMultiplier());
  };

  const formatPriceLocal = (price: number) => {
    return formatPrice(price, currency);
  };

  if (isSubmitted) {
    return (
      <section id="order" className="py-20 md:py-32 bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center p-8 md:p-12 border border-[#C5A572]/30 bg-[#C5A572]/5">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-[#C5A572]/20 flex items-center justify-center">
              <CheckIcon className="w-8 h-8 md:w-10 md:h-10 text-[#C5A572]" />
            </div>
            
            <h3 
              className="text-2xl md:text-3xl text-white mb-2"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
            >
              Order Submitted
            </h3>
            
            <p 
              className="text-sm text-white/50 mb-6"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Your takedown request has been received and is being processed
            </p>

            <div className="inline-block px-6 py-3 bg-[#0D0D0D] border border-[#C5A572] mb-6">
              <span 
                className="text-[10px] tracking-[0.2em] text-[#C5A572] uppercase block mb-1"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Order ID
              </span>
              <span 
                className="text-2xl md:text-3xl text-white tracking-[0.1em]"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {orderId}
              </span>
            </div>

            <div className="space-y-3 text-left bg-white/5 p-4 md:p-6 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Platform</span>
                <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.platform?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Service</span>
                <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.service?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>TAT (Turnaround Time)</span>
                <span className="text-[#C5A572]" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.service?.tat}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Urgency</span>
                <span className="text-white capitalize" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.urgency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Discount Applied</span>
                <span className="text-green-400 font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {orderData.service?.discount}% OFF
                </span>
              </div>
              <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Total Amount</span>
                <div className="flex items-center gap-2">
                  <span className="text-white/40 line-through text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    ${orderData.service ? Math.round(orderData.service.price * getUrgencyMultiplier()) : 0}
                  </span>
                  <span className="text-[#C5A572] text-lg font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {formatPriceLocal(calculateFinalPrice())}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Status</span>
                <span className="text-green-400 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Processing
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 border border-white/30 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0D0D0D] transition-all duration-300"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Submit Another Order
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="order" className="py-20 md:py-32 bg-[#0D0D0D]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-16">
          <span 
            className="inline-block text-[10px] sm:text-xs tracking-[0.4em] text-[#C5A572] uppercase mb-4 md:mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Order Form
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.02em] mb-4 md:mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Place Your <em className="italic text-[#C5A572]">Order</em>
          </h2>
          <p 
            className="text-sm sm:text-base text-white/50 max-w-xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            TAT = Turnaround Time (estimated completion time)
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 md:mb-14">
          {['Platform', 'Service', 'Details', 'Review'].map((label, index) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm transition-all duration-300 ${
                    step > index + 1 
                      ? 'bg-[#C5A572] text-[#0D0D0D]' 
                      : step === index + 1 
                        ? 'border-2 border-[#C5A572] text-[#C5A572]' 
                        : 'border border-white/20 text-white/30'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {step > index + 1 ? <CheckIcon className="w-4 h-4" /> : index + 1}
                </div>
                <span 
                  className={`mt-2 text-[8px] sm:text-[10px] tracking-[0.1em] uppercase ${
                    step >= index + 1 ? 'text-white/70' : 'text-white/30'
                  }`}
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div className={`w-8 sm:w-12 md:w-20 h-px ${step > index + 1 ? 'bg-[#C5A572]' : 'bg-white/20'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Steps */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-10">
          {/* Step 1: Select Platform */}
          {step === 1 && (
            <div>
              <h3 
                className="text-xl md:text-2xl text-white mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
              >
                Select Platform
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {platforms.map((platform) => {
                  const minOriginalPrice = Math.min(...platform.services.map(s => s.price));
                  const minDiscountedPrice = Math.min(...platform.services.map(s => getDiscountedPrice(s.price, s.discount)));
                  const maxDiscount = Math.max(...platform.services.map(s => s.discount));
                  return (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setOrderData(prev => ({ ...prev, platform, service: null }));
                        setStep(2);
                      }}
                      className={`group relative p-4 md:p-5 border transition-all duration-300 text-left overflow-hidden ${
                        orderData.platform?.id === platform.id
                          ? 'border-[#C5A572] bg-[#C5A572]/10'
                          : 'border-white/10 hover:border-[#C5A572]/50'
                      }`}
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-1.5 py-0.5 text-[8px] tracking-[0.05em] uppercase font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {maxDiscount}% OFF
                      </div>
                      <div className="text-white/60 group-hover:text-[#C5A572] transition-colors mb-3">
                        {getPlatformIcon(platform.id, "w-6 h-6 md:w-8 md:h-8")}
                      </div>
                      <span 
                        className="text-sm md:text-base text-white block"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                      >
                        {platform.name}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span 
                          className="text-[10px] text-white/40"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {platform.services.length} services
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="text-[9px] text-white/30 line-through"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                          >
                            ${minOriginalPrice}
                          </span>
                          <span 
                            className="text-[10px] text-[#C5A572] font-medium"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                          >
                            ${minDiscountedPrice}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Select Service */}
          {step === 2 && orderData.platform && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setStep(1)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-[#C5A572]">
                  {getPlatformIcon(orderData.platform.id, "w-6 h-6")}
                </div>
                <h3 
                  className="text-xl md:text-2xl text-white"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  {orderData.platform.name} Services
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {orderData.platform.services.map((service) => {
                  const discountedPrice = getDiscountedPrice(service.price, service.discount);
                  return (
                    <button
                      key={service.id}
                      onClick={() => {
                        setOrderData(prev => ({ ...prev, service }));
                        setStep(3);
                      }}
                      className={`group relative p-4 md:p-6 border transition-all duration-300 text-left overflow-hidden ${
                        orderData.service?.id === service.id
                          ? 'border-[#C5A572] bg-[#C5A572]/10'
                          : 'border-white/10 hover:border-[#C5A572]/50'
                      }`}
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-2 py-1 text-[9px] tracking-[0.05em] uppercase font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {service.discount}% OFF
                      </div>
                      <div className="flex items-start justify-between gap-2 mb-3 pr-12">
                        <span 
                          className="text-lg md:text-xl text-white"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          {service.name}
                        </span>
                      </div>
                      {/* Price with discount */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span 
                          className="text-sm text-white/40 line-through"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          ${service.price}
                        </span>
                        <span 
                          className="text-2xl md:text-3xl text-[#C5A572] font-semibold"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          ${discountedPrice}
                        </span>
                        <span 
                          className="text-xs text-green-400 font-medium"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Save ${service.price - discountedPrice}
                        </span>
                      </div>
                      <p 
                        className="text-xs text-white/50 mb-3"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-[10px] tracking-[0.1em] text-[#C5A572] px-2 py-1 bg-[#C5A572]/10"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          TAT: {service.tat}
                        </span>
                        <span 
                          className="text-[10px] text-white/40 group-hover:text-[#C5A572] transition-colors"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          Select →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Enter Details */}
          {step === 3 && orderData.platform && orderData.service && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setStep(2)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 
                  className="text-xl md:text-2xl text-white"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Target Details
                </h3>
              </div>

              {/* Selected Service Summary with Price */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/5 border border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-[#C5A572]">
                    {getPlatformIcon(orderData.platform.id, "w-5 h-5")}
                  </div>
                  <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {orderData.platform.name} → {orderData.service.name}
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] tracking-[0.05em] uppercase font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {orderData.service.discount}% OFF
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#C5A572]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    TAT: {orderData.service.tat}
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm text-white/40 line-through"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      ${orderData.service.price}
                    </span>
                    <span 
                      className="text-xl text-[#C5A572] font-semibold"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      ${getDiscountedPrice(orderData.service.price, orderData.service.discount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Target URL */}
                <div>
                  <label 
                    className="block text-[10px] tracking-[0.2em] text-white/60 uppercase mb-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Target URL / Username *
                  </label>
                  <input
                    type="text"
                    value={orderData.targetUrl}
                    onChange={(e) => setOrderData(prev => ({ ...prev, targetUrl: e.target.value }))}
                    placeholder="https://... or @username"
                    className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  />
                </div>

                {/* Urgency with Price Multiplier */}
                <div>
                  <label 
                    className="block text-[10px] tracking-[0.2em] text-white/60 uppercase mb-3"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {urgencyOptions.map((option) => {
                      const discountedBasePrice = getDiscountedPrice(orderData.service!.price, orderData.service!.discount);
                      const finalPrice = Math.round(discountedBasePrice * option.multiplier);
                      const originalPrice = Math.round(orderData.service!.price * option.multiplier);
                      return (
                        <button
                          key={option.id}
                          onClick={() => setOrderData(prev => ({ ...prev, urgency: option.id as OrderData['urgency'] }))}
                          className={`p-3 md:p-4 border transition-all duration-300 ${
                            orderData.urgency === option.id
                              ? 'border-[#C5A572] bg-[#C5A572]/10'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <span 
                            className="block text-sm md:text-base text-white mb-1"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                          >
                            {option.label}
                          </span>
                          <span 
                            className="block text-xs text-white/40 line-through mb-0.5"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                          >
                            ${originalPrice}
                          </span>
                          <span 
                            className="block text-lg md:text-xl text-[#C5A572] mb-1"
                            style={{ fontFamily: 'Cormorant Garamond, serif' }}
                          >
                            ${finalPrice}
                          </span>
                          <span 
                            className="text-[9px] md:text-[10px] text-white/40 hidden sm:block"
                            style={{ fontFamily: 'Outfit, sans-serif' }}
                          >
                            {option.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label 
                    className="block text-[10px] tracking-[0.2em] text-white/60 uppercase mb-2"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional information..."
                    rows={3}
                    className="w-full bg-transparent border border-white/20 p-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A572] transition-colors resize-none"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  />
                </div>

                <button
                  onClick={() => setStep(4)}
                  disabled={!orderData.targetUrl}
                  className="w-full py-4 bg-[#C5A572] text-[#0D0D0D] text-xs tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B8956A] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && orderData.platform && orderData.service && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setStep(3)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 
                  className="text-xl md:text-2xl text-white"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  Review Order
                </h3>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Platform</span>
                  <span className="text-white flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {getPlatformIcon(orderData.platform.id, "w-4 h-4 text-[#C5A572]")}
                    {orderData.platform.name}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Service</span>
                  <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.service.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>TAT (Turnaround Time)</span>
                  <span className="text-[#C5A572]" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.service.tat}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Target</span>
                  <span className="text-white truncate max-w-[200px] sm:max-w-none" style={{ fontFamily: 'Outfit, sans-serif' }}>{orderData.targetUrl}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-white/10">
                  <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Urgency</span>
                  <span className="text-white capitalize" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {orderData.urgency}
                    {orderData.urgency !== 'standard' && (
                      <span className="text-[#C5A572] ml-2">
                        ({getUrgencyMultiplier()}x)
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Price Breakdown */}
                <div className="pt-4 mt-4 border-t border-[#C5A572]/30">
                  <div className="flex justify-between py-2">
                    <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Original Price</span>
                    <span className="text-white/50 line-through" style={{ fontFamily: 'Outfit, sans-serif' }}>${orderData.service.price}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Discount</span>
                    <span className="text-green-400 font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      -{orderData.service.discount}% (Save ${orderData.service.price - getDiscountedPrice(orderData.service.price, orderData.service.discount)})
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>Discounted Price</span>
                    <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      ${getDiscountedPrice(orderData.service.price, orderData.service.discount)}
                    </span>
                  </div>
                  {orderData.urgency !== 'standard' && (
                    <div className="flex justify-between py-2">
                      <span className="text-white/50" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Urgency ({orderData.urgency})
                      </span>
                      <span className="text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        ×{getUrgencyMultiplier()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-4 mt-2 bg-[#C5A572]/10 px-4 -mx-4">
                    <div>
                      <span 
                        className="text-white text-lg block"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                      >
                        Total Amount
                      </span>
                      <span className="text-[10px] text-green-400 uppercase tracking-wider" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        You're saving ${Math.round(orderData.service.price * getUrgencyMultiplier()) - calculateFinalPrice()}!
                      </span>
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-sm text-white/40 line-through block"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        ${Math.round(orderData.service.price * getUrgencyMultiplier())}
                      </span>
                      <span 
                        className="text-[#C5A572] text-2xl md:text-3xl font-semibold"
                        style={{ fontFamily: 'Cormorant Garamond, serif' }}
                      >
                        {formatPrice(calculateFinalPrice(), currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-8">
                <label 
                  className="block text-[10px] tracking-[0.2em] text-white/60 uppercase mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Contact for Updates (Telegram/Email) *
                </label>
                <input
                  type="text"
                  value={orderData.contactInfo}
                  onChange={(e) => setOrderData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  placeholder="@username or email@example.com"
                  className="w-full bg-transparent border-b border-white/30 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!orderData.contactInfo}
                className="w-full py-4 bg-gradient-to-r from-[#C5A572] to-[#B8956A] text-[#0D0D0D] text-xs tracking-[0.2em] uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_40px_rgba(197,165,114,0.3)] transition-all duration-500 flex items-center justify-center gap-3"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <span>Submit Order</span>
                <span className="text-sm">— {formatPrice(calculateFinalPrice(), currency)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
