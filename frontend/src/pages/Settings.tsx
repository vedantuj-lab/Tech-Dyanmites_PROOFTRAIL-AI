import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Cpu, Search, Database, Sliders, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchHealthStatus } from '../services/api';
import { SystemHealth } from '../types';

export const Settings: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const loadHealth = () => {
    setLoading(true);
    fetchHealthStatus()
      .then(setHealth)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-amber-400" /> Settings & System Status
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure research engine parameters, inspect API providers, and check connection health.
          </p>
        </div>

        <button
          onClick={loadHealth}
          className="flex items-center gap-2 bg-[#131B2E] hover:bg-[#1E293B] text-gray-200 border border-[#2A364F] text-xs font-semibold px-4 py-2 rounded-xl transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-check Health</span>
        </button>
      </div>

      {/* Grid Section: AI & Search Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nebius AI Provider */}
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-amber-400" /> AI Provider (Nebius)
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                health?.nebius.status === 'CONNECTED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {health?.nebius.status || 'CHECKING'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Target Model:</span>
              <span className="font-mono text-amber-400 font-bold">{health?.nebius.model || 'MiniMaxAI/MiniMax-M3'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">API Endpoint:</span>
              <span className="font-mono text-gray-200">https://api.tokenfactory.nebius.com/v1</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">API Key Status:</span>
              <span className="font-mono text-emerald-400">● MASKED & SECURE</span>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Details: {health?.nebius.details || 'Evaluating model response latency and connection status.'}
            </div>
          </div>
        </div>

        {/* Tavily Search Provider */}
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Search className="w-4 h-4 text-emerald-400" /> Search Provider (Tavily)
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                health?.tavily.status === 'CONNECTED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {health?.tavily.status || 'CHECKING'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Search Engine:</span>
              <span className="font-mono text-emerald-400 font-bold">Tavily Advanced Web Search</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Max Results Per Query:</span>
              <span className="font-mono text-gray-200">5 Results</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">API Key Status:</span>
              <span className="font-mono text-emerald-400">● MASKED & SECURE</span>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Details: {health?.tavily.details || 'Evaluating live web search query capability.'}
            </div>
          </div>
        </div>
      </div>

      {/* Database & Security Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SQLite Database */}
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Database className="w-4 h-4 text-blue-400" /> Database Engine (SQLite)
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              READY
            </span>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Storage Location:</span>
              <span className="font-mono text-gray-200">{health?.database.path || 'data/prooftrail.db'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Foreign Key Cascading:</span>
              <span className="font-mono text-emerald-400">ENABLED (PRAGMA foreign_keys = ON)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Schema Version:</span>
              <span className="font-mono text-gray-200">v1.0 (9 Tables)</span>
            </div>
          </div>
        </div>

        {/* Engine Preferences & Guardrails */}
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-purple-400" /> Engine Guardrails
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              ACTIVE
            </span>
          </div>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Max Research Rounds:</span>
              <span className="font-mono text-amber-400 font-bold">3 Controlled Rounds</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Citation Validator:</span>
              <span className="font-mono text-emerald-400 font-bold">Deterministic Python Code Check</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Prompt Injection Defense:</span>
              <span className="font-mono text-emerald-400 font-bold">Webpage Sanitizer Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
