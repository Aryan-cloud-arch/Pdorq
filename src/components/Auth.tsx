import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function Auth({ isOpen, onClose, onSuccess }: AuthProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail(''); setPassword(''); setConfirmPassword(''); setFullName('');
    setError(''); setSuccess(''); setStep(1);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const logLogin = async (userId: string, userEmail: string) => {
    try {
      await supabase.from('login_logs').insert({
        user_id: userId,
        email: userEmail,
        user_agent: navigator.userAgent
      });
    } catch (e) {
      console.error('Failed to log login:', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message || 'Invalid email or password');
    } else {
      // Log the login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await logLogin(user.id, email);
      
      setSuccess('Login successful!');
      setTimeout(() => { handleClose(); onSuccess(); }, 1000);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!fullName.trim()) { setError('Please enter your name'); return; }
      if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email'); return; }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      
      setLoading(true);
      const { error } = await signUp(email, password, fullName);
      setLoading(false);

      if (error) {
        setError(error.message || 'Signup failed');
      } else {
        setSuccess('Account created! Check your email to verify.');
        setTimeout(() => { handleClose(); onSuccess(); }, 2000);
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Reset link sent to your email!');
    }
  };

  const getPasswordStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 6) s++;
    if (pass.length >= 10) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-[#0D0D0D] border border-gold/20 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="relative p-6 border-b border-gold/10">
          <button onClick={handleClose} className="absolute right-4 top-4 text-white/50 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-serif text-white">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? step === 1 ? 'Step 1: Your details' : 'Step 2: Create password' : 'Enter your email'}
            </p>
          </div>
          {mode === 'signup' && (
            <div className="flex gap-2 mt-4">
              {[1, 2].map((s) => (<div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gold' : 'bg-white/20'}`} />))}
            </div>
          )}
        </div>

        <div className="p-6">
          {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">✓ {success}</div>}
          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">{error}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 pr-12" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">{showPassword ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <button type="button" onClick={() => setMode('forgot')} className="text-gold/80 hover:text-gold text-sm">Forgot password?</button>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-gold to-gold/80 text-black font-semibold py-3 rounded-lg disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="your@email.com" required />
                  </div>
                  <div className="p-3 bg-gold/10 border border-gold/20 rounded-lg">
                    <p className="text-gold text-sm">🎁 Get <strong>$2 free credits</strong> on signup!</p>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="••••••••" required />
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">{[...Array(5)].map((_, i) => (<div key={i} className={`h-1 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/20'}`} />))}</div>
                        <p className="text-xs text-white/50">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Confirm Password</label>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="••••••••" required />
                    {confirmPassword && password !== confirmPassword && <p className="text-red-400 text-xs mt-1">Passwords don't match</p>}
                    {confirmPassword && password === confirmPassword && <p className="text-green-400 text-xs mt-1">✓ Match</p>}
                  </div>
                </>
              )}
              <div className="flex gap-3">
                {step === 2 && <button type="button" onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white py-3 rounded-lg">Back</button>}
                <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-gold to-gold/80 text-black font-semibold py-3 rounded-lg disabled:opacity-50">
                  {loading ? 'Creating...' : step === 1 ? 'Continue' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50" placeholder="your@email.com" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-gold to-gold/80 text-black font-semibold py-3 rounded-lg disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            {mode === 'login' ? (
              <p className="text-white/60 text-sm">Don't have an account? <button onClick={() => { setMode('signup'); resetForm(); }} className="text-gold hover:underline">Sign up</button></p>
            ) : (
              <p className="text-white/60 text-sm">Already have an account? <button onClick={() => { setMode('login'); resetForm(); }} className="text-gold hover:underline">Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
