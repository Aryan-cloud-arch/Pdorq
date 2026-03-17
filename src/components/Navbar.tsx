import React, { useState, useEffect } from 'react';
import { TelegramIcon } from './Icons';
import Wallet from './Wallet';
import { Currency } from '../types';
import { User } from './Auth';

interface NavbarProps {
  currentPage?: string;
  onNavigate: (page: string) => void;
  walletBalance: number;
  onAddFunds: (amount: number) => void;
  currency: Currency;
  onSettingsClick: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  orderCount?: number;
  onOrdersClick?: () => void;
}

const ShimmerStyle = () => (
  <style>{`
    @keyframes shimmer {
      0% { transform: translateX(-200%) rotate(25deg); }
      100% { transform: translateX(200%) rotate(25deg); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.4; filter: blur(8px); }
      50% { opacity: 0.8; filter: blur(12px); }
    }
    @keyframes float-diamond {
      0%, 100% { transform: translateY(0) rotate(45deg) scale(1); }
      50% { transform: translateY(-2px) rotate(45deg) scale(1.1); }
    }
    @keyframes border-shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .logo-container {
      position: relative;
    }
    .logo-container::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 999px;
      padding: 1px;
      background: linear-gradient(90deg, transparent, #C5A572, #E8D5A3, #C5A572, transparent);
      background-size: 200% 100%;
      animation: border-shimmer 4s ease infinite;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0.6;
      transition: opacity 0.5s;
    }
    .logo-container:hover::before {
      opacity: 1;
    }
    .logo-shimmer {
      position: relative;
      overflow: hidden;
    }
    .logo-shimmer::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 40%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(232,213,163,0.3), transparent);
      animation: shimmer 3s ease-in-out infinite;
    }
    .logo-glow {
      position: absolute;
      inset: -6px;
      background: radial-gradient(ellipse, rgba(197,165,114,0.15), transparent 70%);
      animation: pulse-glow 3s ease-in-out infinite;
      border-radius: 999px;
      pointer-events: none;
    }
    .logo-diamond {
      animation: float-diamond 2s ease-in-out infinite;
    }
    .scrolled-logo .logo-glow {
      background: radial-gradient(ellipse, rgba(13,13,13,0.08), transparent 70%);
    }
    .mobile-menu-item {
      animation: slideIn 0.4s ease forwards;
    }
    .mobile-menu-item:nth-child(1) { animation-delay: 0.05s; }
    .mobile-menu-item:nth-child(2) { animation-delay: 0.1s; }
    .mobile-menu-item:nth-child(3) { animation-delay: 0.15s; }
    .mobile-menu-item:nth-child(4) { animation-delay: 0.2s; }
    .mobile-menu-item:nth-child(5) { animation-delay: 0.25s; }
    .mobile-menu-item:nth-child(6) { animation-delay: 0.3s; }
    .mobile-menu-item:nth-child(7) { animation-delay: 0.35s; }
    .mobile-menu-item:nth-child(8) { animation-delay: 0.4s; }
    .mobile-menu-item:nth-child(9) { animation-delay: 0.45s; }
  `}</style>
);

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, walletBalance, onAddFunds, currency, onSettingsClick, user, onLoginClick, onLogout, orderCount, onOrdersClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Services', page: 'services' },
    { name: 'Pricing', page: 'pricing' },
    { name: 'How It Works', page: 'how-it-works' },
    { name: 'Reviews', page: 'reviews' },
    { name: 'About', page: 'about' },
    { name: 'Contact', page: 'contact' },
    { name: 'FAQ', page: 'faq' },
  ];

  const handleNavClick = (page: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      onNavigate(page);
    }, 100);
  };

  return (
    <>
      <ShimmerStyle />
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-[#FAF9F6] shadow-[0_4px_30px_rgba(0,0,0,0.08)] py-2 sm:py-3 md:py-4' 
          : 'bg-transparent py-3 sm:py-4 md:py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className={`logo-container flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-500 hover:bg-white/5 ${
              isScrolled ? 'scrolled-logo hover:bg-black/5' : ''
            }`}>
              <div className="logo-glow" />
              
              {/* Left ornament */}
              <div className="hidden sm:flex items-center gap-1">
                <div className={`w-1 h-1 logo-diamond transition-colors duration-500 ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-[#C5A572]'}`} />
                <div className={`w-4 md:w-6 h-px transition-colors duration-500 ${isScrolled ? 'bg-[#0D0D0D]/30' : 'bg-[#C5A572]/50'}`} />
              </div>
              
              {/* Logo Text */}
              <div className="relative logo-shimmer">
                <span className={`font-cormorant text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.15em] transition-colors duration-500 ${
                  isScrolled ? 'text-[#0D0D0D]' : 'text-[#C5A572]'
                }`}>
                  P<span className={`transition-colors duration-500 ${isScrolled ? 'text-[#0D0D0D]/70' : 'text-[#E8D5A3]'}`}>D</span>ORQ
                </span>
                <span className={`absolute -bottom-1 left-0 right-0 text-center font-outfit text-[6px] sm:text-[7px] md:text-[8px] tracking-[0.4em] uppercase transition-colors duration-500 ${
                  isScrolled ? 'text-[#0D0D0D]/40' : 'text-[#C5A572]/60'
                }`}>
                  Elite Ops
                </span>
              </div>
              
              {/* Right ornament */}
              <div className="hidden sm:flex items-center gap-1">
                <div className={`w-4 md:w-6 h-px transition-colors duration-500 ${isScrolled ? 'bg-[#0D0D0D]/30' : 'bg-[#C5A572]/50'}`} />
                <div className={`w-1 h-1 logo-diamond transition-colors duration-500 ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-[#C5A572]'}`} />
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.page)}
                  className={`group relative font-outfit text-sm tracking-[0.2em] uppercase transition-colors duration-500 ${
                    currentPage === link.page 
                      ? (isScrolled ? 'text-[#C5A572]' : 'text-[#C5A572]')
                      : (isScrolled ? 'text-[#0D0D0D]/70 hover:text-[#0D0D0D]' : 'text-white/70 hover:text-white')
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                    currentPage === link.page ? 'w-full bg-[#C5A572]' : 'w-0 group-hover:w-full'
                  } ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-[#C5A572]'}`} />
                </button>
              ))}
              
              {/* Support Link */}
              <a
                href="https://t.me/pdorq"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 font-outfit text-sm tracking-[0.15em] uppercase transition-colors duration-500 ${
                  isScrolled ? 'text-[#0D0D0D]/70 hover:text-[#0D0D0D]' : 'text-white/70 hover:text-white'
                }`}
              >
                <TelegramIcon className="w-4 h-4" />
                <span className="hidden xl:inline">Support</span>
              </a>
            </div>

            {/* Right side: Settings + Wallet + Order Button */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {/* Currency & Settings Button */}
              <button
                onClick={onSettingsClick}
                className={`group flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-500 ${
                  isScrolled
                    ? 'border-[#0D0D0D]/20 hover:border-[#C5A572] hover:bg-[#C5A572]/10'
                    : 'border-white/20 hover:border-[#C5A572] hover:bg-white/5'
                }`}
              >
                {/* Currency Info */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{currency.flag}</span>
                  <div className="text-left">
                    <span className={`text-xs font-semibold block leading-none ${isScrolled ? 'text-[#0D0D0D]' : 'text-white'}`}>
                      {currency.code}
                    </span>
                    {currency.code !== 'USD' && (
                      <span className={`text-[10px] leading-none ${isScrolled ? 'text-[#0D0D0D]/50' : 'text-white/50'}`}>
                        1$ = {currency.symbol}{currency.rate % 1 === 0 ? currency.rate : currency.rate.toFixed(2)}
                      </span>
                    )}
                    {currency.code === 'USD' && (
                      <span className={`text-[10px] leading-none ${isScrolled ? 'text-[#0D0D0D]/50' : 'text-white/50'}`}>
                        Base
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Settings Icon */}
                <svg 
                  className={`w-4 h-4 transition-all duration-500 group-hover:rotate-90 ${isScrolled ? 'text-[#0D0D0D]/50' : 'text-white/50'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Wallet */}
              <Wallet 
                balance={walletBalance}
                onAddFunds={onAddFunds}
                isScrolled={isScrolled}
                isMobile={false}
                currency={currency}
              />
              
              {/* User Menu or Login */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-[#C5A572]"
                    />
                    <span className={`font-outfit text-sm ${isScrolled ? 'text-[#0D0D0D]' : 'text-white'}`}>
                      {user.name.split(' ')[0]}
                    </span>
                    <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} ${isScrolled ? 'text-[#0D0D0D]' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="p-4 border-b border-[#333]">
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-white/50 text-xs mt-0.5">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => { setShowUserMenu(false); onNavigate('order'); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-left text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Place Order
                        </button>
                        <button 
                          onClick={() => { setShowUserMenu(false); onOrdersClick?.(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-left text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          My Orders
                          {orderCount && orderCount > 0 && (
                            <span className="ml-auto text-xs bg-[#C5A572] text-[#0D0D0D] px-1.5 py-0.5 rounded-full">{orderCount}</span>
                          )}
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 text-left text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </button>
                      </div>
                      <div className="p-2 border-t border-[#333]">
                        <button 
                          onClick={() => { setShowUserMenu(false); onLogout(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 text-left text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className={`px-4 xl:px-6 py-2 rounded-full font-outfit text-sm tracking-[0.15em] uppercase transition-all duration-500 ${
                    isScrolled
                      ? 'border border-[#0D0D0D] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-white'
                      : 'border border-[#C5A572] text-[#C5A572] hover:bg-[#C5A572] hover:text-[#0D0D0D]'
                  }`}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation ${
                isScrolled 
                  ? 'bg-[#0D0D0D]/5 active:bg-[#0D0D0D]/10' 
                  : 'bg-white/10 active:bg-white/20'
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center gap-1.5">
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'w-5 sm:w-6 rotate-45 translate-y-2' : 'w-5 sm:w-6'
                } ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-white'}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'w-0 opacity-0' : 'w-4 sm:w-5'
                } ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-white'}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'w-5 sm:w-6 -rotate-45 -translate-y-2' : 'w-3 sm:w-4'
                } ${isScrolled ? 'bg-[#0D0D0D]' : 'bg-white'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0D0D0D]/98 backdrop-blur-md"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content - Scrollable */}
          <div className="relative h-full overflow-y-auto overscroll-contain">
            <div className="min-h-full flex flex-col px-6 py-8 pb-safe">
              
              {/* Top Section - Logo & Close hint */}
              <div className="flex-shrink-0 pt-16 pb-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mobile-menu-item opacity-0">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C5A572] rotate-45" />
                  <div className="w-6 sm:w-8 h-px bg-[#C5A572]/50" />
                  <span className="font-cormorant text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.2em] text-[#C5A572]">PDORQ</span>
                  <div className="w-6 sm:w-8 h-px bg-[#C5A572]/50" />
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#C5A572] rotate-45" />
                </div>
              </div>
              
              {/* Middle Section - Nav Links (grows to fill space) */}
              <div className="flex-1 flex flex-col items-center justify-center gap-5 sm:gap-6 py-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.page)}
                    className={`mobile-menu-item opacity-0 font-cormorant text-2xl sm:text-3xl md:text-4xl transition-colors tracking-wider touch-manipulation py-1 ${
                      currentPage === link.page ? 'text-[#C5A572]' : 'text-white/90 hover:text-[#C5A572]'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </div>
              
              {/* Bottom Section - Wallet, Settings, CTA */}
              <div className="flex-shrink-0 space-y-3 sm:space-y-4 pt-4 pb-8 mobile-menu-item opacity-0" style={{ animationDelay: '0.3s' }}>
                
                {/* Balance Display */}
                <div className="text-center py-3 border-t border-b border-white/10">
                  <span className="text-white/40 text-xs sm:text-sm font-outfit tracking-[0.2em] uppercase">Your Balance</span>
                  <p className="text-[#C5A572] text-xl sm:text-2xl font-cormorant mt-1">
                    {currency.symbol}{(walletBalance * currency.rate).toFixed(currency.code === 'INR' || currency.code === 'RUB' ? 0 : 2)}
                  </p>
                </div>
                
                {/* Currency & Exchange Rate Display */}
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{currency.flag}</span>
                    <div>
                      <span className="text-white font-semibold text-sm">{currency.code}</span>
                      <span className="text-white/50 text-xs ml-1.5">{currency.name}</span>
                    </div>
                  </div>
                  {currency.code !== 'USD' ? (
                    <div className="text-right">
                      <span className="text-white/40 text-[10px] tracking-wider uppercase block">Rate</span>
                      <span className="text-[#C5A572] font-semibold text-sm">1$ = {currency.symbol}{currency.rate % 1 === 0 ? currency.rate : currency.rate.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 tracking-wider uppercase px-2 py-1 bg-white/5 rounded">Base Currency</span>
                  )}
                </div>

                {/* Two buttons in a row: Settings & Add Funds */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Settings Button */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => onSettingsClick(), 100);
                    }}
                    className="flex flex-col items-center justify-center gap-1 py-3 sm:py-4 rounded-xl border border-white/20 text-white/80 font-outfit hover:border-[#C5A572] hover:text-[#C5A572] transition-all active:scale-[0.98] touch-manipulation"
                  >
                    <svg 
                      className="w-5 h-5"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] tracking-[0.15em] uppercase">Settings</span>
                  </button>
                  
                  {/* Add Funds Button */}
                  <Wallet 
                    balance={walletBalance}
                    onAddFunds={onAddFunds}
                    isScrolled={false}
                    isMobile={true}
                    currency={currency}
                  />
                </div>
                
                {/* User or Login CTA */}
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-[#C5A572]"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-white/50 text-xs">{user.email}</p>
                      </div>
                      {user.isVerified && (
                        <span className="text-green-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setTimeout(() => onNavigate('order'), 100);
                        }}
                        className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#C5A572] to-[#E8D5A3] text-[#0D0D0D] font-outfit font-semibold tracking-[0.1em] uppercase text-xs hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all active:scale-[0.98] touch-manipulation"
                      >
                        Place Order
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setTimeout(() => onOrdersClick?.(), 100);
                        }}
                        className="w-full py-3 sm:py-3.5 rounded-xl border border-[#C5A572] text-[#C5A572] font-outfit font-semibold tracking-[0.1em] uppercase text-xs hover:bg-[#C5A572]/10 transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                        {orderCount && orderCount > 0 && (
                          <span className="text-[10px] bg-[#C5A572] text-[#0D0D0D] px-1.5 py-0.5 rounded-full">{orderCount}</span>
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-outfit tracking-[0.1em] uppercase text-xs hover:bg-red-500/10 transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(() => onLoginClick(), 100);
                    }}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#C5A572] to-[#E8D5A3] text-[#0D0D0D] font-outfit font-semibold tracking-[0.15em] uppercase text-sm hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all active:scale-[0.98] touch-manipulation"
                  >
                    Sign In / Sign Up
                  </button>
                )}
                
                {/* Support Link */}
                <a
                  href="https://t.me/pdorq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-white/40 hover:text-white/70 text-xs sm:text-sm font-outfit tracking-wider transition-colors touch-manipulation py-2"
                >
                  <TelegramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>@pdorq — Support</span>
                </a>
              </div>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
