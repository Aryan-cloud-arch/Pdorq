import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#0D0D0D] to-[#1a1a1a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block px-4 py-1 bg-[#C5A572]/10 border border-[#C5A572]/20 rounded-full text-xs tracking-widest text-[#C5A572] uppercase mb-4">
            Stay Updated
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-3">
            Get <span className="italic text-[#C5A572]">Exclusive</span> Updates
          </h2>
          <p className="font-outfit text-white/60 max-w-xl mx-auto">
            Subscribe to receive special discounts, platform updates, and industry insights.
            No spam, unsubscribe anytime.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {status === 'success' ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-green-500/10 border border-green-500/30 rounded-lg">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-outfit text-green-400">Successfully subscribed!</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 font-outfit focus:border-[#C5A572] focus:ring-1 focus:ring-[#C5A572] outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-outfit font-medium rounded-lg hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </form>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-white/40">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-outfit text-xs">100% Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <span className="font-outfit text-xs">No Spam</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-outfit text-xs">8,400+ subscribers</span>
          </div>
        </div>
      </div>
    </section>
  );
}
