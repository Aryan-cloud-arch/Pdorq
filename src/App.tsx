import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Process from './components/Process';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Wallet from './components/Wallet';
import Settings from './components/Settings';
import OrderForm from './components/OrderForm';
import OrderHistory from './components/OrderHistory';
import UserTransactions from './components/UserTransactions';
import LiveChat from './components/LiveChat';
import CookieConsent from './components/CookieConsent';
import AnnouncementBar from './components/AnnouncementBar';
import CursorGlow from './components/CursorGlow';
import TrustBadges from './components/TrustBadges';
import LegalPages from './components/LegalPages';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import PricingPage from './components/PricingPage';
import HowItWorksPage from './components/HowItWorksPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import NotFoundPage from './components/NotFoundPage';
import BlogPage from './components/BlogPage';
import StatusPage from './components/StatusPage';
import Newsletter from './components/Newsletter';
import AdminDashboard from './components/AdminDashboard';
import { platforms } from './data/platforms';
import { isAdmin } from './lib/adminApi';

const defaultCurrency = { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1 };

type Page = 'home' | 'services' | 'reviews' | 'faq' | 'order' | 'pricing' | 'how-it-works' | 'about' | 'contact' | 'blog' | 'status';

export default function App() {
  const { user, profile, wallet, loading, signOut, refreshWallet } = useAuth();

  const getSavedCurrency = () => {
    try {
      const saved = localStorage.getItem('preferred-currency');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultCurrency;
  };

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showLegal, setShowLegal] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [currency, setCurrency] = useState(getSavedCurrency);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    if (user) {
      isAdmin(user.id).then(setIsAdminUser);
    } else {
      setIsAdminUser(false);
    }
  }, [user]);

  const appUser = profile ? {
    name: profile.full_name || 'User',
    email: profile.email,
    isVerified: profile.is_verified
  } : null;

  const balance = wallet?.balance || 0;

  const navigateToOrder = (platform?: string, service?: string) => {
    if (!user) { setShowAuth(true); return; }
    if (platform) setSelectedPlatform(platform);
    if (service) setSelectedService(service);
    setCurrentPage('order');
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  const handleOrderSubmit = async () => { await refreshWallet(); };
  const handleCurrencyChange = (newCurrency: typeof currency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferred-currency', JSON.stringify(newCurrency));
  };

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'PDORQ — Elite Takedown Operations', services: 'Services — PDORQ',
      reviews: 'Reviews — PDORQ', faq: 'FAQ — PDORQ', order: 'Place Order — PDORQ',
      pricing: 'Pricing — PDORQ', 'how-it-works': 'How It Works — PDORQ',
      about: 'About — PDORQ', contact: 'Contact — PDORQ', blog: 'Blog — PDORQ', status: 'Status — PDORQ'
    };
    document.title = titles[currentPage] || 'PDORQ';
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mb-4"></div>
          <p className="text-white/60 text-sm tracking-[0.3em] uppercase">Loading</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return (<><Hero onOrderClick={() => navigateToOrder()} /><Services platforms={platforms} currency={currency} onOrderClick={(p, s) => navigateToOrder(p, s)} /><TrustBadges /><Process /><Newsletter /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'services': return (<><ServicesPage platforms={platforms} currency={currency} onOrderClick={(p, s) => navigateToOrder(p, s)} /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'pricing': return (<><PricingPage platforms={platforms} currency={currency} onOrderClick={(p, s) => navigateToOrder(p, s)} /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'how-it-works': return (<><HowItWorksPage onOrderClick={() => navigateToOrder()} /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'about': return (<><AboutPage /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'contact': return (<><ContactPage /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'reviews': return (<><Reviews /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'faq': return (<><FAQ /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'order': return (<>{user ? (<OrderForm platforms={platforms} currency={currency} selectedPlatform={selectedPlatform} selectedService={selectedService} onSubmit={handleOrderSubmit} userBalance={balance} />) : (<div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4"><div className="text-center max-w-md"><div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center"><svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div><h2 className="text-2xl font-serif text-white mb-3">Authentication Required</h2><p className="text-white/60 mb-6">Sign in to place an order</p><button onClick={() => setShowAuth(true)} className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90">Sign In</button></div></div>)}<Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'blog': return (<><BlogPage /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      case 'status': return (<><StatusPage /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
      default: return (<><NotFoundPage onGoHome={() => handlePageChange('home')} /><Footer onPageChange={handlePageChange} onLegalClick={(p) => setShowLegal(p)} /></>);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <CursorGlow />
      {showAnnouncement && <AnnouncementBar onClose={() => setShowAnnouncement(false)} />}
      <div className={showAnnouncement ? 'pt-10' : ''}>
        <Navbar
          user={appUser} balance={balance} currency={currency} currentPage={currentPage}
          onPageChange={handlePageChange} onLoginClick={() => setShowAuth(true)}
          onSignOut={async () => await signOut()}
          onWalletClick={() => { if (!user) { setShowAuth(true); return; } setShowWallet(true); }}
          onSettingsClick={() => setShowSettings(true)}
          onOrdersClick={() => { if (!user) { setShowAuth(true); return; } setShowOrders(true); }}
          onOrderClick={() => navigateToOrder()}
          onTransactionsClick={() => { if (!user) { setShowAuth(true); return; } setShowTransactions(true); }}
          isAdmin={isAdminUser} onAdminClick={() => setShowAdmin(true)}
        />
        {renderPage()}
      </div>

      <Auth isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
      {showWallet && <Wallet isOpen={showWallet} onClose={() => setShowWallet(false)} balance={balance} currency={currency} onAddFunds={async () => { await refreshWallet(); }} isMobile={false} />}
      {showSettings && <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} currency={currency} onCurrencyChange={handleCurrencyChange} />}
      {showOrders && <OrderHistory isOpen={showOrders} onClose={() => setShowOrders(false)} currency={currency} />}
      {showTransactions && <UserTransactions isOpen={showTransactions} onClose={() => setShowTransactions(false)} currency={currency} />}
      {showLegal && <LegalPages page={showLegal} onClose={() => setShowLegal(null)} />}
      {showAdmin && <AdminDashboard isOpen={showAdmin} onClose={() => setShowAdmin(false)} />}
      <LiveChat />
      <CookieConsent />
    </div>
  );
}
