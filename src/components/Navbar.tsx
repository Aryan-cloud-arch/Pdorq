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
  onTransactionsClick: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
}

export default function Navbar({ user, balance, currency, currentPage, onPageChange, onLoginClick, onSignOut, onWalletClick, onSettingsClick, onOrdersClick, onOrderClick, onTransactionsClick, isAdmin, onAdminClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const desktopNavLinks = [
    { id: 'home', label: 'Home' }, { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' }, { id: 'reviews', label: 'Reviews' }, { id: 'faq', label: 'FAQ' }
  ];

  const mobileNavLinks = [
    { id: 'home', label: 'Home', icon: '🏠' }, { id: 'services', label: 'Services', icon: '⚡' },
    { id: 'pricing', label: 'Pricing', icon: '💰' }, { id: 'how-it-works', label: 'How It Works', icon: '📋' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }, { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'about', label: 'About Us', icon: '👥' }, { id: 'contact', label: 'Contact', icon: '📞' },
  ];

  const formatBalance = (bal: number) => `${currency.symbol}${(bal * currency.rate).toFixed(2)}`;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#FAF9F6] shadow-lg py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button onClick={() => onPageChange('home')} className="flex items-center gap-2">
            <span className="text-gold text-xs">◆</span>
            <span className={`text-xl sm:text-2xl font-serif tracking-[0.2em] ${isScrolled ? 'text-black' : 'text-white'}`}>PDORQ</span>
            <span className="text-gold text-xs">◆</span>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {desktopNavLinks.map(link => (
              <button key={link.id} onClick={() => onPageChange(link.id)} className={`text-sm tracking-wider transition-all ${currentPage === link.id ? 'text-gold' : (isScrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white')}`}>
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button onClick={onSettingsClick} className={`p-2 rounded-lg transition-all ${isScrolled ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}>
              <span className="text-sm">{currency.flag || '🌐'}</span>
            </button>
            {user ? (
              <>
                <button onClick={onWalletClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isScrolled ? 'bg-black/5 hover:bg-black/10' : 'bg-white/10 hover:bg-white/20'}`}>
                  <span className={`text-sm ${isScrolled ? 'text-black' : 'text-white'}`}>{formatBalance(balance)}</span>
                  <span className="text-gold text-xs">+</span>
                </button>
                {isAdmin && <button onClick={onAdminClick} className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg hover:bg-purple-500/30">Admin</button>}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${isScrolled ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}>
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-medium">{user.name[0].toUpperCase()}</div>
                    <svg className={`w-4 h-4 ${isScrolled ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
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
                          <button onClick={() => { onOrderClick(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm">📝 Place Order</button>
                          <button onClick={() => { onOrdersClick(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm">📦 My Orders</button>
                          <button onClick={() => { onTransactionsClick(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm">💳 Transactions</button>
                          <button onClick={() => { onWalletClick(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg text-sm">💰 Wallet</button>
                        </div>
                        <div className="p-2 border-t border-white/10">
                          <button onClick={() => { onSignOut(); setUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm">🚪 Sign Out</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button onClick={onLoginClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isScrolled ? 'bg-black text-white' : 'bg-gold text-black'}`}>Sign In</button>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-black' : 'text-white'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden bg-[#0D0D0D]">
          <div className="h-full flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-gold text-xs">◆</span>
                <span className="text-xl font-serif text-white tracking-[0.2em]">PDORQ</span>
                <span className="text-gold text-xs">◆</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {user && (
              <div className="m-4 p-4 bg-white/5 border border-gold/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-lg font-medium">{user.name[0].toUpperCase()}</div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/60 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#0D0D0D] rounded-lg">
                  <div>
                    <p className="text-white/50 text-xs uppercase">Balance</p>
                    <p className="text-gold text-xl font-semibold">{formatBalance(balance)}</p>
                  </div>
                  <button onClick={() => { onWalletClick(); setMobileMenuOpen(false); }} className="px-4 py-2 bg-gold text-black text-sm font-medium rounded-lg">+ Add Funds</button>
                </div>
              </div>
            )}

            {user && (
              <div className="px-4 mb-4 grid grid-cols-2 gap-3">
                <button onClick={() => { onOrderClick(); setMobileMenuOpen(false); }} className="p-4 bg-gold rounded-xl text-center">
                  <span className="text-2xl block mb-1">📝</span>
                  <span className="text-black font-semibold text-sm">Place Order</span>
                </button>
                <button onClick={() => { onOrdersClick(); setMobileMenuOpen(false); }} className="p-4 bg-white/10 rounded-xl text-center">
                  <span className="text-2xl block mb-1">📦</span>
                  <span className="text-white text-sm">My Orders</span>
                </button>
                <button onClick={() => { onTransactionsClick(); setMobileMenuOpen(false); }} className="p-4 bg-white/10 rounded-xl text-center">
                  <span className="text-2xl block mb-1">💳</span>
                  <span className="text-white text-sm">Transactions</span>
                </button>
                <button onClick={() => { onWalletClick(); setMobileMenuOpen(false); }} className="p-4 bg-white/10 rounded-xl text-center">
                  <span className="text-2xl block mb-1">💰</span>
                  <span className="text-white text-sm">Wallet</span>
                </button>
              </div>
            )}

            <div className="flex-1 px-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Navigation</p>
              <div className="space-y-1">
                {mobileNavLinks.map(link => (
                  <button key={link.id} onClick={() => { onPageChange(link.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${currentPage === link.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/80 hover:bg-white/5'}`}>
                    <span className="text-lg">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/10 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { onSettingsClick(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-xl text-white">
                  <span>{currency.flag || '🌐'}</span><span className="text-sm">{currency.code}</span>
                </button>
                {!user && (
                  <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-3 bg-gold rounded-xl text-black font-medium">
                    <span>👤</span><span className="text-sm">Sign In</span>
                  </button>
                )}
              </div>
              {user && isAdmin && (
                <button onClick={() => { onAdminClick?.(); setMobileMenuOpen(false); }} className="w-full p-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400 font-medium flex items-center justify-center gap-2">
                  <span>🛡️</span>Admin Dashboard
                </button>
              )}
              {user && (
                <button onClick={() => { onSignOut(); setMobileMenuOpen(false); }} className="w-full p-3 border border-red-500/30 rounded-xl text-red-400 font-medium flex items-center justify-center gap-2">
                  <span>🚪</span>Sign Out
                </button>
              )}
              <a href="https://t.me/pdorq" target="_blank" rel="noopener noreferrer" className="w-full p-3 bg-[#0088cc]/20 rounded-xl text-[#0088cc] font-medium flex items-center justify-center gap-2">
                Support: @pdorq
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
