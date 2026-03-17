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
import { platforms } from './data/platforms';

const defaultCurrency = {
  code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1,
  exchangeRate: '1.00'
};

type Page = 'home' | 'services' | 'reviews' | 'faq' | 'order' | 'pricing' | 'how-it-works' | 'about' | 'contact' | 'blog' | 'status';

export default function App() {
  const { user, profile, wallet, loading, signOut, refreshWallet } = useAuth();

  // UI State
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showLegal, setShowLegal] = useState<string | null>(null);
  const [currency, setCurrency] = useState(defaultCurrency);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Build user object for components
  const appUser = profile ? {
    name: profile.full_name || 'User',
    email: profile.email,
    isVerified: profile.is_verified
  } : null;

  const balance = wallet?.balance || 0;

  // Navigate with login check
  const navigateToOrder = (platform?: string, service?: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    if (platform) setSelectedPlatform(platform);
    if (service) setSelectedService(service);
    setCurrentPage('order');
    window.scrollTo(0, 0);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  const handleOrderSubmit = (order: any) => {
    setOrders(prev => [{ ...order, id: 'PDQ-' + Math.random().toString(36).substring(2, 8).toUpperCase(), date: new Date().toISOString(), status: 'processing' }, ...prev]);
  };

  const handleLoginClick = () => setShowAuth(true);

  const handleSignOut = async () => {
    await signOut();
  };

  // Page title
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'PDORQ — Elite Takedown Operations',
      services: 'Services — PDORQ',
      reviews: 'Reviews — PDORQ',
      faq: 'FAQ — PDORQ',
      order: 'Place Order — PDORQ',
      pricing: 'Pricing — PDORQ',
      'how-it-works': 'How It Works — PDORQ',
      about: 'About — PDORQ',
      contact: 'Contact — PDORQ',
      blog: 'Blog — PDORQ',
      status: 'Status — PDORQ'
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
      case 'home':
        return (
          <>
            <Hero onOrderClick={() => navigateToOrder()} />
            <Services
              platforms={platforms}
              currency={currency}
              onOrderClick={(platform, service) => navigateToOrder(platform, service)}
            />
            <TrustBadges />
            <Process />
            <Newsletter />
            <Footer
              onPageChange={handlePageChange}
              onLegalClick={(page) => setShowLegal(page)}
            />
          </>
        );
      case 'services':
        return (
          <>
            <ServicesPage
              platforms={platforms}
              currency={currency}
              onOrderClick={(platform, service) => navigateToOrder(platform, service)}
            />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'pricing':
        return (
          <>
            <PricingPage
              platforms={platforms}
              currency={currency}
              onOrderClick={(platform, service) => navigateToOrder(platform, service)}
            />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'how-it-works':
        return (
          <>
            <HowItWorksPage onOrderClick={() => navigateToOrder()} />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'about':
        return (
          <>
            <AboutPage />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'contact':
        return (
          <>
            <ContactPage />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'reviews':
        return (
          <>
            <Reviews />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'faq':
        return (
          <>
            <FAQ />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'order':
        return (
          <>
            {user ? (
              <OrderForm
                platforms={platforms}
                currency={currency}
                selectedPlatform={selectedPlatform}
                selectedService={selectedService}
                onSubmit={handleOrderSubmit}
                userBalance={balance}
              />
            ) : (
              <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-3">Authentication Required</h2>
                  <p className="text-white/60 mb-6">Sign in to place an order</p>
                  <button onClick={() => setShowAuth(true)} className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all">
                    Sign In
                  </button>
                </div>
              </div>
            )}
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'blog':
        return (
          <>
            <BlogPage />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      case 'status':
        return (
          <>
            <StatusPage />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
      default:
        return (
          <>
            <NotFoundPage onGoHome={() => handlePageChange('home')} />
            <Footer onPageChange={handlePageChange} onLegalClick={(page) => setShowLegal(page)} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <CursorGlow />

      {showAnnouncement && (
        <AnnouncementBar onClose={() => setShowAnnouncement(false)} />
      )}

      <div className={showAnnouncement ? 'pt-10' : ''}>
        <Navbar
          user={appUser}
          balance={balance}
          currency={currency}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onLoginClick={handleLoginClick}
          onSignOut={handleSignOut}
          onWalletClick={() => {
            if (!user) { setShowAuth(true); return; }
            setShowWallet(true);
          }}
          onSettingsClick={() => setShowSettings(true)}
          onOrdersClick={() => {
            if (!user) { setShowAuth(true); return; }
            setShowOrders(true);
          }}
          onOrderClick={() => navigateToOrder()}
        />

        {renderPage()}
      </div>

      {/* Modals */}
      <Auth
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => setShowAuth(false)}
      />

      {showWallet && (
        <Wallet
          isOpen={showWallet}
          onClose={() => setShowWallet(false)}
          balance={balance}
          currency={currency}
          onAddFunds={async (amount: number) => {
            await refreshWallet();
          }}
          isMobile={false}
        />
      )}

      {showSettings && (
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
      )}

      {showOrders && (
        <OrderHistory
          isOpen={showOrders}
          onClose={() => setShowOrders(false)}
          orders={orders}
          currency={currency}
        />
      )}

      {showLegal && (
        <LegalPages
          page={showLegal}
          onClose={() => setShowLegal(null)}
        />
      )}

      <LiveChat />
      <CookieConsent />
    </div>
  );
}
