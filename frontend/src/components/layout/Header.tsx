import React from 'react';
import { ShieldCheck, Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getFeatureTheme } from '../../utils/theme';

interface HeaderProps {
  currentTab: string;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const { user, logout } = useAuth();
  const theme = getFeatureTheme(currentTab);

  const roleColor =
    user?.role === 'ADMIN'
      ? 'text-sky-400 bg-sky-500/10 border-sky-500/30'
      : user?.role === 'REVIEWER'
      ? 'text-pink-400 bg-pink-500/10 border-pink-500/30'
      : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

  return (
    <header className={`h-16 ${theme.headerBg} backdrop-blur border-b ${theme.cardBorder} px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300`}>
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-base text-white tracking-tight">{theme.name}</h1>
        <div className="h-4 w-px bg-white/20" />
        <span className={`text-xs ${theme.badgeText} font-semibold`}>The Evidence Intelligence Engine</span>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded-xl text-xs backdrop-blur">
              <UserIcon className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-white font-bold">{user.full_name}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${roleColor}`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg border border-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Guest Mode</span>
          </div>
        )}
      </div>
    </header>
  );
};
