import { Currency } from '../types';
import { platforms } from '../data/platforms';
import { PlatformIcons } from './Icons';
import { formatPrice } from '../utils/currency';
import { User } from './Auth';

interface ServicesPageProps {
  currency: Currency;
  onNavigate: (page: string) => void;
  onOrderWithPlatform: (platformId: string, serviceId?: string) => void;
  user: User | null;
  onLoginClick: () => void;
}

export default function ServicesPage({ currency, onNavigate: _onNavigate, onOrderWithPlatform, user, onLoginClick }: ServicesPageProps) {
  
  const handleServiceOrder = (platformId: string, serviceId?: string) => {
    if (!user) {
      onLoginClick();
    } else {
      onOrderWithPlatform(platformId, serviceId);
    }
  };
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <section className="py-16 sm:py-24 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs tracking-[0.3em] text-[#C5A572] font-outfit uppercase mb-4">
            All Platforms
          </p>
          <h1 className="font-cormorant text-4xl sm:text-5xl md:text-6xl font-light text-[#FAF9F6]">
            Our <span className="italic">Services</span>
          </h1>
          <p className="mt-6 text-[#FAF9F6]/60 font-outfit max-w-2xl mx-auto">
            Professional content removal across 12 major platforms with guaranteed results
          </p>
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="space-y-16">
            {platforms.map((platform) => {
              const IconComponent = PlatformIcons[platform.id as keyof typeof PlatformIcons];
              const maxDiscount = Math.max(...platform.services.map(s => s.discount));
              
              return (
                <div key={platform.id} className="relative">
                  {/* Platform Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 text-[#0D0D0D]">
                        {IconComponent && <IconComponent />}
                      </div>
                      <div>
                        <h2 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#0D0D0D]">
                          {platform.name}
                        </h2>
                        <p className="text-sm text-[#0D0D0D]/50 font-outfit">
                          {platform.services.length} services available
                        </p>
                      </div>
                    </div>
                    <div className="sm:ml-auto">
                      <span className="inline-block px-3 py-1 bg-green-500/10 rounded-full">
                        <span className="text-sm font-outfit font-semibold text-green-600">
                          Up to {maxDiscount}% OFF
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {platform.services.map((service) => {
                      const discountedPrice = service.price * (1 - service.discount / 100);
                      
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleServiceOrder(platform.id, service.id)}
                          className="group relative p-5 bg-white border border-[#0D0D0D]/10 rounded-sm cursor-pointer hover:border-[#C5A572] hover:shadow-lg transition-all duration-300"
                        >
                          {/* Discount Badge */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 bg-green-500/10 rounded">
                            <span className="text-xs font-outfit font-semibold text-green-600">
                              {service.discount}% OFF
                            </span>
                          </div>

                          {/* Service Name */}
                          <h3 className="font-cormorant text-lg font-semibold text-[#0D0D0D] mb-2 pr-16">
                            {service.name}
                          </h3>

                          {/* TAT */}
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-[#0D0D0D]/40 font-outfit uppercase tracking-wide">TAT:</span>
                            <span className="text-sm text-[#C5A572] font-outfit font-medium">{service.tat}</span>
                          </div>

                          {/* Price */}
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-cormorant font-semibold text-[#C5A572]">
                              {formatPrice(discountedPrice, currency)}
                            </span>
                            <span className="text-sm text-[#0D0D0D]/40 line-through font-outfit">
                              {formatPrice(service.price, currency)}
                            </span>
                          </div>

                          {/* Hover Arrow */}
                          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-5 h-5 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="mt-12 border-b border-[#0D0D0D]/10" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-cormorant text-3xl sm:text-4xl font-light text-[#FAF9F6] mb-6">
            Can't find what you need?
          </h2>
          <p className="text-[#FAF9F6]/60 font-outfit mb-8">
            Contact us for custom takedown requests or bulk orders
          </p>
          <a
            href="https://t.me/pdorq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C5A572] text-[#0D0D0D] font-outfit font-semibold tracking-wide rounded-sm hover:bg-[#D4AF37] transition-all duration-300"
          >
            Contact Support
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
