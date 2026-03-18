import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      // Show after 2 seconds
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookies-accepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#1A1A1A] border border-gold/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🍪</span>
              <h3 className="text-white font-medium">Cookie Notice</h3>
            </div>
            <p className="text-white/60 text-sm">
              We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. 
              By continuing to use our site, you consent to our use of cookies.
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-4 py-2 border border-white/20 text-white/80 rounded-lg hover:bg-white/5 transition-all text-sm"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2 bg-gold text-black font-medium rounded-lg hover:opacity-90 transition-all text-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
