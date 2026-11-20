import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import { fetchResearchClaims, fetchHistory } from '../../services/api';
import { Claim, EvidenceRecord, VerificationStatus } from '../../types';

interface ClaimVerificationViewProps {
  sessionId?: string | null;
}

export const ClaimVerificationView: React.FC<ClaimVerificationViewProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

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
        setClaims(data.claims);
        setEvidence(data.evidence_records);
      });
    }
  }, [sessionId]);

  const filteredClaims = claims.filter(
    (c) => filterStatus === 'ALL' || c.verification_status === filterStatus
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" /> Claim Verification Matrix
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Categorized factual claims evaluated against verbatim source evidence passages.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex gap-2">
          {['ALL', 'SUPPORTED', 'PARTIALLY_SUPPORTED', 'CONFLICTING', 'UNVERIFIED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                filterStatus === st
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-[#131B2E] text-gray-400 border-[#2A364F] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredClaims.map((c) => {
          const matchingEv = evidence.filter((e) => e.claim_id === c.claim_id);
          const badgeColor =
            c.verification_status === 'SUPPORTED'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : c.verification_status === 'PARTIALLY_SUPPORTED'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : c.verification_status === 'CONFLICTING'
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-gray-800 text-gray-400 border-gray-700';

          return (
            <div key={c.claim_id} className="bg-[#0A1F18] border border-emerald-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">[{c.claim_id}] {c.claim_category}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${badgeColor}`}>
                  {c.verification_status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{c.claim_text}</h3>
              <p className="text-xs text-gray-300 bg-[#061510] p-3 rounded-xl border border-emerald-900/40">
                <strong className="text-emerald-400">Reason:</strong> {c.explanation}
              </p>

              {matchingEv.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Verbatim Evidence:</div>
                  {matchingEv.map((ev) => (
                    <div key={ev.evidence_id} className="p-3 bg-[#061510] border-l-4 border-l-emerald-400 rounded-lg text-xs text-gray-200 italic">
                      "{ev.exact_passage}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
