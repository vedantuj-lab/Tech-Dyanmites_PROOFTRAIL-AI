import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lock, AlertCircle, Loader2 } from 'lucide-react';
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

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mx-auto">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Sign In to ProofTrail AI</h2>
          <p className="text-xs text-gray-400">Enter your credentials to access your dashboard.</p>
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
              placeholder="e.g. researcher@prooftrail.ai"
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

        {/* Quick Bootstrap Account Credentials Preset Buttons */}
        <div className="pt-3 border-t border-[#2A364F] space-y-2">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
            Quick Demo Sign-In
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillQuickDemo('researcher@prooftrail.ai', 'Researcher@123')}
              className="py-1.5 px-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-lg text-[10px] text-amber-400 font-bold text-center"
            >
              Researcher
            </button>
            <button
              onClick={() => fillQuickDemo('reviewer@prooftrail.ai', 'Reviewer@123')}
              className="py-1.5 px-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-lg text-[10px] text-emerald-400 font-bold text-center"
            >
              Reviewer
            </button>
            <button
              onClick={() => fillQuickDemo('admin@prooftrail.ai', 'Admin@123')}
              className="py-1.5 px-2 bg-[#090D16] hover:bg-slate-800 border border-[#2A364F] rounded-lg text-[10px] text-blue-400 font-bold text-center"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className="text-amber-400 font-bold hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};
