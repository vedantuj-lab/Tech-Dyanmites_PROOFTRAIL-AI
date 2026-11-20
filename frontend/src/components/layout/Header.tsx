import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  return (
    <header className="h-16 bg-[#0F172A]/80 backdrop-blur border-b border-[#2A364F] px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-base text-white tracking-tight">{currentTab}</h1>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-xs text-gray-400">The Evidence Intelligence Engine</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#131B2E] border border-[#2A364F] px-3 py-1.5 rounded-full text-xs">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-gray-300 font-medium">Orchestrator Engine Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Citation Integrity Guardrail</span>
        </div>
      </div>
    </header>
  );
};
