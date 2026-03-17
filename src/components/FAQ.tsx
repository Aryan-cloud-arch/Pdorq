import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'General',
    question: 'What is Pdorq and how does it work?',
    answer: 'Pdorq is a professional digital content removal service. We specialize in taking down unauthorized content, impersonation accounts, copyright violations, and harmful material across major social platforms. Simply submit your order, provide the target details, and our team handles the rest.'
  },
  {
    category: 'General',
    question: 'Is this service legal?',
    answer: 'Yes, absolutely. We operate within legal frameworks by filing legitimate reports for copyright infringement, trademark violations, impersonation, harassment, and other policy violations. We do not engage in any illegal hacking or unauthorized access.'
  },
  {
    category: 'General',
    question: 'How long have you been operating?',
    answer: 'Pdorq has been operating since 2019. We have successfully completed over 12,400 takedowns with a 99.2% success rate. Our team consists of professionals with extensive experience in digital rights management and platform policies.'
  },
  {
    category: 'General',
    question: 'Which platforms do you support?',
    answer: 'We support all major platforms including Telegram (channels, groups, accounts), Instagram, YouTube, TikTok, Facebook, LinkedIn, X (Twitter), Snapchat, Discord, Twitch, Reddit, and Pinterest. If you need help with a platform not listed, contact us.'
  },
  
  // Orders & Process
  {
    category: 'Orders',
    question: 'How do I place an order?',
    answer: 'Select your target platform, choose the specific service (e.g., account takedown, video removal), enter the target URL or username, select urgency level, and submit. You can pay using your wallet balance, which you can top up via crypto, card, UPI, or bank transfer.'
  },
  {
    category: 'Orders',
    question: 'What is TAT (Turnaround Time)?',
    answer: 'TAT is the estimated time to complete your order. Standard orders follow regular TAT (e.g., 24-48h). Priority orders are 1.5x faster, and Urgent orders are processed at 2x speed with immediate attention from our senior team.'
  },
  {
    category: 'Orders',
    question: 'Can I track my order status?',
    answer: 'Yes! Once logged in, go to "My Orders" in your dashboard. You can see real-time status updates, estimated completion time, and complete history of each order. You will also receive notifications for status changes.'
  },
  {
    category: 'Orders',
    question: 'What information do I need to provide?',
    answer: 'You need to provide the target URL or username, a brief description of why takedown is needed, and your contact information for updates. The more details you provide, the faster we can process your request.'
  },
  
  // Payments
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept Cryptocurrency (BTC, ETH, USDT - with 5% bonus!), Credit/Debit Cards (Visa, Mastercard), UPI (for Indian users), and Bank Transfers. All payments are secure and encrypted.'
  },
  {
    category: 'Payments',
    question: 'How does the wallet system work?',
    answer: 'Add funds to your wallet and use the balance for orders. Benefits include: instant order processing (no payment delays), bonus credits on deposits ($50+ gets bonuses), and easy refunds directly to wallet if needed.'
  },
  {
    category: 'Payments',
    question: 'Do you offer discounts?',
    answer: 'Yes! All our services have significant discounts (60-92% off). We also have promo codes for additional savings. First-time users get $2 free credits on signup, and crypto payments receive an extra 5% bonus.'
  },
  {
    category: 'Payments',
    question: 'What is your refund policy?',
    answer: 'We offer full refunds if we cannot complete your takedown within the extended timeframe. Partial refunds are available for partial completions. Refunds are processed to your wallet within 24 hours. See our Refund Policy for details.'
  },
  
  // Technical
  {
    category: 'Technical',
    question: 'What is your success rate?',
    answer: 'Our overall success rate is 99.2%. Success rates vary slightly by platform: Telegram (99.5%), Instagram (98.8%), YouTube (99.1%), TikTok (98.5%). We only accept orders we are confident we can complete.'
  },
  {
    category: 'Technical',
    question: 'What if the content reappears after takedown?',
    answer: 'We offer a 30-day guarantee. If the same content reappears from the same source within 30 days, we will take it down again at no extra charge. Simply contact support with your original order ID.'
  },
  {
    category: 'Technical',
    question: 'Do you guarantee 100% success?',
    answer: 'While we have a 99.2% success rate, we cannot guarantee 100% success due to factors outside our control. If we fail, you receive a full refund. We are transparent about our capabilities and will inform you if your request has low success probability.'
  },
  {
    category: 'Technical',
    question: 'How do you perform takedowns?',
    answer: 'We use legitimate reporting mechanisms provided by each platform. This includes filing DMCA/copyright claims, reporting policy violations, trademark infringement reports, and coordinating with platform trust & safety teams through established channels.'
  },
  
  // Privacy & Security
  {
    category: 'Privacy',
    question: 'Is my information kept confidential?',
    answer: 'Absolutely. We use end-to-end encryption, store minimal data, and never share client information. Your identity is protected throughout the process. We operate on a strict need-to-know basis internally.'
  },
  {
    category: 'Privacy',
    question: 'Do you keep logs of my orders?',
    answer: 'We maintain order records for service delivery and your reference. However, we automatically purge detailed logs after 90 days. You can request immediate deletion of your data at any time.'
  },
  {
    category: 'Privacy',
    question: 'Can the target find out who reported them?',
    answer: 'No. All reports are filed anonymously or through our corporate entities. Your personal information is never disclosed to the target or the platform. We take client anonymity very seriously.'
  },
  
  // Support
  {
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'You can reach us via: Live Chat (available on website, 24/7), Telegram (@pdorq), or through your account dashboard. Average response time is under 2 hours.'
  },
  {
    category: 'Support',
    question: 'What are your operating hours?',
    answer: 'We operate 24/7, 365 days a year. Our team is distributed globally to ensure round-the-clock coverage. Urgent orders receive immediate attention regardless of time.'
  },
  {
    category: 'Support',
    question: 'Can I request a custom service?',
    answer: 'Yes! If you need a service not listed on our website, contact us through live chat or Telegram. We handle custom requests for bulk takedowns, ongoing monitoring, and platforms not publicly listed.'
  },
];

const categories = ['All', 'General', 'Orders', 'Payments', 'Technical', 'Privacy', 'Support'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-20 sm:py-32 bg-[#FAF9F6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[#C5A572] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
            Knowledge Base
          </p>
          <h2 className="font-cormorant text-3xl sm:text-4xl md:text-5xl text-[#0D0D0D] mb-4">
            Frequently Asked <em className="italic text-[#C5A572]">Questions</em>
          </h2>
          <p className="font-outfit text-[#0D0D0D]/60 text-sm sm:text-base max-w-xl mx-auto">
            Find answers to common questions about our services, process, and policies.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 bg-white border border-[#0D0D0D]/10 rounded-xl font-outfit text-[#0D0D0D] placeholder:text-[#0D0D0D]/40 focus:outline-none focus:border-[#C5A572]/50 transition-colors"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D0D0D]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-outfit transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-white text-[#0D0D0D]/70 hover:bg-[#0D0D0D]/5 border border-[#0D0D0D]/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-outfit text-[#0D0D0D]/50">No questions found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#0D0D0D]/5 overflow-hidden transition-all duration-300 hover:border-[#C5A572]/30"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden sm:flex w-8 h-8 rounded-full bg-[#0D0D0D]/5 items-center justify-center text-xs font-outfit text-[#0D0D0D]/50">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-outfit text-sm sm:text-base text-[#0D0D0D] pr-4">{faq.question}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border border-[#0D0D0D]/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index ? 'bg-[#C5A572] border-[#C5A572] rotate-180' : ''}`}>
                    <svg className={`w-3 h-3 transition-colors ${openIndex === index ? 'text-white' : 'text-[#0D0D0D]/50'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 sm:pl-[4.5rem]">
                    <p className="font-outfit text-sm text-[#0D0D0D]/70 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] rounded-2xl">
          <h3 className="font-cormorant text-2xl text-white mb-2">Still Have Questions?</h3>
          <p className="font-outfit text-white/60 text-sm mb-6">Our support team is available 24/7 to help you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#live-chat"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A572] text-[#0D0D0D] rounded-lg font-outfit text-sm font-medium hover:bg-[#d4b584] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </a>
            <a
              href="https://t.me/pdorq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-outfit text-sm font-medium hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              @pdorq
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
