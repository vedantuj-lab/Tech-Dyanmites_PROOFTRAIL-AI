import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { fetchResearchClaims, fetchResearchSources, fetchHistory } from '../services/api';
import { Claim, EvidenceRecord, ConflictRecord, Source } from '../types';

interface EvidenceExplorerProps {
  sessionId?: string | null;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [conflicts, setConflicts] = useState<ConflictRecord[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
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
      Promise.all([
        fetchResearchClaims(sessionId),
        fetchResearchSources(sessionId),
      ])
        .then(([claimsData, sourcesData]) => {
          setClaims(claimsData.claims);
          setEvidence(claimsData.evidence_records);
          setConflicts(claimsData.conflicts);
          setSources(sourcesData);
          if (claimsData.claims.length > 0) {
            setSelectedClaim(claimsData.claims[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORTED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'PARTIALLY_SUPPORTED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CONFLICTING':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" /> Evidence Explorer
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Trace every extracted claim directly to verbatim web source passages and conflicting facts.
          </p>
        </div>

        {sessionId && (
          <div className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
            Session: {sessionId}
          </div>
        )}
      </div>

      {!sessionId || claims.length === 0 ? (
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-300">No Claims Available</h3>
          <p className="text-xs text-gray-500">Run an investigation in the Workspace first.</p>
        </div>
      ) : (
        /* Two-Panel Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel: Claims List */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Extracted Factual Claims ({claims.length})
            </h2>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {claims.map((c) => {
                const isSelected = selectedClaim?.claim_id === c.claim_id;
                return (
                  <div
                    key={c.claim_id}
                    onClick={() => setSelectedClaim(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-[#131B2E] border-[#2A364F] hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-gray-400">{c.claim_id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                          c.verification_status
                        )}`}
                      >
                        {c.verification_status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-white line-clamp-2">{c.claim_text}</p>

                    <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                      <span>Category: {c.claim_category}</span>
                      <span>Importance: {c.importance}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Claim & Evidence Passages */}
          <div className="lg:col-span-7 space-y-4">
            {selectedClaim ? (
              <>
                <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {selectedClaim.claim_id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getStatusBadge(
                        selectedClaim.verification_status
                      )}`}
                    >
                      {selectedClaim.verification_status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">
                    {selectedClaim.claim_text}
                  </h3>

                  <div className="text-xs text-gray-300 bg-[#090D16] border border-[#2A364F] p-3.5 rounded-xl">
                    <span className="font-bold text-amber-400">Verification Explanation:</span>{' '}
                    {selectedClaim.explanation || 'Directly verified from source content.'}
                  </div>
                </div>

                {/* Verbatim Supporting Evidence Passages */}
                <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Verbatim Source Evidence Passages
                  </h4>

                  {evidence.filter((e) => e.claim_id === selectedClaim.claim_id).length === 0 ? (
                    <div className="text-xs text-gray-500 italic p-4 bg-[#090D16] rounded-xl border border-[#2A364F]">
                      No direct verbatim passage mapped.
                    </div>
                  ) : (
                    evidence
                      .filter((e) => e.claim_id === selectedClaim.claim_id)
                      .map((ev) => {
                        const matchingSource = sources.find((s) => s.source_id === ev.source_id);
                        return (
                          <div
                            key={ev.evidence_id}
                            className="bg-[#090D16] border-l-4 border-l-emerald-500 border-t border-r border-b border-[#2A364F] rounded-xl p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-gray-300">
                                Source ID: <span className="text-amber-400">{ev.source_id}</span>
                              </span>
                              <span className="font-bold text-emerald-400">[{ev.relationship}]</span>
                            </div>

                            <p className="text-xs italic text-gray-200 leading-relaxed font-serif">
                              "{ev.exact_passage}"
                            </p>

                            <div className="text-[11px] text-gray-400 pt-1">
                              {ev.relevance_explanation}
                            </div>

                            {matchingSource && (
                              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px]">
                                <a
                                  href={matchingSource.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                                >
                                  <span>{matchingSource.title}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <span className="text-gray-500">{matchingSource.domain}</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>

                {/* Conflicting Evidence Comparison Card */}
                {conflicts.length > 0 && (
                  <div className="bg-[#131B2E] border border-red-500/30 rounded-2xl p-6 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Conflicting Evidence Comparison
                    </h4>

                    {conflicts.map((cnf) => (
                      <div key={cnf.conflict_id} className="space-y-2 text-xs">
                        <p className="text-gray-300">{cnf.explanation}</p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-3 bg-[#090D16] border border-[#2A364F] rounded-xl space-y-1">
                            <span className="text-[10px] font-bold text-amber-400">
                              Source A ({cnf.source_a_id})
                            </span>
                            <p className="italic text-gray-300 text-[11px]">"{cnf.passage_a}"</p>
                          </div>
                          <div className="p-3 bg-[#090D16] border border-[#2A364F] rounded-xl space-y-1">
                            <span className="text-[10px] font-bold text-amber-400">
                              Source B ({cnf.source_b_id})
                            </span>
                            <p className="italic text-gray-300 text-[11px]">"{cnf.passage_b}"</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center text-gray-500 text-xs">
                Select a claim from the left panel to inspect evidence.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
