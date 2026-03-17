import { useState, useEffect } from 'react';
import { Platform, Service, Currency } from './types';
import { platforms } from './data/platforms';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ServicesPage from './components/ServicesPage';
import OrderForm from './components/OrderForm';
import Reviews from './components/Reviews';
import Support from './components/Support';
import Footer from './components/Footer';
import CursorGlow from './components/CursorGlow';
import Settings, { currencies } from './components/Settings';
import Auth, { User } from './components/Auth';
import FAQ from './components/FAQ';
import LegalPages from './components/LegalPages';
import LiveChat, { ChatButton } from './components/LiveChat';
import CookieConsent from './components/CookieConsent';
import OrderHistory from './components/OrderHistory';
import AnnouncementBar from './components/AnnouncementBar';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PricingPage from './components/PricingPage';
import HowItWorksPage from './components/HowItWorksPage';
import ReferralProgram from './components/ReferralProgram';
import StatusPage from './components/StatusPage';
import BlogPage from './components/BlogPage';
import Newsletter from './components/Newsletter';

type Page = 'home' | 'services' | 'reviews' | 'faq' | 'order' | 'dashboard' | 'about' | 'contact' | 'pricing' | 'how-it-works' | 'referral' | 'status' | 'blog';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [preSelectedPlatform, setPreSelectedPlatform] = useState<Platform | null>(null);
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);
  const [user, setUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [cookieConsent, setCookieConsent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pdorq_cookie_consent') === 'true';
    }
    return false;
  });
  const [legalPage, setLegalPage] = useState<'terms' | 'privacy' | 'refund' | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  // Handle cookie consent
  useEffect(() => {
    if (cookieConsent) {
      localStorage.setItem('pdorq_cookie_consent', 'true');
    }
  }, [cookieConsent]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleAddFunds = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  const navigateTo = (page: string) => {
    if (page === 'dashboard') {
      setShowOrderHistory(true);
    } else {
      setCurrentPage(page as Page);
    }
  };

  const handleOrderWithPlatform = (platformId: string, serviceId?: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (platform) {
      setPreSelectedPlatform(platform);
      if (serviceId) {
        const service = platform.services.find(s => s.id === serviceId);
        setPreSelectedService(service || null);
      } else {
        setPreSelectedService(null);
      }
      setCurrentPage('order');
    }
  };

  const handleClearPreselection = () => {
    setPreSelectedPlatform(null);
    setPreSelectedService(null);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.balance > 0) {
      setWalletBalance(prev => prev + loggedInUser.balance);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setWalletBalance(0);
  };

  const handleOrderSubmit = (orderData: any) => {
    const newOrder = {
      id: `PDQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            currency={currency}
            onNavigate={navigateTo}
            onOrderWithPlatform={handleOrderWithPlatform}
            user={user}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        );
      case 'services':
        return (
          <ServicesPage 
            currency={currency}
            onNavigate={navigateTo}
            onOrderWithPlatform={handleOrderWithPlatform}
            user={user}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        );
      case 'reviews':
        return <Reviews />;
      case 'faq':
        return <FAQ />;
      case 'about':
        return <AboutPage currency={currency} />;
      case 'contact':
        return <ContactPage />;
      case 'pricing':
        return <PricingPage currency={currency} onOrderClick={handleOrderWithPlatform} />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'referral':
        return <ReferralProgram currency={currency} user={user} />;
      case 'status':
        return <StatusPage onNavigate={navigateTo} />;
      case 'blog':
        return <BlogPage onNavigate={navigateTo} />;
      case 'order':
        // Login gate for order page
        if (!user) {
          return (
            <div className="pt-32 pb-20 px-4">
              <div className="max-w-md mx-auto text-center">
                <div className="bg-gradient-to-br from-[#1C1C1C] to-[#0D0D0D] border border-[#C5A572]/20 rounded-2xl p-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[#C5A572]/10 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="font-cormorant text-3xl mb-3 text-white">Authentication Required</h2>
                  <p className="text-[#FAF9F6]/60 mb-8">Sign in to place an order and track your requests</p>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-left">
                      <svg className="w-5 h-5 text-[#C5A572] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#FAF9F6]/80">Track all your orders</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <svg className="w-5 h-5 text-[#C5A572] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#FAF9F6]/80">Wallet & secure payments</span>
                    </div>
                    <div className="flex items-center gap-3 text-left">
                      <svg className="w-5 h-5 text-[#C5A572] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#FAF9F6]/80">Priority support access</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full py-3 bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-medium rounded-lg hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="w-full py-3 border border-[#C5A572]/30 text-[#C5A572] font-medium rounded-lg hover:bg-[#C5A572]/10 transition-all"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <div className="pt-20">
            <OrderForm 
              preSelectedPlatform={preSelectedPlatform}
              preSelectedService={preSelectedService}
              onClearPreselection={handleClearPreselection}
              currency={currency}
              onOrderSubmit={handleOrderSubmit}
            />
          </div>
        );
      default:
        return (
          <HomePage 
            currency={currency}
            onNavigate={navigateTo}
            onOrderWithPlatform={handleOrderWithPlatform}
            user={user}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0D0D0D] selection:bg-[#C5A572]/30 selection:text-white"
      style={{ fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Outfit:wght@300;400;500&display=swap" 
        rel="stylesheet" 
      />

      {/* Cursor Glow Effect */}
      <CursorGlow />

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Main Content Wrapper - adds padding when announcement bar is visible */}
      <div className="pt-10">
      
      {/* Navigation */}
      <Navbar 
        currentPage={currentPage}
        onNavigate={navigateTo}
        walletBalance={walletBalance}
        onAddFunds={handleAddFunds}
        currency={currency}
        onSettingsClick={() => setIsSettingsOpen(true)}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        orderCount={orders.length}
        onOrdersClick={() => setShowOrderHistory(true)}
      />

      {/* Auth Modal */}
      <Auth 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        currency={currency}
      />

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentCurrency={currency}
        onCurrencyChange={handleCurrencyChange}
      />

      {/* Legal Pages Modal */}
      {legalPage && (
        <LegalPages 
          page={legalPage}
          onClose={() => setLegalPage(null)}
        />
      )}

      {/* Order History Modal */}
      <OrderHistory 
        isOpen={showOrderHistory}
        onClose={() => setShowOrderHistory(false)}
        orders={orders}
        currency={currency}
      />

      {/* Live Chat */}
      <LiveChat 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        userName={user?.name}
      />

      {/* Chat Button (only show when chat is closed) */}
      {!showChat && (
        <ChatButton onClick={() => setShowChat(true)} />
      )}

      {/* Cookie Consent */}
      {!cookieConsent && (
        <CookieConsent onAccept={() => setCookieConsent(true)} />
      )}

      {/* Main Content */}
      <main>
        {renderPage()}
      </main>

      {/* Newsletter Section (only on home) */}
      {currentPage === 'home' && <Newsletter />}

      {/* Support Section (only on home) */}
      {currentPage === 'home' && <Support />}

      {/* Footer */}
      <Footer 
        currency={currency}
        onLegalClick={(page) => setLegalPage(page)}
        onNavigate={navigateTo}
      />

      {/* Back to Top Button */}
      <BackToTop />
      </div>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-40 p-3 bg-[#C5A572] text-[#0D0D0D] rounded-full shadow-lg hover:bg-[#D4AF37] transition-all duration-300 hover:scale-110"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
}

export default App;
