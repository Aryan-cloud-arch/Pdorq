import { useState } from 'react';
import { Currency, formatPrice } from '../types';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  currency: Currency;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  balance: number;
  joinedDate: string;
  ordersCount: number;
  isVerified: boolean;
}

export default function Auth({ isOpen, onClose, onLogin, currency }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Error states
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const generateUserId = () => {
    return 'USR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateAvatar = (name: string) => {
    const colors = ['C5A572', '8B7355', '4A4A4A', '2D2D2D'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&font-size=0.4&bold=true`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: generateUserId(),
      email: email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      avatar: generateAvatar(email.split('@')[0]),
      balance: 0,
      joinedDate: new Date().toISOString(),
      ordersCount: 0,
      isVerified: true
    };
    
    setIsLoading(false);
    onLogin(user);
    onClose();
    resetForm();
  };

  const handleSignup = async () => {
    setError('');
    
    if (step === 1) {
      if (!name || !email) {
        setError('Please fill in all fields');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      setStep(2);
      return;
    }
    
    if (step === 2) {
      if (!password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setError('Please agree to the terms and conditions');
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setStep(3);
      return;
    }
    
    if (step === 3) {
      const otpValue = otp.join('');
      if (otpValue.length !== 6) {
        setError('Please enter the complete verification code');
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: generateUserId(),
        email: email,
        name: name,
        avatar: generateAvatar(name),
        balance: 2, // Welcome bonus
        joinedDate: new Date().toISOString(),
        ordersCount: 0,
        isVerified: true
      };
      
      setIsLoading(false);
      onLogin(user);
      onClose();
      resetForm();
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    
    if (step === 1) {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setStep(2);
      return;
    }
    
    if (step === 2) {
      const otpValue = otp.join('');
      if (otpValue.length !== 6) {
        setError('Please enter the complete verification code');
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setStep(3);
      return;
    }
    
    if (step === 3) {
      if (!password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      
      // Auto login after password reset
      setMode('login');
      setStep(1);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setStep(1);
    setMode('login');
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setStep(1);
    setError('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetForm(); }}}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[#333] overflow-hidden">
        
        {/* Header Decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A572] to-transparent" />
        
        {/* Close Button */}
        <button
          onClick={() => { onClose(); resetForm(); }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h2 className="font-cormorant text-3xl font-light text-[#C5A572] tracking-wider">
              PDORQ
            </h2>
            <p className="text-[10px] tracking-[0.4em] text-white/40 uppercase mt-1">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </p>
          </div>

          {/* Progress Steps for Signup/Forgot */}
          {(mode === 'signup' || mode === 'forgot') && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    step >= s 
                      ? 'bg-[#C5A572] text-[#0D0D0D]' 
                      : 'bg-[#2a2a2a] text-white/40'
                  }`}>
                    {step > s ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-[#C5A572]' : 'bg-[#2a2a2a]'}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 rounded border border-[#444] peer-checked:bg-[#C5A572] peer-checked:border-[#C5A572] transition-all flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#0D0D0D] opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">Remember me</span>
                </label>
                
                <button 
                  onClick={() => switchMode('forgot')}
                  className="text-xs text-[#C5A572] hover:text-[#d4b896] transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-medium tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-white/40">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#555] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm text-white/70">Google</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#555] transition-colors">
                  <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span className="text-sm text-white/70">Telegram</span>
                </button>
              </div>

              <p className="text-center text-sm text-white/50 mt-6">
                Don't have an account?{' '}
                <button 
                  onClick={() => switchMode('signup')}
                  className="text-[#C5A572] hover:text-[#d4b896] transition-colors font-medium"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Welcome Bonus Banner */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#C5A572]/10 to-[#8B7355]/10 border border-[#C5A572]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C5A572]/20 flex items-center justify-center">
                        <span className="text-lg">🎁</span>
                      </div>
                      <div>
                        <p className="text-[#C5A572] font-medium text-sm">Welcome Bonus</p>
                        <p className="text-white/60 text-xs">Get {formatPrice(2, currency)} free credits on signup!</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Create Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors pr-12"
                        placeholder="Min. 8 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Password Strength */}
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            password.length >= i * 2 
                              ? password.length >= 8 ? 'bg-green-500' : 'bg-yellow-500'
                              : 'bg-[#333]'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-white/40 mt-1">
                      {password.length < 8 ? `${8 - password.length} more characters needed` : '✓ Strong password'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="••••••••"
                    />
                    {confirmPassword && (
                      <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-5 h-5 rounded border border-[#444] peer-checked:bg-[#C5A572] peer-checked:border-[#C5A572] transition-all flex items-center justify-center">
                        {agreeTerms && (
                          <svg className="w-3 h-3 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors leading-relaxed">
                      I agree to the <a href="#" className="text-[#C5A572] hover:underline">Terms of Service</a> and <a href="#" className="text-[#C5A572] hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#C5A572]/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium mb-1">Verify Your Email</h3>
                    <p className="text-white/50 text-sm">
                      We've sent a 6-digit code to<br />
                      <span className="text-[#C5A572]">{email}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 bg-[#1a1a1a] border border-[#333] rounded-lg text-center text-xl text-white focus:outline-none focus:border-[#C5A572] transition-colors"
                      />
                    ))}
                  </div>

                  <p className="text-center text-xs text-white/40 mt-4">
                    Didn't receive the code?{' '}
                    <button className="text-[#C5A572] hover:underline">Resend</button>
                  </p>
                </>
              )}

              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-medium tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{step === 3 ? 'Verifying...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span>{step === 1 ? 'Continue' : step === 2 ? 'Create Account' : 'Verify & Complete'}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="w-full py-3 text-white/50 hover:text-white transition-colors text-sm"
                >
                  ← Go Back
                </button>
              )}

              {step === 1 && (
                <p className="text-center text-sm text-white/50 mt-4">
                  Already have an account?{' '}
                  <button 
                    onClick={() => switchMode('login')}
                    className="text-[#C5A572] hover:text-[#d4b896] transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <div className="space-y-5">
              {step === 1 && (
                <>
                  <div className="text-center mb-2">
                    <p className="text-white/60 text-sm">Enter your email address and we'll send you a code to reset your password.</p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#C5A572]/20 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#C5A572]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-medium mb-1">Enter Reset Code</h3>
                    <p className="text-white/50 text-sm">
                      We've sent a 6-digit code to<br />
                      <span className="text-[#C5A572]">{email}</span>
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 bg-[#1a1a1a] border border-[#333] rounded-lg text-center text-xl text-white focus:outline-none focus:border-[#C5A572] transition-colors"
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="text-center mb-2">
                    <p className="text-white/60 text-sm">Create your new password</p>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] text-white/50 uppercase mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A572] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-[#C5A572] to-[#8B7355] text-[#0D0D0D] font-medium tracking-wider uppercase text-sm hover:shadow-lg hover:shadow-[#C5A572]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{step === 1 ? 'Send Reset Code' : step === 2 ? 'Verify Code' : 'Reset Password'}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <button
                onClick={() => switchMode('login')}
                className="w-full py-3 text-white/50 hover:text-white transition-colors text-sm"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
