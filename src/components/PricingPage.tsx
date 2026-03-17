import { useState } from 'react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { platforms } from '../data/platforms';
import { PlatformIcons } from './Icons';

interface PricingPageProps {
  currency: Currency;
  onOrderClick: (platformId: string, serviceId: string) => void;
}

export default function PricingPage({ currency, onOrderClick }: PricingPageProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const filteredPlatforms = selectedPlatform
    ? platforms.filter(p => p.id === selectedPlatform)
    : platforms;

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">
              Transparent Pricing
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-4 sm:mb-6">
              Pay Only for <span className="italic text-gold">Results</span>
            </h1>
            <p className="text-base sm:text-lg text-ivory leading-relaxed mb-8">
              No hidden fees. No subscriptions. Just fair, upfront pricing with massive discounts.
            </p>
            
            {/* Guarantees */}
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { icon: '💰', text: 'Money-Back Guarantee' },
                { icon: '⚡', text: 'No Setup Fees' },
                { icon: '✓', text: 'Pay After Success' }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm px-4 py-3 rounded-lg border border-gold/20">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-medium text-ivory">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Filter */}
      <section className="py-8 bg-black/30 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedPlatform(null)}
              className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-all duration-300 ${
                selectedPlatform === null
                  ? 'bg-gold text-black'
                  : 'bg-white/5 text-ivory border border-white/10 hover:border-gold/50'
              }`}
            >
              All Platforms
            </button>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-all duration-300 ${
                  selectedPlatform === platform.id
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-ivory border border-white/10 hover:border-gold/50'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {filteredPlatforms.map((platform) => {
              const IconComponent = PlatformIcons[platform.id as keyof typeof PlatformIcons];
              const maxDiscount = Math.max(...platform.services.map(s => s.discount));
              return (
            <div key={platform.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 lg:p-12 border border-gold/10">
              {/* Platform Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 text-gold">
                    {IconComponent && <IconComponent />}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ivory">{platform.name}</h2>
                    <p className="text-xs sm:text-sm text-white/80 mt-1">{platform.services.length} services available</p>
                  </div>
                </div>
                <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
                  Up to {maxDiscount}% OFF
                </div>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20">
                      <th className="text-left text-xs tracking-wider uppercase text-gold pb-4">Service</th>
                      <th className="text-center text-xs tracking-wider uppercase text-gold pb-4 hidden sm:table-cell">TAT</th>
                      <th className="text-center text-xs tracking-wider uppercase text-gold pb-4">Discount</th>
                      <th className="text-right text-xs tracking-wider uppercase text-gold pb-4">Price</th>
                      <th className="text-right text-xs tracking-wider uppercase text-gold pb-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {platform.services.map((service) => {
                      const discountedPrice = service.price * (1 - service.discount / 100);
                      return (
                        <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 sm:py-6">
                            <div className="font-medium text-ivory">{service.name}</div>
                            <div className="text-xs text-white/90 mt-1 sm:hidden">TAT: {service.tat}</div>
                          </td>
                          <td className="py-4 sm:py-6 text-center hidden sm:table-cell">
                            <span className="text-sm text-white">{service.tat}</span>
                          </td>
                          <td className="py-4 sm:py-6 text-center">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                              {service.discount}% OFF
                            </span>
                          </td>
                          <td className="py-4 sm:py-6 text-right">
                            <div className="text-xs text-white/80 line-through">
                              {formatPrice(service.price, currency)}
                            </div>
                            <div className="text-lg font-serif text-gold">
                              {formatPrice(discountedPrice, currency)}
                            </div>
                          </td>
                          <td className="py-4 sm:py-6 text-right pl-4">
                            <button
                              onClick={() => onOrderClick(platform.id, service.id)}
                              className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-xs uppercase tracking-wider rounded hover:bg-gold hover:text-black transition-all duration-300"
                            >
                              Order
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent to-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-6">
            Ready to Get <span className="italic text-gold">Started</span>?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Select any service above to begin. Remember, you only pay after successful removal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSelectedPlatform(null)}
              className="px-8 py-4 bg-gold text-black font-medium text-sm uppercase tracking-wider rounded hover:bg-ivory transition-all duration-300"
            >
              View All Services
            </button>
            <a
              href="https://t.me/pdorq"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-transparent border border-ivory/20 text-ivory font-medium text-sm uppercase tracking-wider rounded hover:border-gold hover:text-gold transition-all duration-300"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
