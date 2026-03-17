import { useState, useEffect } from 'react';

interface NavbarProps {
  user: { name: string; email: string; isVerified: boolean } | null;
  balance: number;
  currency: { code: string; symbol: string; rate: number; flag?: string };
  currentPage: string;
  onPageChange: (page: string) => void;
  onLoginClick: () => void;
  onSignOut: () => void;
  onWalletClick: () => void;
  onSettingsClick: () => void;
  onOrdersClick: () => void;
  onOrderClick: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

export default function Navbar({
  user,
  balance,
  currency,
  currentPage,
  onPageChange,
  onLoginClick,
  onSignOut,
  onWalletClick,
  onSettingsClick,
  onOrdersClick,
  onOrderClick,
  isAdmin,
  onAdminClick
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' }
  ];

  const formatBalance = (bal: number) => {
    const converted = bal * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[#FAF9F6] shadow-lg py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onPageChange('home')} 
            className="flex items-center gap-2 group"
          >
            <span className={`text-xs ${isScrolled ? 'text-gold' : 'text-gold'}`}>◆</span>
            <span className={`text-xl sm:text-2xl font-serif tracking-[0.2em] ${isScrolled ? 'text-black' : 'text-white'}`}>
              PDORQ
            </span>
            <span className={`text-xs ${isScrolled ? 'text-gold' : 'text-gold'}`}>◆</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => onPageChange(link.id)}
                className={`text-sm tracking-wider transition-all ${
                  currentPage === link.id
                    ? (isScrolled ? 'text-gold' : 'text-gold')
                    : (isScrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white')
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Settings */}
            <button
              onClick={onSettingsClick}
              className={`p-2 rounded-lg transition-all ${isScrolled ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
            >
              <span className="text-sm">{currency.flag || '🌐'}</span>
            </button>

            {user ? (
              <>
                {/* Wallet */}
                <button
                  onClick={onWalletClick}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                    isScrolled ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <span className={`text-sm ${isScrolled ? 'text-black' : 'text-white'}`}>
                    {formatBalance(balance)}
                  </span>
                  <span className="text-gold text-xs">+</span>
                </button>

                {/* Admin Button */}
                {isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30"
                  >
                    Admin
                  </button>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                      isScrolled ? 'hover:bg-black/5' : 'hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-medium">
                      {user.name[0]}
                    </div>
                    <svg className={`w-4 h-4 ${isScrolled ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[#1A1A1A] border border-gold/20 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-white/60 text-sm truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={() => { onOrderClick(); setUserMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm"
                          >
                            Place Order
                          </button>
                          <button
                            onClick={() => { onOrdersClick(); setUserMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm"
                          >
                            My Orders
                          </button>
                          <button
                            onClick={() => { onWalletClick(); setUserMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm"
                          >
                            Wallet
                          </button>
                        </div>
                        <div className="p-2 border-t border-white/10">
                          <button
                            onClick={() => { onSignOut(); setUserMenuOpen(false); }}
                            className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isScrolled
                    ? 'bg-black text-white hover:opacity-90'
                    : 'bg-gold text-black hover:opacity-90'
                }`}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-black' : 'text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[#0D0D0D]/98" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative h-full flex flex-col p-6 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-serif text-white tracking-[0.2em]">PDORQ</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-white/60 text-sm">{user.email}</p>
                <p className="text-gold mt-2">{formatBalance(balance)}</p>
              </div>
            )}

            {/* Nav Links */}
            <div className="space-y-2 flex-1">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => { onPageChange(link.id); setMobileMenuOpen(false); }}
                  className={`w-full text-left p-3 rounded-lg text-lg ${
                    currentPage === link.id ? 'text-gold bg-gold/10' : 'text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              {user ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { onSettingsClick(); setMobileMenuOpen(false); }}
                      className="p-3 bg-white/5 rounded-lg text-white text-sm"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { onWalletClick(); setMobileMenuOpen(false); }}
                      className="p-3 bg-gold/20 rounded-lg text-gold text-sm"
                    >
                      Add Funds
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { onOrdersClick(); setMobileMenuOpen(false); }}
                      className="p-3 bg-white/5 rounded-lg text-white text-sm"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => { onOrderClick(); setMobileMenuOpen(false); }}
                      className="p-3 bg-gold rounded-lg text-black text-sm font-medium"
                    >
                      Place Order
                    </button>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { onAdminClick?.(); setMobileMenuOpen(false); }}
                      className="w-full p-3 bg-purple-500/20 rounded-lg text-purple-400 text-sm"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => { onSignOut(); setMobileMenuOpen(false); }}
                    className="w-full p-3 border border-red-500/30 rounded-lg text-red-400 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full p-3 bg-gold rounded-lg text-black font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
