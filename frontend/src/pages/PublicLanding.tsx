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
  Globe,
  Upload,
  Network,
  AlertTriangle,
  Award,
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
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
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

      {/* 2. Hero Section — Split Screen with Local SVG Graphic */}
      <section className="bg-[#0F172A] border-b border-[#1E293B] px-6 py-16 lg:py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text & Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              THE EVIDENCE INTELLIGENCE ENGINE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Research Beyond Answers. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
                Discover the Evidence.
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Turn complex research questions into trustworthy intelligence with live web search, AI reasoning, claim verification, source-quality analysis, and transparent citations.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
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
                <span>Explore Platform</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column Visual Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900/80 p-2">
              <img
                src="/images/landing/hero-illustration.svg"
                alt="ProofTrail AI Evidence Graph Workspace Illustration"
                className="w-full h-auto rounded-xl object-cover"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Product Preview Section — Warm Light Ivory & Local SVG Preview */}
      <section id="product" className="bg-[#FAF8F5] border-b border-amber-200/60 px-6 py-20 text-gray-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Interactive Product Preview
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Trace Every Claim to Verbatim Source Passages
            </h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Inspect how ProofTrail AI connects research findings to original published documents and live web quotes.
            </p>
          </div>

          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xl">
            <img
              src="/images/landing/product-preview.svg"
              alt="ProofTrail AI Report & Source Lineage Index Preview"
              className="w-full h-auto rounded-xl object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 4. How It Works Section — Light Lavender & 6 Visual Steps */}
      <section id="how-it-works" className="bg-[#F5F3FF] border-b border-purple-200 px-6 py-20 text-gray-900">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-purple-700 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Research Pipeline Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-purple-950 tracking-tight">
              6-Step Evidence Intelligence Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', title: '1. Ask Research Question', desc: 'Enter any research query or upload document/website targets.' },
              { num: '02', title: '2. Generate Research Plan', desc: 'Nebius decomposes objective into subquestions and search dimensions.' },
              { num: '03', title: '3. Retrieve Live Web Sources', desc: 'Executes multi-round Tavily queries across discovery and verification.' },
              { num: '04', title: '4. Extract Claims & Passages', desc: 'Maps exact verbatim passages directly from raw retrieved text.' },
              { num: '05', title: '5. Verify & Detect Conflicts', desc: 'Surfaces statistical discrepancies and rates source authority.' },
              { num: '06', title: '6. Synthesize Report & PDF', desc: 'Validates citations programmatically & generates downloadable PDF.' },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-purple-200 rounded-2xl p-6 space-y-3 shadow-md hover:border-purple-400 transition-all">
                <span className="text-3xl font-black text-purple-600">{step.num}</span>
                <h3 className="text-base font-bold text-purple-950">{step.title}</h3>
                <p className="text-xs text-purple-800/80 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Feature Showcase Section — Dark Emerald & Charcoal */}
      <section id="features" className="bg-[#062016] border-b border-emerald-900/60 px-6 py-20 text-white">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Comprehensive Feature Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Built for Verifiable Research & Decision Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Intelligent Planning', desc: 'Nebius subquestion decomposition & research dimensions.', icon: Compass, color: 'text-emerald-400' },
              { title: 'Live Web Search', desc: 'Multi-stage Tavily queries & URL parameter deduplication.', icon: Search, color: 'text-teal-400' },
              { title: 'Website Importer', desc: 'Import permitted website URLs with SSRF protection.', icon: Globe, color: 'text-orange-400' },
              { title: 'Document Library', desc: 'Upload PDF, DOCX, TXT, CSV with page parsing.', icon: Upload, color: 'text-violet-400' },
              { title: 'Evidence Explorer', desc: 'Claim matrix with verbatim quoted passages.', icon: ShieldCheck, color: 'text-emerald-300' },
              { title: 'Conflict Detection', desc: 'Surfaces opposing statistics & timeline differences.', icon: AlertTriangle, color: 'text-rose-400' },
              { title: 'Decision Briefs', desc: 'Executive decision frameworks with recommendations.', icon: Sliders, color: 'text-amber-400' },
              { title: 'PDF Export', desc: 'ReportLab PDF generation with clickable citations.', icon: FileText, color: 'text-slate-300' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="bg-[#092B1E] border border-emerald-800/50 rounded-2xl p-6 space-y-3 shadow-lg">
                  <Icon className={`w-7 h-7 ${feat.color}`} />
                  <h3 className="text-sm font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Role Solutions Section — Deep Plum & Rose */}
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
                Conduct multi-stage web investigations, generate research plans, map claims to verbatim evidence, import documents, and export PDF reports.
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

      {/* 7. Security & RBAC Section — Dark Slate & Teal Graphic */}
      <section id="security" className="bg-[#1E293B] border-b border-slate-700 px-6 py-20 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-extrabold text-teal-300 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Enterprise Security & Integrity
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Security Safeguards & Deterministic Citation Validation
            </h2>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3 bg-[#0F172A] p-4 rounded-xl border border-teal-500/30">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Deterministic Citation Validation:</strong> Programmatically checks that every citation maps to a real source and flags unsupported claims.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0F172A] p-4 rounded-xl border border-teal-500/30">
                <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">SSRF & Injection Defense:</strong> Filters prompt injection triggers and blocks private network targets during website imports.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0F172A] p-4 rounded-xl border border-teal-500/30">
                <Users className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Role-Based Access Control:</strong> Backend-enforced authorization rules ensure researchers, reviewers, and admins access only permitted data.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <img
              src="/images/landing/security-shield.svg"
              alt="ProofTrail Security Shield"
              className="w-full max-w-sm h-auto rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-[#0B0F17] border-t border-gray-800 py-8 px-8 text-center text-xs text-gray-400">
        <p>ProofTrail AI — The Evidence Intelligence Engine © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
};
