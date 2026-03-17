import { Currency } from '../types';

interface AboutPageProps {
  currency: Currency;
}

export default function AboutPage({ currency: _currency }: AboutPageProps) {
  const stats = [
    { value: '2019', label: 'Established' },
    { value: '12,400+', label: 'Successful Cases' },
    { value: '99.2%', label: 'Success Rate' },
    { value: '156', label: 'Countries Served' }
  ];

  const team = [
    {
      name: 'Alexander Chen',
      role: 'Founder & CEO',
      bio: 'Former cybersecurity consultant with 15+ years in digital rights and platform compliance.',
      initials: 'AC'
    },
    {
      name: 'Dr. Sophia Mueller',
      role: 'Chief Legal Officer',
      bio: 'International law expert specializing in digital content and platform regulations.',
      initials: 'SM'
    },
    {
      name: 'Rajesh Kapoor',
      role: 'Head of Operations',
      bio: '10+ years managing large-scale content moderation and platform compliance teams.',
      initials: 'RK'
    },
    {
      name: 'Elena Volkov',
      role: 'Security Director',
      bio: 'Cybersecurity specialist ensuring client anonymity and data protection.',
      initials: 'EV'
    }
  ];

  const values = [
    {
      icon: '🛡️',
      title: 'Privacy First',
      description: 'End-to-end encryption and zero data retention policy. Your identity remains anonymous.'
    },
    {
      icon: '⚖️',
      title: 'Legal Compliance',
      description: 'We operate within international legal frameworks, targeting content that violates platform policies.'
    },
    {
      icon: '⚡',
      title: 'Speed & Efficiency',
      description: 'Average turnaround time of 6 hours with 24/7 operations across global time zones.'
    },
    {
      icon: '💎',
      title: 'Premium Service',
      description: 'White-glove service with dedicated support and transparent communication throughout.'
    }
  ];

  const offices = [
    { city: 'Dubai', country: 'UAE', role: 'Global HQ', flag: '🇦🇪' },
    { city: 'Singapore', country: 'Singapore', role: 'APAC Hub', flag: '🇸🇬' },
    { city: 'London', country: 'UK', role: 'Europe Office', flag: '🇬🇧' },
    { city: 'Mumbai', country: 'India', role: 'Operations Center', flag: '🇮🇳' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">
              Since 2019
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-ivory leading-tight mb-6 lg:mb-8">
              Protecting Digital <span className="italic text-gold">Reputations</span>
            </h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              We are a specialized team of legal experts, cybersecurity professionals, and platform compliance specialists 
              dedicated to helping individuals and businesses remove harmful or policy-violating content from social platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-gold/10 border-y border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl text-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm tracking-[0.2em] text-white uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
                Our Mission
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory leading-tight mb-6">
                Restoring <span className="italic text-gold">Control</span> to You
              </h2>
              <p className="text-white leading-relaxed mb-6">
                In an era where anyone can post anything online, your reputation can be destroyed in seconds. 
                Fake accounts, harassment, copyright theft, and defamatory content spread faster than ever.
              </p>
              <p className="text-white leading-relaxed">
                We exist to level the playing field. Using legal channels, platform policies, and technical expertise, 
                we help individuals and businesses remove content that violates their rights or platform guidelines.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-gold/10">
              <div className="text-6xl mb-6">⚖️</div>
              <blockquote className="font-serif text-xl text-ivory italic leading-relaxed mb-4">
                "We believe everyone has the right to protect their digital identity and reputation."
              </blockquote>
              <div className="text-gold">— Alexander Chen, Founder</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 sm:py-16 lg:py-24 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              What We Stand For
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Our Core <span className="italic text-gold">Values</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all duration-500 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-serif text-lg text-ivory mb-2">{value.title}</h3>
                <p className="text-sm text-white/90 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              Leadership
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Meet Our <span className="italic text-gold">Team</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all duration-500 text-center group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-all duration-500">
                  <span className="font-serif text-2xl text-gold">{member.initials}</span>
                </div>
                <h3 className="font-serif text-lg text-ivory mb-1">{member.name}</h3>
                <div className="text-gold text-sm mb-3">{member.role}</div>
                <p className="text-xs text-white/80 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-transparent to-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              Global Presence
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Our <span className="italic text-gold">Offices</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-gold/10 hover:border-gold/30 transition-all duration-500 text-center"
              >
                <div className="text-4xl mb-3">{office.flag}</div>
                <h3 className="font-serif text-lg text-ivory mb-1">{office.city}</h3>
                <div className="text-sm text-white/80 mb-2">{office.country}</div>
                <div className="text-xs text-gold uppercase tracking-wider">{office.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory mb-6">
            Ready to Work <span className="italic text-gold">Together</span>?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have successfully protected their digital presence with our help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/pdorq"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gold text-black font-medium text-sm uppercase tracking-wider rounded hover:bg-ivory transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
