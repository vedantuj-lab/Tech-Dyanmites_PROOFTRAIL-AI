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
  Globe,
  Upload,
  Network,
  Sliders,
  Settings as SettingsIcon,
  CheckSquare,
  Users,
  Lock,
} from 'lucide-react';
import { fetchHealthStatus } from '../../services/api';
import { SystemHealth } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getFeatureTheme } from '../../utils/theme';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { user } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    fetchHealthStatus()
      .then(setHealth)
      .catch(() => null);
  }, []);

  const researcherItems = [
    { id: 'Home', label: 'Overview', icon: Home },
    { id: 'Workspace', label: 'Research Workspace', icon: Compass },
    { id: 'Website Importer', label: 'Website Importer', icon: Globe },
    { id: 'Document Library', label: 'Document Library', icon: Upload },
    { id: 'Evidence Explorer', label: 'Evidence Explorer', icon: ShieldCheck },
    { id: 'Evidence Map', label: 'Evidence Map', icon: Network },
    { id: 'Decision Briefs', label: 'Decision Intelligence', icon: Sliders },
    { id: 'Final Report', label: 'My Reports', icon: FileText },
    { id: 'Research History', label: 'Research History', icon: History },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
  ];

  const reviewerItems = [
    { id: 'Assigned Overview', label: 'Assigned Overview', icon: Home },
    { id: 'Assigned Reviews', label: 'Assigned Reviews', icon: CheckSquare },
    { id: 'Evidence Validation', label: 'Evidence Validation', icon: ShieldCheck },
    { id: 'Review History', label: 'Review History', icon: History },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
  ];

  const adminItems = [
    { id: 'Platform Overview', label: 'Platform Overview', icon: Home },
    { id: 'User Management', label: 'User Management', icon: Users },
    { id: 'Review Assignments', label: 'Review Assignments', icon: CheckSquare },
    { id: 'Audit Logs', label: 'Security Audit Logs', icon: Lock },
    { id: 'Settings', label: 'Platform Settings', icon: SettingsIcon },
  ];

  const isReviewer = user?.role === 'REVIEWER';
  const isAdmin = user?.role === 'ADMIN';

  const sidebarClass = isAdmin
    ? 'bg-[#0F172A] border-[#2A364F]'
    : isReviewer
    ? 'bg-[#4C0519] border-rose-900/60'
    : 'bg-[#022C22] border-emerald-900/60';

  const brandColor = isAdmin
    ? 'text-sky-400'
    : isReviewer
    ? 'text-pink-400'
    : 'text-emerald-400';

  const navItems = isAdmin ? adminItems : isReviewer ? reviewerItems : researcherItems;

  return (
    <aside className={`w-64 border-r flex flex-col justify-between h-screen sticky top-0 z-40 select-none ${sidebarClass}`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <div className="font-extrabold text-lg text-white tracking-tight leading-none">
                ProofTrail AI
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${brandColor}`}>
                {user?.role || 'RESEARCHER'} WORKSPACE
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2 max-h-[calc(100vh-250px)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const featureTheme = getFeatureTheme(item.id);

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? `${featureTheme.sidebarActiveBg} ${featureTheme.sidebarActiveText} border ${featureTheme.sidebarActiveBorder} shadow-sm font-bold`
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? featureTheme.sidebarActiveText : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Integration Status Footer */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Layers className="w-3 h-3 text-amber-400" />
          <span>System Status</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 flex items-center gap-1.5 text-[11px]">
              <Cpu className="w-3 h-3 text-gray-400" /> Nebius LLM:
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                health?.nebius.status === 'CONNECTED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {health?.nebius.status || 'CHECKING'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <Search className="w-3 h-3 text-gray-400" /> Tavily Search:
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                health?.tavily.status === 'CONNECTED'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}
            >
              {health?.tavily.status || 'CHECKING'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1.5 text-[11px]">
              <Database className="w-3 h-3 text-gray-400" /> SQLite DB:
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
              READY
            </span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 text-center">
          ProofTrail AI v1.0.0
        </div>
      </div>
    </aside>
  );
};
