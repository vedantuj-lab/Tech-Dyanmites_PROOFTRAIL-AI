import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, AlertCircle, Loader2, Layers, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail, demoPass);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-3xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl relative">
        {/* Left Side: Login Form */}
        <div className="md:col-span-7 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-black text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-white text-base">ProofTrail AI</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                DEMO ENVIRONMENT
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">Sign In to Platform</h2>
              <p className="text-xs text-gray-400">Enter your credentials or click a role demo account below.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@prooftrail.demo"
                  className="w-full bg-[#090D16] border border-[#2A364F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#090D16] border border-[#2A364F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Sign In</span>
              </button>
            </form>
          </div>

          {/* 1-Click Role Demo Sign-In Buttons */}
          <div className="pt-4 border-t border-[#2A364F] space-y-2">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3 h-3" /> One-Click Role Demo Accounts
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickDemoLogin('researcher@prooftrail.demo', 'Research@123')}
                className="p-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-xl text-left transition-all"
              >
                <div className="text-[11px] font-bold text-white">Aarav Mehta</div>
                <div className="text-[9px] text-amber-400 font-mono">Researcher</div>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('reviewer@prooftrail.demo', 'Review@123')}
                className="p-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-xl text-left transition-all"
              >
                <div className="text-[11px] font-bold text-white">Ananya Sharma</div>
                <div className="text-[9px] text-emerald-400 font-mono">Reviewer</div>
              </button>

              <button
                onClick={() => handleQuickDemoLogin('admin@prooftrail.demo', 'Admin@123')}
                className="p-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-xl text-left transition-all"
              >
                <div className="text-[11px] font-bold text-white">Rohan Kapoor</div>
                <div className="text-[9px] text-blue-400 font-mono">Admin</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Real Photography Asset */}
        <div className="md:col-span-5 bg-[#090D16] relative hidden md:block border-l border-[#2A364F] overflow-hidden">
          <img
            src="/images/authentication_login.jpg"
            alt="Researcher Working in Office Setup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
            <div className="text-sm font-bold">ProofTrail AI Enterprise Hub</div>
            <div className="text-xs text-amber-400">Verifiable Research &amp; Decision Intelligence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
