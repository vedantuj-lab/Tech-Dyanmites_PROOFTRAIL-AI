import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { fetchResearchReport, fetchHistory, getPdfExportUrl } from '../services/api';
import { ResearchReport } from '../types';

interface FinalReportProps {
  sessionId?: string | null;
}

export const FinalReport: React.FC<FinalReportProps> = ({ sessionId: initialSessionId }) => {
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      fetchResearchReport(sessionId)
        .then(setReport)
        .catch((err) => setError(err.message || 'Report not found.'))
        .finally(() => setLoading(false));
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-400">Loading synthesized research report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center bg-[#131B2E] border border-[#2A364F] rounded-2xl p-12 space-y-3">
        <FileText className="w-10 h-10 text-gray-500 mx-auto" />
        <h3 className="text-base font-bold text-gray-300">No Report Generated Yet</h3>
        <p className="text-xs text-gray-500">
          Run a research investigation in the Workspace to generate a report.
        </p>
      </div>
    );
  }

  const cv = report.citation_validation;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Top Bar with Citation Validation & PDF Download */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131B2E] border border-[#2A364F] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              cv?.is_valid ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Citation Integrity Check:</span>
              <span className={cv?.is_valid ? 'text-emerald-400' : 'text-amber-400'}>
                {cv?.is_valid ? 'PASSED' : 'FLAGS DETECTED'}
              </span>
            </div>
            <div className="text-[11px] text-gray-400">
              {cv?.valid_citations}/{cv?.total_citations} Verified Source References
            </div>
          </div>
        </div>

        <a
          href={getPdfExportUrl(report.session_id)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          <span>Download Professional PDF</span>
        </a>
      </div>

      {/* Main Editorial Article Header */}
      <div className="bg-[#131B2E] border-l-4 border-l-amber-500 border-t border-r border-b border-[#2A364F] rounded-2xl p-8 space-y-3">
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Evidence-Backed Research Report
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          {report.question}
        </h1>
        <div className="text-xs text-gray-400 pt-2 flex items-center gap-4 border-t border-gray-800">
          <span>
            Session ID: <strong className="text-gray-200">{report.session_id}</strong>
          </span>
          <span>
            Generated: <strong className="text-gray-200">{report.created_at.slice(0, 10)}</strong>
          </span>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> 1. Executive Summary
        </h2>
        <p className="text-sm text-gray-200 leading-relaxed font-normal">{report.executive_summary}</p>
      </div>

      {/* 2. Scope & Methodology */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
          2. Scope & Methodology
        </h2>
        <div className="space-y-2 text-xs text-gray-300">
          <p>
            <strong className="text-white">Research Scope:</strong> {report.research_scope}
          </p>
          <p>
            <strong className="text-white">Methodology:</strong> {report.methodology}
          </p>
        </div>
      </div>

      {/* 3. Key Findings */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">3. Key Findings</h2>
        <div className="space-y-3">
          {report.key_findings.map((finding, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="font-extrabold text-amber-400 text-sm">{i + 1}.</span>
              <p className="text-xs text-gray-200 leading-relaxed">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Claim Verification Summary */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
          4. Claim Verification Summary
        </h2>
        <div className="space-y-2">
          {report.claim_verifications.map((c) => (
            <div
              key={c.claim_id}
              className="flex items-center justify-between p-3 bg-[#090D16] border border-[#2A364F] rounded-xl text-xs"
            >
              <span className="text-gray-200 font-medium">{c.claim_text}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                  c.verification_status === 'SUPPORTED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {c.verification_status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5 & 6. Gaps & Limitations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            5. Identified Research Gaps
          </h3>
          <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
            {report.research_gaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>

        <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-6 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            6. Methodological Limitations
          </h3>
          <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
            {report.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Conclusion */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-3">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">7. Conclusion</h2>
        <p className="text-xs text-gray-200 leading-relaxed">{report.conclusion}</p>
      </div>

      {/* 8. References Index */}
      <div className="bg-[#131B2E] border border-[#2A364F] rounded-2xl p-8 space-y-4">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
          8. Verified References Index
        </h2>
        <div className="space-y-2">
          {report.references.map((ref) => (
            <div
              key={ref.source_id}
              className="flex items-center justify-between p-3 bg-[#090D16] border border-[#2A364F] rounded-xl text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">[{ref.source_id}]</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>{ref.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-500 text-[10px]">({ref.domain})</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">{ref.quality_assessment}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
