import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: 'normal'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend will handle this
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', urgency: 'normal' });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      value: 'contact@pdorq.com',
      description: 'Response within 2 hours',
      link: 'mailto:contact@pdorq.com'
    },
    {
      icon: '💬',
      title: 'Telegram',
      value: '@pdorq',
      description: 'Instant support',
      link: 'https://t.me/pdorq'
    },
    {
      icon: '🌍',
      title: 'Global HQ',
      value: 'Dubai, UAE',
      description: 'Business Bay, Floor 23',
      link: null
    },
    {
      icon: '⏰',
      title: 'Operating Hours',
      value: '24/7 Available',
      description: 'Round-the-clock support',
      link: null
    }
  ];

  const faqs = [
    {
      q: 'How quickly can you respond?',
      a: 'We typically respond within 2 hours via email and instantly on Telegram.'
    },
    {
      q: 'Is my inquiry confidential?',
      a: 'Absolutely. All communications are encrypted and we never share client information.'
    },
    {
      q: 'Can I get a quote before ordering?',
      a: 'Yes, contact us with details about your target and we\'ll provide a custom quote.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">
              Get In Touch
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-4 sm:mb-6">
              We're Here to <span className="italic text-gold">Help</span>
            </h1>
            <p className="text-base sm:text-lg text-white leading-relaxed">
              Have questions? Need urgent assistance? Our team is available 24/7 to support you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-gold/10 hover:border-gold/30 transition-all duration-500 ${
                  method.link ? 'cursor-pointer hover:scale-105' : ''
                }`}
                onClick={() => method.link && window.open(method.link, '_blank')}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{method.icon}</div>
                <div className="text-xs tracking-[0.2em] text-gold uppercase mb-2">{method.title}</div>
                <div className="font-serif text-lg sm:text-xl text-ivory mb-1 sm:mb-2">{method.value}</div>
                <div className="text-xs sm:text-sm text-white/80">{method.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm text-ivory p-6 sm:p-10 lg:p-16 rounded-lg border border-gold/10">
            <div className="text-center mb-8 sm:mb-12">
              <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-3">
                Send a Message
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
                How Can We <span className="italic text-gold">Assist</span>?
              </h2>
            </div>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="font-serif text-2xl mb-2 text-gold">Message Sent!</h3>
                <p className="text-white/80">We'll get back to you within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-gold/30 py-3 text-ivory focus:outline-none focus:border-gold transition-colors placeholder-ivory/30"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-gold/30 py-3 text-ivory focus:outline-none focus:border-gold transition-colors placeholder-ivory/30"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-ivory/40 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-gold/30 py-3 text-ivory focus:outline-none focus:border-gold transition-colors placeholder-ivory/30"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-ivory/40 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-transparent border-b border-gold/30 py-3 text-ivory focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="" className="bg-[#0D0D0D]">Select a subject</option>
                      <option value="quote" className="bg-[#0D0D0D]">Request a Quote</option>
                      <option value="support" className="bg-[#0D0D0D]">Order Support</option>
                      <option value="partnership" className="bg-[#0D0D0D]">Partnership Inquiry</option>
                      <option value="other" className="bg-[#0D0D0D]">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-ivory/40 mb-2">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'normal', label: 'Normal', desc: '24-48h response' },
                      { value: 'urgent', label: 'Urgent', desc: '2-6h response' },
                      { value: 'critical', label: 'Critical', desc: '<1h response' }
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: level.value })}
                        className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                          formData.urgency === level.value
                            ? 'bg-gold/20 border-gold text-gold'
                            : 'bg-white/5 border-white/10 text-ivory/60 hover:border-gold/30'
                        }`}
                      >
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs mt-1 opacity-60">{level.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-ivory/40 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-gold/30 rounded-lg p-4 text-ivory focus:outline-none focus:border-gold transition-colors resize-none placeholder-ivory/30"
                    placeholder="Describe your situation or inquiry in detail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gold text-black font-medium text-sm uppercase tracking-wider rounded hover:bg-ivory transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quick FAQs */}
      <section className="py-12 sm:py-16 lg:py-24 bg-black/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              Quick Answers
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Common <span className="italic text-gold">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gold/10"
              >
                <div className="font-serif text-lg text-ivory mb-2">{faq.q}</div>
                <div className="text-ivory/60 text-sm">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-gold/10 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="font-serif text-2xl text-ivory mb-2">Global Operations</h3>
            <p className="text-ivory/60 mb-6">
              Serving clients in 156+ countries with offices in Dubai, Singapore, London, and Mumbai
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['🇦🇪 Dubai (HQ)', '🇸🇬 Singapore', '🇬🇧 London', '🇮🇳 Mumbai'].map((office, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-sm text-ivory/70 border border-gold/10">
                  {office}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-transparent to-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-6">
            Prefer <span className="italic text-gold">Instant</span> Support?
          </h2>
          <p className="text-ivory/60 mb-8 max-w-2xl mx-auto">
            Connect with us directly on Telegram for real-time assistance.
          </p>
          <a
            href="https://t.me/pdorq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0088cc] text-white font-medium text-sm uppercase tracking-wider rounded hover:bg-[#006699] transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Chat on Telegram
          </a>
        </div>
      </section>
    </div>
  );
}
