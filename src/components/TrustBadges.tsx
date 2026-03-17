export default function TrustBadges() {
  return (
    <section className="py-12 sm:py-16 bg-[#0D0D0D] border-y border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-outfit text-white text-xs sm:text-sm tracking-[0.2em] uppercase">
            Trusted & Secured
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {/* SSL Secured */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-outfit text-white text-sm font-medium">SSL Secured</h4>
            <p className="font-outfit text-white/80 text-xs mt-1">256-bit encryption</p>
          </div>

          {/* Verified Business */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h4 className="font-outfit text-white text-sm font-medium">Verified Business</h4>
            <p className="font-outfit text-white/80 text-xs mt-1">Since 2019</p>
          </div>

          {/* Payment Secure */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h4 className="font-outfit text-white text-sm font-medium">Secure Payments</h4>
            <p className="font-outfit text-white/80 text-xs mt-1">Multiple options</p>
          </div>

          {/* 24/7 Support */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#C5A572]/20 to-[#C5A572]/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="font-outfit text-white text-sm font-medium">24/7 Support</h4>
            <p className="font-outfit text-white/80 text-xs mt-1">Always available</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-12 pt-10 border-t border-white/5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="font-cormorant text-3xl sm:text-4xl text-[#C5A572]">12,400+</p>
              <p className="font-outfit text-white/90 text-xs sm:text-sm mt-1">Successful Takedowns</p>
            </div>
            <div className="text-center">
              <p className="font-cormorant text-3xl sm:text-4xl text-[#C5A572]">99.2%</p>
              <p className="font-outfit text-white/90 text-xs sm:text-sm mt-1">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="font-cormorant text-3xl sm:text-4xl text-[#C5A572]">&lt;6h</p>
              <p className="font-outfit text-white/90 text-xs sm:text-sm mt-1">Avg. Response</p>
            </div>
            <div className="text-center">
              <p className="font-cormorant text-3xl sm:text-4xl text-[#C5A572]">50+</p>
              <p className="font-outfit text-white/90 text-xs sm:text-sm mt-1">Countries Served</p>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-10 border-t border-white/5">
          <p className="font-outfit text-white text-xs text-center mb-6 tracking-wider uppercase">
            Accepted Payment Methods
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {/* Bitcoin */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <svg className="w-6 h-6 text-[#F7931A]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.52 2.1c-.347-.087-.704-.17-1.06-.25l.53-2.12-1.317-.33-.54 2.15c-.286-.067-.567-.132-.84-.2l.001-.008-1.815-.453-.35 1.407s.974.223.955.237c.535.136.63.492.614.775l-.616 2.47c.037.01.085.025.138.047l-.14-.035-.864 3.46c-.066.163-.232.41-.607.318.013.02-.956-.239-.956-.239l-.652 1.514 1.713.427c.318.08.63.164.937.243l-.548 2.2 1.316.33.54-2.157c.36.1.707.19 1.05.273l-.538 2.146 1.316.33.547-2.19c2.24.424 3.926.253 4.635-1.774.57-1.637-.028-2.58-1.21-3.196.86-.198 1.508-.765 1.68-1.934z"/>
              </svg>
              <span className="font-outfit text-white text-sm">Bitcoin</span>
            </div>
            
            {/* Ethereum */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <svg className="w-6 h-6 text-[#627EEA]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
              </svg>
              <span className="font-outfit text-white text-sm">Ethereum</span>
            </div>
            
            {/* USDT */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <svg className="w-6 h-6 text-[#26A17B]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.572 13.645c-.033.197-.066.36-.116.506l-.022.07c-.326.961-1.263 1.631-2.554 1.882v1.814h-1.573v-1.74c-.41-.001-.831-.013-1.259-.037v1.777H10.48v-1.814c-.34-.02-.682-.041-1.02-.041H6.942l.32-1.77s1.166.024 1.146.001c.452 0 .595-.329.627-.545v-3.77h.134c-.045-.002-.092-.003-.134-.003v-2.694c-.062-.328-.302-.696-.919-.696.024-.018-1.147 0-1.147 0v-1.59h2.643v-.001c.324 0 .657.007.996.021V3.22h1.568v1.76c.427-.01.857-.015 1.283-.01V3.22h1.573v1.783c1.4.164 2.478.65 2.834 1.599l.015.044.004.014.002.007c.065.187.115.39.145.61.026.189.038.397.032.622v.007c.002.178-.013.362-.046.55-.047.272-.13.538-.247.79-.02.044-.042.087-.065.129l-.006.012a2.925 2.925 0 01-.456.628c.574.394.96.935 1.094 1.578.003.018.007.036.01.054.032.178.048.362.048.548 0 .168-.012.333-.036.495zm-3.01-2.326c-.003 0-.568-.083-1.73-.083l-.086.001c-1.163.005-1.725.086-1.728.087-.003 0-.003-2.035 0-2.035.003 0 .567-.082 1.728-.087l.086-.001c1.162.005 1.727.087 1.73.087-.003.001-.003 2.031 0 2.031zm.535 2.763c-.003.001-.672.098-2.047.103l-.101.001c-1.373-.006-2.041-.103-2.044-.104.003 0 .003-2.203 0-2.203.003 0 .672-.097 2.044-.102l.101-.001c1.375.006 2.044.103 2.047.103-.003.001-.003 2.203 0 2.203z"/>
              </svg>
              <span className="font-outfit text-white text-sm">USDT</span>
            </div>
            
            {/* Visa */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <svg className="w-8 h-6 text-[#1A1F71]" viewBox="0 0 48 32" fill="currentColor">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M19.5 21h-3l1.875-11.5h3L19.5 21zm13.125-11.225c-.6-.225-1.5-.475-2.625-.475-2.9 0-4.95 1.5-4.975 3.65-.025 1.6 1.475 2.475 2.6 3 1.15.55 1.55.9 1.55 1.375-.01.75-.95 1.1-1.8 1.1-1.2 0-1.85-.175-2.825-.6l-.4-.175-.425 2.575c.7.325 2 .6 3.35.625 3.1 0 5.1-1.5 5.125-3.775.015-1.25-.775-2.2-2.45-2.975-1.025-.5-1.65-.85-1.65-1.375.015-.475.525-.95 1.675-.95.95-.025 1.65.2 2.175.425l.275.125.4-2.55zm7.625-.275h-2.275c-.7 0-1.225.2-1.55.925L32.175 21h3.1l.625-1.675h3.775l.35 1.675h2.75L40.25 9.5h-2zm-2.2 8.15c.2-.525 1.45-4.2 1.45-4.2-.025.05.3-.8.475-1.3l.25 1.175s.7 3.275.85 3.975h-2.6l-.425.35zM15.375 9.5L12.5 17.35l-.3-1.5c-.55-1.825-2.225-3.8-4.1-4.775l2.625 9.9h3.125l4.65-11.475h-3.125z" fill="#1A1F71"/>
                <path d="M9.15 9.5H4.025L4 9.725c3.7.925 6.15 3.15 7.175 5.825L10.1 10.425c-.175-.7-.7-.9-1.35-.925h.4z" fill="#F9A51A"/>
              </svg>
              <span className="font-outfit text-white text-sm">Visa</span>
            </div>
            
            {/* Mastercard */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <svg className="w-8 h-6" viewBox="0 0 48 32">
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <circle cx="19" cy="16" r="8" fill="#EB001B"/>
                <circle cx="29" cy="16" r="8" fill="#F79E1B"/>
                <path d="M24 10.34a8 8 0 000 11.32 8 8 0 000-11.32z" fill="#FF5F00"/>
              </svg>
              <span className="font-outfit text-white text-sm">Mastercard</span>
            </div>
            
            {/* UPI */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-[10px] font-bold text-green-600">UPI</div>
              <span className="font-outfit text-white text-sm">UPI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
