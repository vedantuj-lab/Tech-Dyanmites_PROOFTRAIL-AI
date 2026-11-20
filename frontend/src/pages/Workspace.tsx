import React, { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  ShieldCheck,
  Globe,
  ArrowRight,
  ListFilter,
} from 'lucide-react';
import {
  startResearch,
  fetchResearchSession,
  fetchResearchSources,
  fetchResearchClaims,
  fetchResearchEvents,
  fetchResearchReport,
} from '../services/api';
import {
  ResearchSession,
  Source,
  Claim,
  ResearchEvent,
  ResearchReport,
} from '../types';

interface WorkspaceProps {
  initialQuestion?: string;
  onNavigateTab: (tab: string, sessionId?: string) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ initialQuestion, onNavigateTab }) => {
  const [question, setQuestion] = useState(initialQuestion || 'Should a startup enter India\'s EV charging market in 2027?');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ResearchSession | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [events, setEvents] = useState<ResearchEvent[]>([]);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartInvestigation = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await startResearch(q);
      setSessionId(res.session_id);

      // Fetch data for completed session
      const sessData = await fetchResearchSession(res.session_id);
      const sourcesData = await fetchResearchSources(res.session_id);
      const claimsData = await fetchResearchClaims(res.session_id);
      const eventsData = await fetchResearchEvents(res.session_id);
      const reportData = await fetchResearchReport(res.session_id);

      setSession(sessData);
      setSources(sourcesData);
      setClaims(claimsData.claims);
      setEvents(eventsData);
      setReport(reportData);
    } catch (err: any) {
      setError(err.message || 'Investigation pipeline failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuestion && !sessionId && !loading) {
      handleStartInvestigation(initialQuestion);
    }
  }, [initialQuestion]);

  const pipelineSteps = [
    { num: 1, label: 'Question Decomposition & Research Plan', status: session ? 'COMPLETED' : 'PENDING' },
    { num: 2, label: 'Multi-Stage Tavily Live Web Query Execution', status: session ? 'COMPLETED' : 'PENDING' },
    { num: 3, label: 'Source Quality & Domain Authority Assessment', status: session ? 'COMPLETED' : 'PENDING' },
    { num: 4, label: 'Verbatim Evidence Passage Extraction', status: session ? 'COMPLETED' : 'PENDING' },
    { num: 5, label: 'Statistical Discrepancy & Conflict Analysis', status: session ? 'COMPLETED' : 'PENDING' },
    { num: 6, label: 'Report Synthesis & Citation Validation', status: session ? 'COMPLETED' : 'PENDING' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Search Input Bar */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Search className="w-4 h-4" /> Research Input Bar
          </h2>
          {sessionId && <span className="text-xs font-mono text-gray-400">Session: {sessionId}</span>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter research question..."
            className="flex-1 bg-[#090D16] border border-[#2A364F] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/80"
          />
          <button
            onClick={() => handleStartInvestigation(question)}
            disabled={loading || !question.trim()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-sm px-6 py-3 rounded-xl disabled:opacity-50 transition-all shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Investigating...' : 'Start Pipeline'}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Metrics Header if Session Active */}
      {session && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Session Status</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{session.status}</div>
          </div>
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sources Retained</div>
            <div className="text-xl font-extrabold text-amber-400 mt-1">{sources.length}</div>
          </div>
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Claims Mapped</div>
            <div className="text-xl font-extrabold text-blue-400 mt-1">{claims.length}</div>
          </div>
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Citation Integrity</div>
            <div
              className={`text-xl font-extrabold mt-1 ${
                report?.citation_validation?.is_valid ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {report?.citation_validation?.is_valid ? 'PASSED' : 'FLAGS'}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Execution Progress */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-amber-400" /> Pipeline Execution Progress
        </h3>

        <div className="space-y-2">
          {pipelineSteps.map((step) => {
            const isDone = step.status === 'COMPLETED';
            return (
              <div
                key={step.num}
                className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-[#2A364F]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </div>
                  <span className="text-xs font-semibold text-gray-200">{step.label}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isDone
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {isDone ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan & Sources Grid */}
      {session && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Research Plan Breakdown */}
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4" /> Research Plan Breakdown
            </h3>
            {session.plan ? (
              <div className="space-y-3 text-xs text-gray-300">
                <div>
                  <span className="font-bold text-white">Objective:</span> {session.plan.objective}
                </div>
                <div>
                  <span className="font-bold text-white">Scope:</span> {session.plan.subject_scope} (
                  {session.plan.geography})
                </div>
                <div>
                  <span className="font-bold text-white">Subquestions:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
                    {session.plan.subquestions.map((sq, i) => (
                      <li key={i}>{sq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Plan initialized...</span>
            )}
          </div>

          {/* Retained Sources Preview */}
          <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" /> Retained Web Sources ({sources.length})
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {sources.map((s) => (
                <div key={s.source_id} className="p-3 bg-[#090D16] border border-[#2A364F] rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400">[{s.source_id}]</span>
                    <span className="text-[10px] font-bold text-emerald-400">{s.quality_assessment}</span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-white hover:text-amber-400 transition-colors line-clamp-1"
                  >
                    {s.title}
                  </a>
                  <div className="text-[10px] text-gray-500">{s.domain}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation trigger button if report ready */}
      {report && (
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onNavigateTab('Final Report', session?.session_id)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            <span>View Synthesized Report & PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
