import React from 'react';

const Process: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Select Platform',
      description: 'Choose the platform and specific service type for your takedown request',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0-4.5l-5.571 3-5.571-3m11.142 4.5l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Submit Details',
      description: 'Provide the target URL, username, or content link along with urgency level',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'We Execute',
      description: 'Our team processes your order using proven methods and direct platform relations',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 15.3m14.8 0l.8 2.4m-15.4-2.4l-.8 2.4m.8-2.4h14.8" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Confirmed',
      description: 'Receive confirmation with proof of takedown completion',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="process" className="py-20 md:py-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-20">
          <span 
            className="inline-block text-[10px] sm:text-xs tracking-[0.4em] text-[#C5A572] uppercase mb-4 md:mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            The Process
          </span>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-[0.02em] mb-4 md:mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}
          >
            Managed Entirely <em className="italic text-[#C5A572]">On Platform</em>
          </h2>
          <p 
            className="text-sm sm:text-base text-white/50 max-w-2xl mx-auto"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
          >
            Our streamlined process ensures quick turnaround with complete transparency
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-white/10" />
              )}

              <div className="relative bg-white/5 border border-white/10 p-6 md:p-8 hover:border-[#C5A572]/50 transition-all duration-500">
                {/* Step Number */}
                <div 
                  className="absolute -top-3 left-6 px-2 bg-[#0D0D0D] text-[10px] tracking-[0.2em] text-[#C5A572]"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  STEP {step.number}
                </div>

                {/* Icon */}
                <div className="text-white/40 group-hover:text-[#C5A572] transition-colors duration-500 mb-4 md:mb-6">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl md:text-2xl text-white mb-3"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-xs sm:text-sm text-white/50 leading-relaxed"
                  style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No DMs Banner */}
        <div className="mt-12 md:mt-16 text-center p-6 md:p-8 border border-[#C5A572]/30 bg-[#C5A572]/5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <svg className="w-6 h-6 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span 
              className="text-xs sm:text-sm tracking-[0.15em] text-white/80 uppercase text-center"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              No DMs Required — Everything managed directly on this website
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
