import React from 'react';
import { ShieldCheck, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const { user, logout } = useAuth();

  const roleColor = user?.role === 'ADMIN' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : user?.role === 'REVIEWER' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <header className="h-16 bg-[#0F172A]/80 backdrop-blur border-b border-[#2A364F] px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-base text-white tracking-tight">{currentTab}</h1>
        <div className="h-4 w-px bg-gray-700" />
        <span className="text-xs text-gray-400">The Evidence Intelligence Engine</span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#131B2E] border border-[#2A364F] px-3 py-1 rounded-xl text-xs">
              <UserIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-white font-bold">{user.full_name}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${roleColor}`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-[#2A364F] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#131B2E] border border-[#2A364F] px-3 py-1.5 rounded-full text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Guest Mode</span>
          </div>
        )}
      </div>
    </header>
  );
};
