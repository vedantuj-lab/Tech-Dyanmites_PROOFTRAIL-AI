import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, AlertCircle, Loader2, Layers, Shield, User } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        {/* Environment Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
          <Layers className="w-3 h-3" /> DEMO ENVIRONMENT
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Sign In to ProofTrail AI</h2>
          <p className="text-xs text-gray-400">Enter your credentials or select a 1-click demo role account.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. researcher@prooftrail.demo"
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

        {/* 1-Click Role-Based Demo Accounts Section */}
        <div className="pt-3 border-t border-[#2A364F] space-y-2.5">
          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider text-center flex items-center justify-center gap-1">
            <User className="w-3 h-3" /> One-Click Role Demo Sign-In
          </div>

          <div className="grid grid-cols-1 gap-2">
            {/* Researcher */}
            <button
              onClick={() => handleQuickDemoLogin('researcher@prooftrail.demo', 'Research@123')}
              className="p-2.5 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] hover:border-amber-500/50 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400">
                  Aarav Mehta <span className="text-[10px] text-amber-400 font-mono">(Researcher)</span>
                </div>
                <div className="text-[10px] text-gray-500">researcher@prooftrail.demo</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Analyst / Reviewer */}
            <button
              onClick={() => handleQuickDemoLogin('reviewer@prooftrail.demo', 'Review@123')}
              className="p-2.5 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] hover:border-emerald-500/50 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400">
                  Ananya Sharma <span className="text-[10px] text-emerald-400 font-mono">(Reviewer)</span>
                </div>
                <div className="text-[10px] text-gray-500">reviewer@prooftrail.demo</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Administrator */}
            <button
              onClick={() => handleQuickDemoLogin('admin@prooftrail.demo', 'Admin@123')}
              className="p-2.5 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] hover:border-blue-500/50 rounded-xl flex items-center justify-between text-left transition-all group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400">
                  Rohan Kapoor <span className="text-[10px] text-blue-400 font-mono">(Admin)</span>
                </div>
                <div className="text-[10px] text-gray-500">admin@prooftrail.demo</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pt-1">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-amber-400 font-bold hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
