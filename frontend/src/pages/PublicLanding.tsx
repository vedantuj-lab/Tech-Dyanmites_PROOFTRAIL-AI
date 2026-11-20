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
  Compass,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicLandingProps {
  onOpenLogin: () => void;
  onOpenSignup: () => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({ onOpenLogin, onOpenSignup }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/20 selection:text-amber-400">
      {/* 1. Dark Charcoal Navigation Header */}
      <header className="h-20 bg-[#0B0F17] border-b border-[#2A364F] px-8 flex items-center justify-between sticky top-0 z-50 shadow-md">
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

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-300">
          <a href="#product" className="hover:text-amber-400 transition-colors">Product Preview</a>
          <a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
          <a href="#roles" className="hover:text-rose-400 transition-colors">Role Solutions</a>
          <a href="#security" className="hover:text-teal-400 transition-colors">Security & RBAC</a>
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

      {/* 2. Hero Section — Dark Graphite & Amber Gold */}
      <section className="bg-[#0F172A] border-b border-[#1E293B] px-6 py-20 text-center space-y-8">
        <div className="max-w-4xl mx-auto space-y-6">
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
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight"
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
            className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            "Don't Just Trust the Answer. Trace the Evidence." ProofTrail AI turns complex questions into verifiable research backed by live web search, verbatim passage mapping, and transparent citations.
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
              className="flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-slate-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl border border-slate-600 transition-all w-full sm:w-auto"
            >
              <span>Sign In to Platform</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* 3. Product Preview Section — Warm Light Ivory & Emerald Green */}
      <section id="product" className="bg-[#FAF8F5] border-b border-amber-200/60 px-6 py-20 text-gray-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Interactive Product Demo
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Trace Every Claim to Verbatim Source Passages
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Inspect how ProofTrail AI connects research findings to original published documents and live web quotes.
            </p>
          </div>

          {/* Interactive Card Preview */}
          <div className="bg-white border border-amber-200/80 rounded-2xl p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700">[DEMO INVESTIGATION]</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">Should a startup enter India's EV charging market in 2027?</h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                SUPPORTED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">Extracted Claim</h4>
                <p className="text-sm font-semibold text-gray-900 bg-amber-50/80 p-4 rounded-xl border border-amber-200">
                  "India's EV charging market is projected to reach $4.1 Billion by 2030 with a CAGR exceeding 32%."
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-emerald-700 tracking-wider">Verbatim Mapped Passage</h4>
                <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-l-emerald-600 border border-emerald-200 text-xs text-emerald-950 font-serif italic">
                  "The Indian electric vehicle charging infrastructure market size is expected to grow from $1.2B in 2024 to $4.1B by 2030 at a CAGR of 32.5%."
                  <div className="not-italic font-sans text-[11px] font-bold text-emerald-800 mt-2">
                    Source: GrandView Research (2024 Market Sizing)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section — Light Lavender & Violet */}
      <section id="how-it-works" className="bg-[#F5F3FF] border-b border-purple-200 px-6 py-20 text-gray-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Research Pipeline Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-purple-950 tracking-tight">
              4-Step Evidence Intelligence Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Plan Research', desc: 'Decomposes objective into target subquestions and research dimensions.' },
              { num: '02', title: 'Investigate', desc: 'Executes multi-stage Tavily queries across discovery and verification rounds.' },
              { num: '03', title: 'Verify Evidence', desc: 'Extracts verbatim passages and flags statistical discrepancies.' },
              { num: '04', title: 'Generate Report', desc: 'Programmatically verifies citations and exports downloadable PDF.' },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-purple-200 rounded-2xl p-6 space-y-3 shadow-md">
                <span className="text-3xl font-black text-purple-600">{step.num}</span>
                <h3 className="text-base font-bold text-purple-950">{step.title}</h3>
                <p className="text-xs text-purple-800/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Role Solutions Section — Deep Plum & Rose */}
      <section id="roles" className="bg-[#2E1065] border-b border-purple-900 px-6 py-20 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-rose-300 bg-rose-500/20 border border-rose-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Role-Specific Workspaces
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Purpose-Built Workspaces for Every Role
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-white">Researcher Workspace</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Conduct multi-stage web investigations, generate research plans, map claims to verbatim evidence, and export PDF reports.
              </p>
            </div>

            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-white">Analyst / Reviewer Workspace</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Evaluate evidence quality, annotate claims, analyze statistical conflicts, and issue formal review decisions (`Approved`, `Revision Required`).
              </p>
            </div>

            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-white">Administrator Hub</h3>
              <p className="text-xs text-purple-200 leading-relaxed">
                Manage platform users, assign reviewer workloads, monitor AI/search health, and inspect security audit logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & RBAC Section — Dark Slate & Teal */}
      <section id="security" className="bg-[#1E293B] border-b border-slate-700 px-6 py-20 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-teal-300 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Enterprise Security & Integrity
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Security Safeguards & Citation Validation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0F172A] border border-teal-500/30 rounded-2xl p-6 space-y-3">
              <ShieldCheck className="w-8 h-8 text-teal-400" />
              <h4 className="text-base font-bold text-white">Deterministic Citation Validation</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Programmatically checks that every citation maps to a real source and flags unsupported claims.
              </p>
            </div>

            <div className="bg-[#0F172A] border border-teal-500/30 rounded-2xl p-6 space-y-3">
              <Lock className="w-8 h-8 text-teal-400" />
              <h4 className="text-base font-bold text-white">SSRF & Injection Defense</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Filters prompt injection triggers and blocks private network targets during website imports.
              </p>
            </div>

            <div className="bg-[#0F172A] border border-teal-500/30 rounded-2xl p-6 space-y-3">
              <Users className="w-8 h-8 text-teal-400" />
              <h4 className="text-base font-bold text-white">Role-Based Access Control</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Backend-enforced authorization rules ensure researchers, reviewers, and admins access only their permitted data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-[#0B0F17] border-t border-gray-800 py-8 px-8 text-center text-xs text-gray-400">
        <p>ProofTrail AI — The Evidence Intelligence Engine © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};
