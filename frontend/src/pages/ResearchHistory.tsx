import React, { useEffect, useState } from 'react';
import { History, Search, Trash2, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { fetchHistory, deleteHistorySession } from '../services/api';
import { ResearchSession } from '../types';

interface ResearchHistoryProps {
  onSelectSession: (tab: string, sessionId: string) => void;
}

export const ResearchHistory: React.FC<ResearchHistoryProps> = ({ onSelectSession }) => {
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = () => {
    setLoading(true);
    fetchHistory()
      .then(setSessions)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (sessionId: string) => {
    await deleteHistorySession(sessionId);
    loadHistory();
  };

  const filteredSessions = sessions.filter((s) =>
    s.question.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" /> Research History
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Access past investigations, inspect evidence records, or review synthesized reports.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search past sessions..."
            className="w-full bg-[#131B2E] border border-[#2A364F] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/80"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading history...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-300">No Past Sessions Recorded</h3>
          <p className="text-xs text-gray-500">Launch a new research investigation in the Workspace!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((s) => (
            <div
              key={s.session_id}
              className="bg-[#131B2E] border border-[#2A364F] hover:border-gray-600 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400">{s.session_id}</span>
                  <span className="text-[10px] text-gray-500">({s.created_at.slice(0, 10)})</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {s.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{s.question}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelectSession('Final Report', s.session_id)}
                  className="flex items-center gap-1.5 bg-[#090D16] hover:bg-slate-800 text-gray-200 border border-[#2A364F] text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Report</span>
                </button>

                <button
                  onClick={() => onSelectSession('Evidence Explorer', s.session_id)}
                  className="flex items-center gap-1.5 bg-[#090D16] hover:bg-slate-800 text-gray-200 border border-[#2A364F] text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Evidence</span>
                </button>

                <button
                  onClick={() => handleDelete(s.session_id)}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
