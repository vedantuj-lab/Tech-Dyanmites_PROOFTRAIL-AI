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
      {/* 1. Navigation Header */}
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
          <a href="#security" className="hover:text-teal-400 transition-colors">Security &amp; RBAC</a>
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

      {/* 2. Hero Section — Split Screen with Real Professional Photography */}
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

          {/* Right Column: Real Professional Photography */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
              <img
                src="/images/landing_hero.jpg"
                alt="Professional Research Analyst Working on Multi-Monitor Desk Setup"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Enterprise Research Analyst Workspace</div>
                  <div className="text-[10px] text-amber-400 font-mono">Multi-stage web search &amp; passage extraction</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  LIVE VERIFIED
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Product Preview Section — Warm Light Ivory & Real Photo Dashboard */}
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

          <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xl overflow-hidden">
            <img
              src="/images/landing_product_preview.jpg"
              alt="ProofTrail AI Real Product Dashboard Sourcing Interface"
              className="w-full h-[400px] object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 4. How It Works Section — Light Lavender & 6 Step Photography Cards */}
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
              { num: '01', title: '1. Ask Research Question', desc: 'Researcher typing a complex question on a laptop.', img: '/images/landing_how_step1.jpg' },
              { num: '02', title: '2. Generate Research Plan', desc: 'Analyst reviewing research notes and subquestion breakdown.', img: '/images/landing_how_step2.jpg' },
              { num: '03', title: '3. Retrieve Live Web Sources', desc: 'Researcher examining information across multiple windows.', img: '/images/landing_how_step3.jpg' },
              { num: '04', title: '4. Extract Claims & Evidence', desc: 'Professional examining printed reports and digital passages.', img: '/images/landing_how_step4.jpg' },
              { num: '05', title: '5. Verify Claims & Conflicts', desc: 'Analyst comparing official documents and source materials.', img: '/images/landing_how_step5.jpg' },
              { num: '06', title: '6. Synthesize Report & PDF', desc: 'Research professional presenting findings on a screen.', img: '/images/landing_how_step6.jpg' },
            ].map((step, i) => (
              <div key={i} className="bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-md hover:border-purple-400 transition-all flex flex-col justify-between">
                <div className="h-44 overflow-hidden relative">
                  <img src={step.img} alt={step.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-purple-900/90 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                    {step.num}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-purple-950">{step.title}</h3>
                  <p className="text-xs text-purple-800/80 leading-relaxed">{step.desc}</p>
                </div>
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
              Built for Verifiable Research &amp; Decision Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Intelligent Planning', desc: 'Nebius subquestion decomposition &amp; research dimensions.', icon: Compass, color: 'text-emerald-400' },
              { title: 'Live Web Search', desc: 'Multi-stage Tavily queries &amp; URL parameter deduplication.', icon: Search, color: 'text-teal-400' },
              { title: 'Website Importer', desc: 'Import permitted website URLs with SSRF protection.', icon: Globe, color: 'text-orange-400' },
              { title: 'Document Library', desc: 'Upload PDF, DOCX, TXT, CSV with page parsing.', icon: Upload, color: 'text-violet-400' },
              { title: 'Evidence Explorer', desc: 'Claim matrix with verbatim quoted passages.', icon: ShieldCheck, color: 'text-emerald-300' },
              { title: 'Conflict Detection', desc: 'Surfaces opposing statistics &amp; timeline differences.', icon: AlertTriangle, color: 'text-rose-400' },
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

      {/* 6. Role Solutions Section — Deep Plum & Real Photography Cards */}
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
            {/* Researcher */}
            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="h-48 overflow-hidden">
                <img src="/images/landing_role_researcher.jpg" alt="Researcher Working" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Researcher Workspace</h3>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Conduct multi-stage web investigations, generate research plans, map claims to verbatim evidence, import documents, and export PDF reports.
                </p>
              </div>
            </div>

            {/* Reviewer */}
            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="h-48 overflow-hidden">
                <img src="/images/landing_role_reviewer.jpg" alt="Academic Reviewer Annotating" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Analyst / Reviewer Workspace</h3>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Evaluate evidence quality, annotate claims, analyze statistical conflicts, and issue formal review decisions (`Approved`, `Revision Required`).
                </p>
              </div>
            </div>

            {/* Admin */}
            <div className="bg-[#3B0764] border border-rose-500/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="h-48 overflow-hidden">
                <img src="/images/landing_role_admin.jpg" alt="IT Admin Monitoring Environment" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Administrator Hub</h3>
                <p className="text-xs text-purple-200 leading-relaxed">
                  Manage platform users, assign reviewer workloads, monitor AI/search health, and inspect security audit logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Security & RBAC Section — Real SOC Operations Photo */}
      <section id="security" className="bg-[#1E293B] border-b border-slate-700 px-6 py-20 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold text-teal-300 bg-teal-500/20 border border-teal-400/30 px-3 py-1 rounded-full uppercase tracking-wider">
              Enterprise Security &amp; Integrity
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Security Operations Center &amp; Citation Integrity
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
                  <strong className="text-white">SSRF &amp; Injection Defense:</strong> Filters prompt injection triggers and blocks private network targets during website imports.
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

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <img
                src="/images/landing_security.jpg"
                alt="Cybersecurity Professional Monitoring SOC Operations"
                className="w-full h-[360px] object-cover"
                loading="lazy"
              />
            </div>
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
