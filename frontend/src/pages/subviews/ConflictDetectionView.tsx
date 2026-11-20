import React, { useEffect, useState } from 'react';
import { AlertTriangle, Shield, CheckCircle2, HelpCircle } from 'lucide-react';
import { fetchResearchClaims, fetchHistory } from '../../services/api';
import { ConflictRecord } from '../../types';

interface ConflictDetectionViewProps {
  sessionId?: string | null;
}

export const ConflictDetectionView: React.FC<ConflictDetectionViewProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);

  useEffect(() => {
    if (!sessionId) {
      fetchHistory().then((h) => {
        if (h.length > 0) setSessionId(h[0].session_id);
      });
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchResearchClaims(sessionId).then((data) => {
        setConflicts(data.conflicts);
      });
    }
  }, [sessionId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-rose-400" /> Conflict & Discrepancy Detector
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Identifies opposing statistics, timeline discrepancies, and methodology variations across web sources.
        </p>
      </div>

      {conflicts.length === 0 ? (
        <div className="bg-[#290E14] border border-rose-500/30 rounded-2xl p-12 text-center text-xs text-rose-300">
          ✓ No direct statistical contradictions detected across retrieved sources.
        </div>
      ) : (
        <div className="space-y-4">
          {conflicts.map((conf) => (
            <div key={conf.conflict_id} className="bg-[#290E14] border border-rose-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  ⚠️ {conf.conflict_type}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {conf.source_a_id} vs {conf.source_b_id}
                </span>
              </div>

              <p className="text-sm font-semibold text-white">{conf.explanation}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#18080C] border border-rose-900/40 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-rose-400">Source A ({conf.source_a_id})</div>
                  <p className="italic text-xs text-gray-200">"{conf.passage_a}"</p>
                </div>
                <div className="p-4 bg-[#18080C] border border-rose-900/40 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-rose-400">Source B ({conf.source_b_id})</div>
                  <p className="italic text-xs text-gray-200">"{conf.passage_b}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
