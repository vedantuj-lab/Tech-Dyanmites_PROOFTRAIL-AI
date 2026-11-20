import React, { useEffect, useState } from 'react';
import { Sliders, ShieldCheck, AlertTriangle, CheckCircle2, FileText, HelpCircle, Loader2 } from 'lucide-react';
import { fetchDecisionBrief, fetchHistory } from '../services/api';

interface DecisionBriefsProps {
  sessionId?: string | null;
}

export const DecisionBriefs: React.FC<DecisionBriefsProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [briefData, setBriefData] = useState<any>(null);
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
      fetchDecisionBrief(sessionId)
        .then(setBriefData)
        .catch(() => null)
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Synthesizing executive Decision Support Brief...</p>
      </div>
    );
  }

  const brief = briefData?.brief;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-amber-400" /> Decision Intelligence Brief
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Transform evidence-backed research reports into actionable strategic decision frameworks.
        </p>
      </div>

      {!brief ? (
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 text-center text-xs text-gray-500">
          No decision brief available for active session.
        </div>
      ) : (
        <>
          {/* Recommendation Banner */}
          <div className="bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Executive Recommendation
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Confidence: {brief.confidence_rating || 'HIGH'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{brief.recommendation}</h2>
          </div>

          {/* Decision Options Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Evaluated Decision Options ({brief.decision_options?.length || 0})
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {brief.decision_options?.map((opt: any, i: number) => (
                <div key={i} className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-5 space-y-3">
                  <div className="text-sm font-bold text-white">{opt.option_title}</div>
                  <p className="text-xs text-gray-300">{opt.description}</p>
                  <div className="p-3 bg-[#090D16] rounded-lg border border-[#2A364F] text-xs text-emerald-400">
                    <strong>Supporting Evidence:</strong> {opt.supporting_evidence_summary}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities & Key Assumptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Strategic Opportunities
              </h4>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {brief.opportunities?.map((op: string, i: number) => (
                  <li key={i}>{op}</li>
                ))}
              </ul>
            </div>

            <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Key Critical Assumptions
              </h4>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {brief.key_assumptions?.map((asm: string, i: number) => (
                  <li key={i}>{asm}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Conditions to Change Recommendation */}
          <div className="bg-[#131B2E] border border-amber-500/30 rounded-2xl p-6 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Conditions That Could Alter Recommendation
            </h4>
            <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
              {brief.conditions_to_change_recommendation?.map((cond: string, i: number) => (
                <li key={i}>{cond}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
