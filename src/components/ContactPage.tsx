import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { contactApi } from '../lib/api';

export default function ContactPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: profile?.email || '',
    subject: '',
    message: '',
    urgency: 'normal' as 'low' | 'normal' | 'high' | 'critical'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: submitError } = await contactApi.send({
      user_id: user?.id,
      name: formData.name,
      email: formData.email,
      subject: formData.subject || null,
      message: formData.message,
      urgency: formData.urgency
    });

    setLoading(false);

    if (submitError) {
      setError('Failed to send message. Please try again.');
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '', urgency: 'normal' });
    }
  };

  if (success) {
    return (
      <section className="min-h-screen bg-[#0D0D0D] py-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">Message Sent!</h2>
          <p className="text-white/60 mb-8">We'll get back to you within 24 hours.</p>
          <button
            onClick={() => setSuccess(false)}
            className="px-8 py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0D0D0D] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Get in Touch</p>
          <h1 className="text-4xl sm:text-5xl font-serif text-white mb-4">Contact Us</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Have questions? We're here to help 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-white font-medium mb-2">Email</h3>
              <p className="text-white/60 text-sm">contact@pdorq.com</p>
              <p className="text-white/40 text-xs mt-1">Under 2 hours</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-gold/20 transition-all">
              <span className="text-3xl mb-3 block">📞</span>
              <h3 className="text-white font-medium mb-2">Phone</h3>
              <p className="text-white/60 text-sm">+62 831-7539-4100</p>
              <p className="text-white/40 text-xs mt-1">Available 24/7</p>
              <p className="text-white/40 text-xs mt-1">Response within 2 hours</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-white font-medium mb-2">Telegram</h3>
              <a href="https://t.me/pdorq" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                @pdorq
              </a>
              <p className="text-white/40 text-xs mt-1">Instant support</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="text-white font-medium mb-2">Working Hours</h3>
              <p className="text-white/60 text-sm">24/7 Available</p>
              <p className="text-white/40 text-xs mt-1">We never sleep</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What is this about?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">Urgency</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['low', 'normal', 'high', 'critical'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: level })}
                      className={`py-2 px-3 rounded-lg border text-sm capitalize transition-all ${
                        formData.urgency === level
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white/70 text-sm mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gold text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
