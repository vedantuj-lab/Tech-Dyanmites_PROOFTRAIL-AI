import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Layers, Shield, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeProps {
  onStartResearch: (question: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStartResearch }) => {
  const [question, setQuestion] = useState('Should a startup enter India\'s EV charging market in 2027?');

  const exampleTopics = [
    {
      category: 'Market Strategy',
      title: 'EV Charging Infrastructure',
      desc: 'Evaluates adoption CAGR, DISCOM power tariffs, and FAME subsidies in India.',
      query: 'Should a startup enter India\'s EV charging market in 2027?',
      color: 'text-amber-400',
    },
    {
      category: 'Global Policy',
      title: 'EU CBAM Climate Regulations',
      desc: 'Analyzes tariff impacts on global steel exports and carbon compliance deadlines.',
      query: 'What is the current impact of the EU Carbon Border Adjustment Mechanism (CBAM) on global steel exports?',
      color: 'text-emerald-400',
    },
    {
      category: 'Energy & Tech',
      title: 'SMR Nuclear Power Viability',
      desc: 'Assesses commercial viability of small modular reactors for AI datacenters by 2030.',
      query: 'Evaluate the commercial viability of small modular nuclear reactors (SMRs) for datacenter power supply by 2030.',
      color: 'text-blue-400',
    },
  ];

  const processSteps = [
    { num: '01', title: 'Research Planning', desc: 'Decomposes question into subquestions and target research dimensions.' },
    { num: '02', title: 'Live Search', desc: 'Executes multi-stage Tavily queries across discovery and verification rounds.' },
    { num: '03', title: 'Verify Evidence', desc: 'Extracts verbatim passages and flags statistical discrepancies.' },
    { num: '04', title: 'Validate & Export', desc: 'Programmatically verifies citations and generates downloadable PDF report.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    onStartResearch(question);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          The Evidence Intelligence Engine
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Research beyond answers. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            Discover the evidence.
          </span>
        </h1>

        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          "Don't Just Trust the Answer. Trace the Evidence." ProofTrail AI turns complex questions into verifiable research backed by live web intelligence, verbatim passage mapping, and transparent citations.
        </p>
      </motion.div>

      {/* Main Research Input Composer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              What would you like to investigate?
            </label>
            <span className="text-xs text-gray-500">{question.length} / 500 chars</span>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a research question..."
            rows={3}
            className="w-full bg-[#090D16] border border-[#2A364F] rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 transition-all resize-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setQuestion('')}
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Clear input
            </button>

            <button
              type="submit"
              disabled={!question.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Launch Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>

      {/* Example Topics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Suggested Research Topics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {exampleTopics.map((topic, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              onClick={() => setQuestion(topic.query)}
              className="bg-[#131B2E] border border-[#2A364F] hover:border-amber-500/40 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] group"
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider ${topic.color}`}>
                {topic.category}
              </span>
              <h3 className="text-sm font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">{topic.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                <span>Use topic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4-Step Process Explanation */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
          ProofTrail Intelligence Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step, i) => (
            <div key={i} className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-5 space-y-2">
              <span className="text-2xl font-black text-amber-400">{step.num}</span>
              <h4 className="text-sm font-bold text-white">{step.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
