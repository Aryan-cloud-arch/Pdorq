import { Currency } from '../types';
import { platforms } from '../data/platforms';
import { PlatformIcons } from './Icons';
import { formatPrice } from '../utils/currency';
import { User } from './Auth';

interface HomePageProps {
  currency: Currency;
  onNavigate: (page: string) => void;
  onOrderWithPlatform: (platformId: string) => void;
  user: User | null;
  onLoginClick: () => void;
}

export default function HomePage({ currency, onNavigate, onOrderWithPlatform, user, onLoginClick }: HomePageProps) {
  
  const handleOrder = () => {
    if (!user) {
      onLoginClick();
    } else {
      onNavigate('order');
    }
  };
  
  const handlePlatformOrder = (platformId: string) => {
    if (!user) {
      onLoginClick();
    } else {
      onOrderWithPlatform(platformId);
    }
  };
  const featuredPlatforms = platforms.slice(0, 6);
  
  const stats = [
    { value: '12,400+', label: 'Successful Takedowns' },
    { value: '99.2%', label: 'Success Rate' },
    { value: '<6h', label: 'Avg. Response' },
    { value: '24/7', label: 'Operations' },
  ];

  const trustBadges = [
    { icon: '🔒', title: 'SSL Secured', desc: '256-bit encryption' },
    { icon: '🛡️', title: 'Anonymous', desc: 'No data stored' },
    { icon: '⚡', title: 'Fast', desc: 'Same-day results' },
    { icon: '💰', title: 'Refund', desc: '100% guarantee' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C5A572]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C5A572]/3 rounded-full blur-3xl" />
        </div>
        
        {/* Ghost Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="text-[20vw] font-light tracking-wider text-white/[0.02] font-cormorant">
            PDORQ
          </span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5A572]/30 bg-[#C5A572]/5 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm tracking-[0.2em] text-[#C5A572] font-outfit uppercase">
              Trusted by 12,000+ clients worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#FAF9F6] mb-6 leading-tight">
            We Take <span className="italic text-[#C5A572]">Them</span> Down
          </h1>
          
          <p className="text-lg sm:text-xl text-[#FAF9F6]/60 font-outfit font-light max-w-2xl mx-auto mb-10">
            Professional content removal services across all major platforms.
            <span className="block mt-2 text-[#C5A572]/80">Submit your order directly on our platform.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleOrder}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#C5A572] to-[#D4AF37] text-[#0D0D0D] font-outfit font-semibold tracking-wide rounded-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(197,165,114,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Place an Order
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            
            <button
              onClick={() => onNavigate('services')}
              className="px-8 py-4 border border-[#FAF9F6]/20 text-[#FAF9F6] font-outfit tracking-wide rounded-sm hover:border-[#C5A572]/50 hover:text-[#C5A572] transition-all duration-300"
            >
              View Services
            </button>
          </div>

          {/* Platform Icons */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 opacity-40">
            {['telegram', 'instagram', 'youtube', 'tiktok', 'facebook', 'twitter'].map(platform => {
              const IconComponent = PlatformIcons[platform as keyof typeof PlatformIcons];
              return IconComponent ? (
                <div key={platform} className="w-8 h-8 text-[#FAF9F6]/60">
                  <IconComponent />
                </div>
              ) : null;
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-[#C5A572] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-cormorant font-semibold text-[#0D0D0D]">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-outfit text-[#0D0D0D]/70 tracking-wide uppercase mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Platforms */}
      <section className="py-16 sm:py-24 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-[#C5A572] font-outfit uppercase mb-4">Our Services</p>
            <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light text-[#0D0D0D]">
              Platforms We <span className="italic">Target</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlatforms.map((platform) => {
              const IconComponent = PlatformIcons[platform.id as keyof typeof PlatformIcons];
              const maxDiscount = Math.max(...platform.services.map(s => s.discount));
              const minPrice = Math.min(...platform.services.map(s => s.price * (1 - s.discount / 100)));
              
              return (
                <div
                  key={platform.id}
                  onClick={() => handlePlatformOrder(platform.id)}
                  className="group relative p-6 bg-white border border-[#0D0D0D]/10 rounded-sm cursor-pointer hover:border-[#C5A572] hover:shadow-xl transition-all duration-500"
                >
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-green-500/10 rounded">
                    <span className="text-xs font-outfit font-semibold text-green-600">
                      Up to {maxDiscount}% OFF
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 text-[#0D0D0D]/80 mb-4 group-hover:text-[#C5A572] transition-colors">
                    {IconComponent && <IconComponent />}
                  </div>

                  {/* Name */}
                  <h3 className="font-cormorant text-xl font-semibold text-[#0D0D0D] mb-2">
                    {platform.name}
                  </h3>

                  {/* Services Count */}
                  <p className="text-sm text-[#0D0D0D]/60 font-outfit mb-4">
                    {platform.services.length} services available
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#0D0D0D]/50 font-outfit">From</span>
                    <span className="text-lg font-cormorant font-semibold text-[#C5A572]">
                      {formatPrice(minPrice, currency)}
                    </span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-[#0D0D0D]/20 text-[#0D0D0D] font-outfit tracking-wide rounded-sm hover:border-[#C5A572] hover:text-[#C5A572] transition-all duration-300"
            >
              View All 12 Platforms
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-cormorant text-lg text-[#FAF9F6] mb-1">{badge.title}</div>
                <div className="text-xs text-[#FAF9F6]/50 font-outfit">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Process */}
      <section className="py-16 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-light text-[#0D0D0D] mb-12">
            How It <span className="italic">Works</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Target', desc: 'Choose platform & service' },
              { step: '02', title: 'Submit Order', desc: 'Provide target details' },
              { step: '03', title: 'We Execute', desc: 'Target removed within TAT' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-5xl font-cormorant font-light text-[#C5A572]/20 mb-2">
                  {item.step}
                </div>
                <h3 className="font-cormorant text-xl text-[#0D0D0D] mb-2">{item.title}</h3>
                <p className="text-sm text-[#0D0D0D]/60 font-outfit">{item.desc}</p>
                
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#C5A572]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Review */}
      <section className="py-16 bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl text-[#C5A572]/30 font-cormorant mb-6">"</div>
          <p className="font-cormorant text-xl sm:text-2xl text-[#FAF9F6]/90 italic leading-relaxed mb-6">
            Incredibly professional service. They removed a defamatory Instagram account within 12 hours. 
            The process was completely anonymous and the support team kept me updated throughout.
          </p>
          <div className="flex items-center justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="text-[#C5A572]">★</span>
            ))}
          </div>
          <p className="text-sm text-[#FAF9F6]/50 font-outfit tracking-wide">
            — JAMES W. • <span className="text-green-500">Verified Client</span>
          </p>
          
          <button
            onClick={() => onNavigate('reviews')}
            className="mt-8 inline-flex items-center gap-2 text-[#C5A572] font-outfit text-sm tracking-wide hover:underline"
          >
            Read all 35+ reviews
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#C5A572] to-[#D4AF37]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl font-light text-[#0D0D0D] mb-6">
            Ready to Take <span className="italic">Action</span>?
          </h2>
          <p className="text-lg text-[#0D0D0D]/70 font-outfit mb-10 max-w-xl mx-auto">
            Join thousands of satisfied clients. Start your order now and see results within hours.
          </p>
          <button
            onClick={handleOrder}
            className="px-10 py-4 bg-[#0D0D0D] text-[#FAF9F6] font-outfit font-semibold tracking-wide rounded-sm hover:bg-[#1a1a1a] transition-all duration-300 hover:shadow-2xl"
          >
            Place Your Order Now
          </button>
        </div>
      </section>
    </div>
  );
}
