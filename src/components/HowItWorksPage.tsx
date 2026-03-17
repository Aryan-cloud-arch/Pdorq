export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Select Platform & Service',
      description: 'Choose the platform (Telegram, Instagram, etc.) and specific service (channel takedown, account removal, etc.) that matches your need.',
      icon: '🎯',
      details: [
        '12 platforms supported',
        '46 different services',
        'Clear pricing displayed',
        'TAT estimates provided'
      ]
    },
    {
      number: '02',
      title: 'Provide Target Details',
      description: 'Submit the URL or username of the content/account you want removed. Add any context or urgency level.',
      icon: '📝',
      details: [
        'Secure encrypted submission',
        'Optional urgency levels',
        'Add supporting evidence',
        'Privacy guaranteed'
      ]
    },
    {
      number: '03',
      title: 'We Execute Takedown',
      description: 'Our legal and technical team initiates the takedown process using platform-specific compliance procedures.',
      icon: '⚡',
      details: [
        'Legal compliance review',
        'Platform policy analysis',
        'Multi-channel reporting',
        'Real-time updates'
      ]
    },
    {
      number: '04',
      title: 'Target Eliminated',
      description: 'Once successfully removed, you receive confirmation with proof. Payment is processed only after success.',
      icon: '✓',
      details: [
        'Success confirmation',
        'Proof of removal',
        'Pay only after success',
        'Full refund if failed'
      ]
    }
  ];

  const methods = [
    {
      title: 'Legal Compliance Route',
      description: 'We leverage platform ToS violations, copyright claims, and legal takedown requests.',
      icon: '⚖️',
      usedFor: ['Copyright violations', 'Defamation', 'Impersonation', 'Harassment']
    },
    {
      title: 'Mass Reporting System',
      description: 'Coordinated reporting from multiple verified accounts to trigger automated moderation.',
      icon: '👥',
      usedFor: ['Policy violations', 'Spam content', 'Adult content', 'Hate speech']
    },
    {
      title: 'Platform Liaison',
      description: 'Direct contact with platform trust & safety teams for urgent or complex cases.',
      icon: '🤝',
      usedFor: ['Verified accounts', 'Large channels', 'Business pages', 'Urgent cases']
    },
    {
      title: 'Technical Exploits',
      description: 'Utilizing platform vulnerabilities and reporting system weaknesses (all legal).',
      icon: '🔧',
      usedFor: ['Resistant targets', 'Failed reports', 'Multiple accounts', 'Ban evasion']
    }
  ];

  const timeline = [
    { time: '0 min', event: 'Order Placed', description: 'You submit your order with target details' },
    { time: '5 min', event: 'Review Started', description: 'Our team reviews the target and selects approach' },
    { time: '30 min', event: 'Execution Begins', description: 'Takedown process initiated on platform' },
    { time: '2-48h', event: 'Target Down', description: 'Content/account removed from platform' },
    { time: '+1h', event: 'Confirmation', description: 'Proof sent, payment processed' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4 sm:mb-6">
              The Process
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory leading-tight mb-4 sm:mb-6">
              How It <span className="italic text-gold">Works</span>
            </h1>
            <p className="text-base sm:text-lg text-ivory leading-relaxed">
              From order placement to target elimination — here's our proven 4-step process.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 lg:p-10 border border-gold/10 hover:border-gold/30 transition-all duration-500"
              >
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <span className="font-serif text-2xl sm:text-3xl text-gold">{step.number}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-ivory">{step.title}</h3>
                    </div>
                    <p className="text-white/80 leading-relaxed mb-4">{step.description}</p>
                    
                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                          <span className="text-gold">✓</span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-[2.5rem] sm:left-[2.85rem] top-full w-px h-6 sm:h-8 bg-gradient-to-b from-gold/30 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 sm:py-16 lg:py-24 bg-black/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              Typical Timeline
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              From Order to <span className="italic text-gold">Completion</span>
            </h2>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/30 to-gold/10 transform sm:-translate-x-1/2"></div>
            
            {timeline.map((item, index) => (
              <div key={index} className={`relative flex items-center gap-6 mb-8 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                {/* Time Badge */}
                <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'} hidden sm:block`}>
                  <div className={`inline-block bg-gold/10 border border-gold/30 px-4 py-2 rounded-full ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                    <span className="text-gold font-medium">{item.time}</span>
                  </div>
                </div>
                
                {/* Center Dot */}
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-gold rounded-full transform sm:-translate-x-1/2 ring-4 ring-[#0D0D0D]"></div>
                
                {/* Content */}
                <div className="flex-1 ml-10 sm:ml-0">
                  <div className="bg-white/5 backdrop-blur-sm p-4 sm:p-6 rounded-lg border border-gold/10">
                    <div className="text-gold font-medium text-sm mb-1 sm:hidden">{item.time}</div>
                    <h4 className="font-serif text-lg text-ivory mb-1">{item.event}</h4>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
              Our Approach
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-ivory">
              Execution <span className="italic text-gold">Methods</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {methods.map((method, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 border border-gold/10 hover:border-gold/30 transition-all duration-500"
              >
                <div className="text-3xl mb-4">{method.icon}</div>
                <h3 className="font-serif text-xl text-ivory mb-2">{method.title}</h3>
                <p className="text-white/80 text-sm mb-4">{method.description}</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="text-xs text-gold uppercase tracking-wider mb-2">Used For:</div>
                  <div className="flex flex-wrap gap-2">
                    {method.usedFor.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-transparent to-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs sm:text-sm font-light tracking-[0.3em] text-gold uppercase mb-4">
            Our Promise
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ivory mb-8">
            100% <span className="italic text-gold">Guaranteed</span>
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Money-Back', desc: 'Full refund if we fail to deliver' },
              { icon: '🔒', title: 'Privacy', desc: 'Your identity remains anonymous' },
              { icon: '⚡', title: 'Speed', desc: 'Results within estimated TAT' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-gold/20">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-serif text-lg text-ivory mb-1">{item.title}</div>
                <div className="text-sm text-white/80">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
