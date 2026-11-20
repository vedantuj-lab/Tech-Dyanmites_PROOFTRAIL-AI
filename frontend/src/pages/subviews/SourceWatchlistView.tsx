import React, { useState } from 'react';
import { Eye, Plus, ExternalLink, RefreshCw } from 'lucide-react';

export const SourceWatchlistView: React.FC = () => {
  const [watchlist, setWatchlist] = useState([
    { id: 'w1', name: 'NITI Aayog National EV Guidelines', url: 'https://niti.gov.in/reports/ev-charging-guidelines-2026', status: 'MONITORING', lastCheck: '2 hours ago' },
    { id: 'w2', name: 'GrandView Research EV Market Sizing', url: 'https://www.grandviewresearch.com/industry-analysis/india-ev-charging-infrastructure-market', status: 'MONITORING', lastCheck: '1 day ago' },
    { id: 'w3', name: 'Tata Power EZ Charge Operational Updates', url: 'https://www.tatapower.com/news/ev-charging-network-milestone-2026', status: 'MONITORING', lastCheck: '3 days ago' },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-lime-400" /> Source Watchlist & Monitoring
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Monitor critical policy guidelines, market reports, and corporate releases for update changes.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs px-4 py-2 rounded-xl transition-all">
          <Plus className="w-4 h-4" />
          <span>Add Watched Source</span>
        </button>
      </div>

      <div className="space-y-3">
        {watchlist.map((item) => (
          <div key={item.id} className="bg-[#12200A] border border-lime-500/30 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{item.name}</span>
                <span className="text-[10px] font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/30">
                  {item.status}
                </span>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-lime-300 flex items-center gap-1">
                <span>{item.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-400 text-[11px]">Last checked: {item.lastCheck}</span>
              <button className="p-2 bg-[#0A1406] hover:bg-lime-900/40 text-lime-400 border border-lime-500/30 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
