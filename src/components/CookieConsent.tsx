interface CookieConsentProps {
  onAccept: () => void;
}

export default function CookieConsent({ onAccept }: CookieConsentProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-[#0D0D0D] rounded-2xl shadow-2xl border border-white/10 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="hidden sm:flex w-12 h-12 rounded-full bg-[#C5A572]/20 items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          {/* Text */}
          <div className="flex-1">
            <h4 className="font-outfit text-white font-medium mb-1">🍪 We use cookies</h4>
            <p className="font-outfit text-white/60 text-sm leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and for security. 
              By continuing to use our site, you agree to our{' '}
              <button className="text-[#C5A572] hover:underline">Privacy Policy</button>.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#C5A572] text-[#0D0D0D] rounded-lg font-outfit text-sm font-medium hover:bg-[#d4b584] transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={onAccept}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white/10 text-white rounded-lg font-outfit text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
