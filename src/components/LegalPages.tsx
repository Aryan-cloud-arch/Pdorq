import { useEffect } from 'react';

interface LegalPageProps {
  page: 'terms' | 'privacy' | 'refund';
  onClose: () => void;
}

export default function LegalPages({ page, onClose }: LegalPageProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const content = {
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'March 15, 2026',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: `By accessing and using Pdorq ("Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.

These Terms of Service apply to all users, including visitors, registered users, and paying customers.`
        },
        {
          title: '2. Description of Service',
          content: `Pdorq provides digital content removal and takedown services across various social media platforms. Our services include, but are not limited to:

• Content takedown requests
• Account termination assistance
• Copyright infringement reporting
• Trademark violation reporting
• Policy violation reporting

We act as intermediaries, filing legitimate reports on behalf of our clients through official platform channels.`
        },
        {
          title: '3. User Eligibility',
          content: `To use our Service, you must:

• Be at least 18 years of age
• Have the legal capacity to enter into binding agreements
• Not be prohibited from using the Service under applicable laws
• Have legitimate grounds for content removal requests`
        },
        {
          title: '4. Account Registration',
          content: `When creating an account, you agree to:

• Provide accurate, current, and complete information
• Maintain the security of your password and account
• Accept responsibility for all activities under your account
• Immediately notify us of any unauthorized account access

We reserve the right to terminate accounts that violate these terms.`
        },
        {
          title: '5. Acceptable Use Policy',
          content: `You agree NOT to use our Service to:

• Harass, bully, or target individuals maliciously
• File false or fraudulent takedown requests
• Remove content you do not have rights to remove
• Engage in any illegal activities
• Circumvent platform policies for illegitimate purposes
• Target content protected by fair use or free speech

We reserve the right to refuse service and report illegal requests to authorities.`
        },
        {
          title: '6. Payment Terms',
          content: `• All prices are listed in USD and converted to your selected currency
• Payment is required before service commencement
• Wallet balances are non-transferable
• Bonus credits have no cash value and cannot be withdrawn
• We accept cryptocurrency, cards, UPI, and bank transfers`
        },
        {
          title: '7. Service Delivery',
          content: `• Turnaround times (TAT) are estimates, not guarantees
• Success rates are based on historical data
• We will make reasonable efforts to complete all orders
• Some requests may be rejected if they violate our policies
• We will communicate any issues or delays promptly`
        },
        {
          title: '8. Refund Policy',
          content: `Please refer to our separate Refund Policy for detailed information on refunds, cancellations, and dispute resolution.`
        },
        {
          title: '9. Intellectual Property',
          content: `All content on Pdorq, including logos, text, graphics, and software, is our property or licensed to us. You may not reproduce, distribute, or create derivative works without our written permission.`
        },
        {
          title: '10. Limitation of Liability',
          content: `To the maximum extent permitted by law:

• We are not liable for indirect, incidental, or consequential damages
• Our total liability is limited to the amount paid for the specific service
• We do not guarantee specific outcomes or results
• We are not responsible for platform policy changes affecting our services`
        },
        {
          title: '11. Privacy',
          content: `Your use of our Service is also governed by our Privacy Policy. Please review it to understand our data practices.`
        },
        {
          title: '12. Modifications',
          content: `We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of the Service constitutes acceptance of modified terms.`
        },
        {
          title: '13. Contact',
          content: `For questions about these Terms, contact us at:
• Telegram: @pdorq
• Website: Live Chat`
        }
      ]
    },
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'March 15, 2026',
      sections: [
        {
          title: '1. Information We Collect',
          content: `We collect information you provide directly:

• Account Information: Name, email address, password
• Order Information: Target URLs, platform details, service requests
• Payment Information: Transaction records (we do not store card details)
• Communication: Messages sent to our support team
• Usage Data: IP address, browser type, pages visited, timestamps`
        },
        {
          title: '2. How We Use Your Information',
          content: `We use collected information to:

• Provide and improve our services
• Process your orders and payments
• Communicate with you about your orders
• Send important service updates
• Detect and prevent fraud
• Comply with legal obligations`
        },
        {
          title: '3. Information Sharing',
          content: `We DO NOT sell your personal information. We may share data with:

• Payment Processors: To process transactions (they have their own privacy policies)
• Legal Authorities: When required by law or to protect our rights
• Service Providers: Who help us operate our business (under strict confidentiality)

We NEVER share your information with the targets of takedown requests.`
        },
        {
          title: '4. Data Security',
          content: `We implement industry-standard security measures:

• SSL/TLS encryption for all data transmission
• Encrypted database storage
• Regular security audits
• Access controls and authentication
• Secure data centers

However, no system is 100% secure. We cannot guarantee absolute security.`
        },
        {
          title: '5. Data Retention',
          content: `• Account Data: Retained while your account is active
• Order Details: Automatically purged after 90 days
• Transaction Records: Retained for 7 years (legal requirement)
• Support Communications: Retained for 1 year

You can request deletion of your data at any time (subject to legal requirements).`
        },
        {
          title: '6. Your Rights',
          content: `Depending on your jurisdiction, you may have the right to:

• Access your personal data
• Correct inaccurate data
• Delete your data
• Export your data
• Object to processing
• Withdraw consent

Contact us to exercise these rights.`
        },
        {
          title: '7. Cookies',
          content: `We use cookies for:

• Essential Functions: Login, security, preferences
• Analytics: Understanding how you use our site
• Performance: Improving site speed and functionality

You can control cookies through your browser settings.`
        },
        {
          title: '8. Third-Party Links',
          content: `Our Service may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies.`
        },
        {
          title: '9. Children\'s Privacy',
          content: `Our Service is not intended for users under 18. We do not knowingly collect information from minors. If we learn we have collected such information, we will delete it immediately.`
        },
        {
          title: '10. International Transfers',
          content: `Your data may be processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.`
        },
        {
          title: '11. Changes to This Policy',
          content: `We may update this Privacy Policy periodically. We will notify you of significant changes via email or website notice.`
        },
        {
          title: '12. Contact Us',
          content: `For privacy-related inquiries:
• Telegram: @pdorq
• Website: Live Chat

We will respond within 48 hours.`
        }
      ]
    },
    refund: {
      title: 'Refund Policy',
      lastUpdated: 'March 15, 2026',
      sections: [
        {
          title: '1. Our Commitment',
          content: `At Pdorq, customer satisfaction is our priority. We stand behind our services with a fair and transparent refund policy.`
        },
        {
          title: '2. Full Refund Eligibility',
          content: `You are entitled to a FULL REFUND if:

• We fail to complete the takedown within 2x the stated TAT
• We decline your order after payment
• A technical error prevents service delivery
• The target content no longer exists before we begin work`
        },
        {
          title: '3. Partial Refund Eligibility',
          content: `You may receive a PARTIAL REFUND (50-75%) if:

• Takedown is partial (e.g., 3 of 5 posts removed)
• Extended delays beyond normal TAT (but within 2x)
• Service quality does not meet our standards`
        },
        {
          title: '4. No Refund Situations',
          content: `Refunds are NOT available if:

• The takedown was successfully completed
• You provided incorrect target information
• The request violates our Terms of Service
• You cancel after work has begun
• The content reappears after 30 days (see Guarantee section)`
        },
        {
          title: '5. 30-Day Guarantee',
          content: `If taken-down content reappears within 30 days:

• We will re-execute the takedown at no extra charge
• If re-takedown fails, you receive a 50% refund
• This guarantee applies to the same content from the same source
• It does not cover new content or different accounts`
        },
        {
          title: '6. Refund Process',
          content: `To request a refund:

1. Contact support via Live Chat or Telegram (@pdorq)
2. Provide your Order ID and reason for refund
3. Our team will review within 24 hours
4. Approved refunds are credited to your wallet within 24 hours

Note: Refunds are processed to your Pdorq wallet, not the original payment method. Wallet balance can be used for future orders.`
        },
        {
          title: '7. Wallet Balance Refunds',
          content: `If you wish to withdraw wallet balance:

• Minimum withdrawal: $50
• Processing time: 3-5 business days
• Original payment method must be available
• Bonus credits cannot be withdrawn`
        },
        {
          title: '8. Dispute Resolution',
          content: `If you disagree with a refund decision:

1. Request escalation to a senior manager
2. Provide additional evidence or context
3. We will provide a final decision within 48 hours
4. Our decision is final but made in good faith`
        },
        {
          title: '9. Chargebacks',
          content: `Please contact us before initiating a chargeback. Chargebacks incur processing fees and may result in account suspension. We are committed to resolving issues directly.`
        },
        {
          title: '10. Contact',
          content: `For refund requests:
• Telegram: @pdorq
• Website: Live Chat
• Response time: Under 2 hours`
        }
      ]
    }
  };

  const currentContent = content[page];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#FAF9F6] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-[#0D0D0D] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-cormorant text-2xl text-white">{currentContent.title}</h2>
            <p className="font-outfit text-white/50 text-xs mt-1">Last updated: {currentContent.lastUpdated}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 sm:p-8">
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-cormorant text-xl text-[#0D0D0D] mb-3">{section.title}</h3>
                <div className="font-outfit text-sm text-[#0D0D0D]/70 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-[#0D0D0D]/10">
            <p className="font-outfit text-xs text-[#0D0D0D]/50 text-center">
              If you have any questions about this {currentContent.title.toLowerCase()}, please contact us at{' '}
              <a href="https://t.me/pdorq" target="_blank" rel="noopener noreferrer" className="text-[#C5A572] hover:underline">
                @pdorq
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
