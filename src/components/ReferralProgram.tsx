import { useState } from 'react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface ReferralProgramProps {
  currency: Currency;
  user: { name: string; email: string } | null;
}

export default function ReferralProgram({ currency, user }: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);
  
  const referralCode = user ? `PDORQ-${user.name.substring(0, 3).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}` : 'PDORQ-XXXX';
  const referralLink = `https://pdorq.com/ref/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    { referrals: '1-5', yourBonus: 15, friendBonus: 10 },
    { referrals: '6-15', yourBonus: 20, friendBonus: 15 },
    { referrals: '16-30', yourBonus: 25, friendBonus: 20 },
    { referrals: '31+', yourBonus: 30, friendBonus: 25 }
  ];

  const stats = [
    { label: 'Your Referrals', value: '0' },
    { label: 'Total Earned', value: formatPrice(0, currency) },
    { label: 'Current Tier', value: 'Starter' },
    { label: 'Next Tier In', value: '1 referral' }
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-black/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">
              Referral Program
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-black leading-tight mb-4 sm:mb-6">
              Earn While You <span className="italic">Share</span>
            </h1>
            <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-8">
              Get up to 30% commission for every friend you refer. They get a discount too — everyone wins!
            </p>
            
            {!user && (
              <div className="bg-cream p-6 rounded-lg border border-black/10">
                <p className="text-sm text-black/70 mb-4">Sign in to get your unique referral link</p>
                <button className="px-8 py-3 bg-black text-ivory text-sm tracking-wider uppercase rounded-full hover:bg-gold hover:text-black transition-all duration-300">
                  Sign In to Start
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {user && (
        <>
          {/* Stats */}
          <section className="py-12 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs tracking-wider uppercase text-ivory/40 mb-2">{stat.label}</div>
                    <div className="font-serif text-3xl text-gold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Referral Link */}
          <section className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-cream p-8 rounded-lg border border-black/5">
                <h2 className="font-serif text-2xl text-black mb-6 text-center">Your Unique Referral Link</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-ivory border border-black/10 rounded text-sm font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-6 py-3 bg-black text-ivory text-sm tracking-wider uppercase rounded hover:bg-gold hover:text-black transition-all duration-300"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-sm text-black/60 mt-4 text-center">
                  Share this link with friends. When they sign up and place their first order, you both get rewarded!
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* How It Works */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-black mb-4">
              How It <span className="italic">Works</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '🔗', title: 'Share Your Link', desc: 'Send your unique referral link to friends via email, social media, or messaging apps.' },
              { icon: '✨', title: 'Friend Signs Up', desc: 'They create an account and get a special discount on their first order.' },
              { icon: '💰', title: 'You Both Earn', desc: 'You earn commission credits, they save money. Use credits on future orders!' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="font-serif text-xl text-black mb-3">{step.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl text-black mb-4">
              Commission <span className="italic">Tiers</span>
            </h2>
            <p className="text-black/70">The more you refer, the more you earn</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black/10">
                  <th className="text-left py-4 px-4 text-xs tracking-wider uppercase text-black/60">Referrals</th>
                  <th className="text-center py-4 px-4 text-xs tracking-wider uppercase text-black/60">Your Bonus</th>
                  <th className="text-center py-4 px-4 text-xs tracking-wider uppercase text-black/60">Friend Gets</th>
                  <th className="text-right py-4 px-4 text-xs tracking-wider uppercase text-black/60">Tier</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => (
                  <tr key={index} className="border-b border-black/5 hover:bg-ivory/50 transition-colors">
                    <td className="py-4 px-4 font-medium">{tier.referrals}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-gold/20 text-gold px-4 py-1 rounded-full font-semibold">
                        {tier.yourBonus}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
                        {tier.friendBonus}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-black/60">
                      {index === 0 ? '🥉 Starter' : index === 1 ? '🥈 Silver' : index === 2 ? '🥇 Gold' : '💎 Platinum'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-12 sm:py-16 bg-black text-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl text-center mb-8">Program Terms</h2>
          <div className="space-y-4 text-sm text-ivory/70 leading-relaxed">
            <p>• Commission is credited to your wallet after your referral's first successful order</p>
            <p>• Credits can be used on any future orders, no expiration</p>
            <p>• Your friend must use your referral link when signing up to qualify</p>
            <p>• No limit on referrals — refer unlimited friends</p>
            <p>• Self-referrals, fake accounts, or fraudulent activity will result in account suspension</p>
            <p>• Pdorq reserves the right to modify or terminate the program at any time</p>
          </div>
        </div>
      </section>
    </div>
  );
}
