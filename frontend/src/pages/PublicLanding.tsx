import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Cpu,
  Database,
  Lock,
  Layers,
  Users,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicLandingProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onOpenLogin, onOpenSignup }) => {
  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-400">
      {/* Navigation Header */}
      <header className="h-20 border-b border-[#2A364F] px-8 flex items-center justify-between sticky top-0 bg-[#090D16]/90 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-black font-bold" />
          </div>
          <div>
            <span className="font-extrabold text-xl text-white tracking-tight">ProofTrail AI</span>
            <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              The Evidence Intelligence Engine
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#roles" className="hover:text-white transition-colors">Role Solutions</a>
          <a href="#security" className="hover:text-white transition-colors">Security & RBAC</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="text-xs font-bold text-gray-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onOpenSignup}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          THE EVIDENCE INTELLIGENCE ENGINE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto"
        >
          Research beyond answers. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
            Discover the evidence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          Turn complex research questions into trustworthy, evidence-backed intelligence with live web search, Nebius AI reasoning, claim verification, and transparent citations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={onOpenSignup}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-amber-500/20 transition-all w-full sm:w-auto"
          >
            <span>Start Researching</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenLogin}
            className="flex items-center justify-center gap-2 bg-[#131B2E] hover:bg-[#1E293B] text-white font-semibold text-sm px-8 py-3.5 rounded-xl border border-[#2A364F] transition-all w-full sm:w-auto"
          >
            <span>Sign In to Platform</span>
          </button>
        </motion.div>
      </section>

      {/* Role Introduction Cards */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-16 space-y-8 border-t border-[#2A364F]">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Multi-Role Architecture</h2>
          <h3 className="text-2xl font-extrabold text-white">Purpose-Built Workspaces for Every Role</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              01
            </div>
            <h4 className="text-lg font-bold text-white">Researcher Workspace</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Conduct multi-stage web investigations, generate research plans, map claims to verbatim evidence, and export PDF reports.
            </p>
          </div>

          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              02
            </div>
            <h4 className="text-lg font-bold text-white">Analyst / Reviewer Workspace</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Evaluate evidence quality, annotate claims, analyze statistical conflicts, and issue formal review decisions (`Approved`, `Revision Required`).
            </p>
          </div>

          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
              03
            </div>
            <h4 className="text-lg font-bold text-white">Administrator Hub</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Manage platform users, assign reviewer workloads, monitor AI/search health, and inspect security audit logs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A364F] py-8 px-8 text-center text-xs text-gray-500">
        <p>ProofTrail AI — The Evidence Intelligence Engine © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};
