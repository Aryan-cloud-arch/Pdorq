import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  agentName?: string;
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const quickReplies = [
  'Track my order',
  'Request refund',
  'Service pricing',
  'How it works',
  'Talk to human',
];

const autoResponses: { [key: string]: string } = {
  'track my order': 'To track your order, please go to "My Orders" in your dashboard. You can see real-time status updates there. If you need specific help, please share your Order ID.',
  'request refund': 'For refund requests, please provide your Order ID and reason. Our refund policy offers full refunds if we cannot complete the takedown. A team member will review your request within 24 hours.',
  'service pricing': 'All our services have 60-92% discounts! Prices start from just $11 for comment removal up to $56 for complex takedowns. Visit our Services section for detailed pricing, or tell me which platform you are interested in.',
  'how it works': 'It is simple! 1) Select your target platform 2) Choose the service you need 3) Enter the target URL 4) Pay and submit. We handle the rest! Average turnaround is 24-48 hours. Would you like to place an order?',
  'talk to human': 'I am connecting you with a human agent. Please wait a moment... 🔄\n\nIn the meantime, you can also reach us instantly on Telegram: @pdorq',
};

export default function LiveChat({ isOpen, onClose, userName }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Pdorq Support! How can we help you today?',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Show typing indicator
    setIsTyping(true);

    // Generate response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      const lowerContent = content.toLowerCase();
      let response = '';

      // Check for matching auto responses
      for (const [key, value] of Object.entries(autoResponses)) {
        if (lowerContent.includes(key)) {
          response = value;
          break;
        }
      }

      // Default response
      if (!response) {
        response = `Thank you for your message! Our team typically responds within 2 hours. For faster support, you can reach us on Telegram: @pdorq\n\nIs there anything specific I can help you with? You can ask about:\n• Order tracking\n• Refund requests\n• Service pricing\n• How our service works`;
      }

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date(),
        agentName: 'Pdorq Support',
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-[90] transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 sm:bottom-6 sm:right-6' 
        : 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6'
    }`}>
      {/* Chat Window */}
      <div className={`bg-[#0D0D0D] flex flex-col transition-all duration-300 ${
        isMinimized 
          ? 'w-72 h-14 rounded-full shadow-xl' 
          : 'w-full h-full sm:w-96 sm:h-[32rem] sm:rounded-2xl shadow-2xl'
      }`}>
        {/* Header */}
        <div 
          className={`flex items-center justify-between px-4 sm:px-5 shrink-0 cursor-pointer ${
            isMinimized ? 'py-3' : 'py-4 border-b border-white/10'
          }`}
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A572] to-[#8B7355] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0D0D0D]"></div>
            </div>
            <div className={isMinimized ? 'hidden sm:block' : ''}>
              <h4 className="font-outfit text-white text-sm font-medium">Pdorq Support</h4>
              <p className="font-outfit text-green-400 text-xs">Online • Avg. reply: 2 min</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isMinimized && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    message.type === 'user'
                      ? 'bg-[#C5A572] text-[#0D0D0D] rounded-2xl rounded-br-md'
                      : message.type === 'system'
                        ? 'bg-white/10 text-white/70 rounded-2xl text-center w-full'
                        : 'bg-white/10 text-white rounded-2xl rounded-bl-md'
                  } px-4 py-3`}>
                    {message.type === 'agent' && (
                      <p className="text-[#C5A572] text-xs font-medium mb-1">{message.agentName}</p>
                    )}
                    <p className="font-outfit text-sm whitespace-pre-line">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-[#0D0D0D]/50' : 'text-white/40'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs font-outfit hover:bg-white/10 hover:border-white/20 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                  placeholder={userName ? `Message as ${userName}...` : 'Type a message...'}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-outfit text-sm placeholder:text-white/30 focus:outline-none focus:border-[#C5A572]/50"
                />
                <button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 rounded-xl bg-[#C5A572] flex items-center justify-center hover:bg-[#d4b584] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              
              {/* Telegram Link */}
              <div className="mt-3 text-center">
                <a
                  href="https://t.me/pdorq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/40 text-xs font-outfit hover:text-white/60 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Chat on Telegram for faster response
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Minimized state shows unread indicator */}
      {isMinimized && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      )}
    </div>
  );
}

// Chat Button Component
export function ChatButton({ onClick, unread = 0 }: { onClick: () => void; unread?: number }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80] w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#C5A572] to-[#8B7355] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform group"
    >
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      
      {unread > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{unread}</span>
        </div>
      )}
      
      {/* Pulse effect */}
      <div className="absolute inset-0 rounded-full bg-[#C5A572] animate-ping opacity-20"></div>
    </button>
  );
}
