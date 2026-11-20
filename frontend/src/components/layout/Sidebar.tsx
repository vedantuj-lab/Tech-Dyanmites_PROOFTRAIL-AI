import React, { useEffect, useState } from 'react';
import {
  Home,
  Compass,
  FileText,
  History,
  ShieldCheck,
  Search,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react';
import { fetchHealthStatus } from '../../services/api';
import { SystemHealth } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    fetchHealthStatus()
      .then(setHealth)
      .catch(() => null);
  }, []);

  const navItems = [
    { id: 'Home', label: 'Home Workspace', icon: Home },
    { id: 'Workspace', label: 'Research Workspace', icon: Compass },
    { id: 'Evidence Explorer', label: 'Evidence Explorer', icon: ShieldCheck },
    { id: 'Final Report', label: 'Final Report', icon: FileText },
    { id: 'Research History', label: 'Research History', icon: History },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-[#2A364F] flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#2A364F]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white tracking-tight leading-none">
                ProofTrail AI
              </div>
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mt-1">
                Evidence Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Integration Status Footer */}
      <div className="p-4 border-t border-[#2A364F] bg-[#090D16]/50">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-amber-400" />
          <span>System Status</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <Cpu className="w-3 h-3 text-gray-500" /> Nebius LLM:
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                health?.nebius.status === 'CONNECTED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {health?.nebius.status || 'CHECKING'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <Search className="w-3 h-3 text-gray-500" /> Tavily Search:
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                health?.tavily.status === 'CONNECTED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {health?.tavily.status || 'CHECKING'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <Database className="w-3 h-3 text-gray-500" /> SQLite DB:
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
              READY
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-[#2A364F]/50 text-[10px] text-gray-500 text-center">
          ProofTrail AI v1.0.0
        </div>
      </div>
    </aside>
  );
};
