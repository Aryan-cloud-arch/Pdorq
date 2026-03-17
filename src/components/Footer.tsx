import React from 'react';
import { TelegramIcon } from './Icons';
import { Currency } from '../types';

interface FooterProps {
  currency: Currency;
  onLegalClick?: (page: 'terms' | 'privacy' | 'refund') => void;
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currency: _currency, onLegalClick, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  
  // Convert year to Roman numerals
  const toRoman = (num: number): string => {
    const romanNumerals: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, symbol] of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result;
  };

  return (
    <footer className="bg-[#0D0D0D] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <span 
                className="text-2xl tracking-[0.2em] text-[#C5A572]"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
              >
                PDORQ
              </span>
            </div>
            <p 
              className="text-xs text-white/90 leading-relaxed"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Professional content removal services across all major platforms. 
              Swift, discreet, and effective.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 
              className="text-[10px] tracking-[0.3em] text-white uppercase mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Quick Links
            </h4>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Services', page: 'services' },
                { label: 'Pricing', page: 'pricing' },
                { label: 'Reviews', page: 'reviews' },
                { label: 'FAQ', page: 'faq' },
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate?.(link.page)}
                  className="text-xs text-white/90 hover:text-[#C5A572] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
            {/* Company Links */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
              {[
                { label: 'About', page: 'about' },
                { label: 'Contact', page: 'contact' },
                { label: 'Blog', page: 'blog' },
                { label: 'Status', page: 'status' },
                { label: 'Referral', page: 'referral' },
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => onNavigate?.(link.page)}
                  className="text-xs text-white/80 hover:text-[#C5A572] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
              {[
                { label: 'Terms', page: 'terms' as const },
                { label: 'Privacy', page: 'privacy' as const },
                { label: 'Refunds', page: 'refund' as const },
              ].map((item) => (
                <button
                  key={item.page}
                  onClick={() => onLegalClick?.(item.page)}
                  className="text-[10px] text-white/70 hover:text-[#C5A572] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <h4 
              className="text-[10px] tracking-[0.3em] text-white uppercase mb-4"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Support
            </h4>
            <a
              href="https://t.me/pdorq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 text-white hover:border-[#C5A572] hover:text-[#C5A572] transition-all"
            >
              <TelegramIcon className="w-4 h-4" />
              <span 
                className="text-xs tracking-[0.1em]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                @pdorq
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-14 pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p 
            className="text-[10px] tracking-[0.2em] text-white/80 uppercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            © {toRoman(currentYear)} Pdorq. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span 
              className="text-[10px] text-white/70"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Orders managed on-site
            </span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span 
              className="text-[10px] text-white/70"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              24/7 Operations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
