import React, { useEffect, useState } from 'react';
import { Network, ShieldCheck, FileText, Globe, Loader2, HelpCircle } from 'lucide-react';
import { fetchEvidenceMap, fetchHistory } from '../services/api';

interface EvidenceMapProps {
  sessionId?: string | null;
}

export const EvidenceMap: React.FC<EvidenceMapProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      fetchHistory().then((history) => {
        if (history.length > 0) {
          setSessionId(history[0].session_id);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      fetchEvidenceMap(sessionId)
        .then(setMapData)
        .catch(() => null)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Rendering visual evidence lineage map...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Network className="w-6 h-6 text-amber-400" /> Interactive Evidence Map
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Visual lineage hierarchy connecting research questions to claims and verbatim web/document evidence.
        </p>
      </div>

      {!mapData ? (
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center text-xs text-gray-500">
          No evidence map available.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Root Node Question */}
          <div className="bg-gradient-to-r from-amber-600/30 to-amber-500/10 border border-amber-500/50 rounded-2xl p-6 shadow-xl">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Root Question Node
            </span>
            <h2 className="text-lg font-bold text-white mt-1">{mapData.question}</h2>
          </div>

          {/* Claims Lineage Nodes */}
          <div className="space-y-4 pl-4 border-l-2 border-amber-500/30">
            {mapData.claims?.map((c: any, i: number) => (
              <div key={i} className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Claim [{c.claim_id}]</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {c.verification_status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">{c.claim_text}</div>

                {/* Evidence Passage Leaves */}
                <div className="space-y-2 pt-2 pl-4 border-l border-gray-700">
                  {c.evidence_passages?.map((ev: any, j: number) => (
                    <div key={j} className="bg-[#090D16] p-3 rounded-lg border border-[#2A364F] text-xs space-y-1">
                      <div className="text-[10px] text-gray-400">
                        Mapped Source: <strong className="text-amber-400">{ev.source_id}</strong>
                      </div>
                      <div className="italic text-gray-200 text-[11px]">"{ev.passage}"</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
