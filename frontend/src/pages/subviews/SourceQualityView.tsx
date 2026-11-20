import React, { useEffect, useState } from 'react';
import { Award, Globe, ExternalLink, ShieldCheck } from 'lucide-react';
import { fetchResearchSources, fetchHistory } from '../../services/api';
import { Source } from '../../types';

interface SourceQualityViewProps {
  sessionId?: string | null;
}

export const SourceQualityView: React.FC<SourceQualityViewProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    if (!sessionId) {
      fetchHistory().then((h) => {
        if (h.length > 0) setSessionId(h[0].session_id);
      });
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchResearchSources(sessionId).then(setSources);
    }
  }, [sessionId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-lime-400" /> Source Quality & Lineage Analysis
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Evaluates authority, domain credibility, publication freshness, and evidence relevance.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((s) => (
          <div key={s.source_id} className="bg-[#18240B] border border-lime-500/30 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-lime-400">[{s.source_id}] {s.domain}</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-400 border border-lime-500/30">
                {s.quality_assessment}
              </span>
            </div>

            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-base font-bold text-white hover:text-lime-300 transition-colors flex items-center gap-2"
            >
              <span>{s.title}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="p-3 bg-[#0D1406] rounded-xl border border-lime-900/40 text-xs text-gray-200">
              {s.snippet}
            </div>

            <div className="text-xs text-lime-300/80 pt-1">
              <strong>Quality Evaluation:</strong> {s.quality_explanation || 'Verified web source.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
