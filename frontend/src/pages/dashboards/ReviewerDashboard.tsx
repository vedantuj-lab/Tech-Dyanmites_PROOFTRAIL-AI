import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  User,
  ArrowRight,
  Send,
  History,
} from 'lucide-react';
import {
  fetchReviewerDashboard,
  fetchAssignmentDetail,
  addReviewerComment,
  submitReviewerDecision,
} from '../../services/api';
import { ReviewAssignment, Claim, Source, ResearchReport } from '../../types';
import { ClaimVerificationView } from '../subviews/ClaimVerificationView';
import { Settings } from '../Settings';

interface ReviewerDashboardProps {
  currentSubTab: string;
}

export const ReviewerDashboard: React.FC<ReviewerDashboardProps> = ({ currentSubTab }) => {
  const [data, setData] = useState<any>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = () => {
    setLoading(true);
    fetchReviewerDashboard()
      .then((res) => {
        setData(res);
        if (res.assignments.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(res.assignments[0].assignment_id);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (selectedAssignmentId) {
      fetchAssignmentDetail(selectedAssignmentId).then(setDetail);
    }
  }, [selectedAssignmentId]);

  const handleAddComment = async () => {
    if (!selectedAssignmentId || !commentText.trim()) return;
    await addReviewerComment(selectedAssignmentId, commentText);
    setCommentText('');
    fetchAssignmentDetail(selectedAssignmentId).then(setDetail);
  };

  const handleSubmitDecision = async (decision: string) => {
    if (!selectedAssignmentId || !decisionNote.trim()) return;
    await submitReviewerDecision(selectedAssignmentId, decision, decisionNote);
    setDecisionNote('');
    loadDashboard();
    fetchAssignmentDetail(selectedAssignmentId).then(setDetail);
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400 font-mono">Loading Reviewer Workspace...</div>;
  }

  // --- SUB-VIEW ROUTER FOR REVIEWER ROLE ---
  if (currentSubTab === 'Evidence Validation') {
    return <ClaimVerificationView sessionId={detail?.session?.session_id} />;
  }

  if (currentSubTab === 'Settings') {
    return <Settings />;
  }

  if (currentSubTab === 'Review History') {
    return (
      <div className="max-w-6xl mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-pink-400" /> Review Decisions &amp; Audit Log
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Historical log of all peer-review decisions, observations, and revision requests issued by you.
          </p>
        </div>

        <div className="bg-[#290E20] border border-pink-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="text-xs font-bold text-pink-400 uppercase tracking-wider">Completed Review Log</div>
          {data?.assignments.filter((a: any) => a.status === 'COMPLETED').length === 0 ? (
            <div className="text-xs text-gray-400 italic py-4">No completed review decisions logged yet.</div>
          ) : (
            data?.assignments.map((asn: any) => (
              <div key={asn.assignment_id} className="p-4 bg-[#180813] border border-pink-900/40 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>[{asn.assignment_id}] {asn.question}</span>
                  <span className="text-emerald-400">{asn.status}</span>
                </div>
                <div className="text-[10px] text-gray-400">Researcher: {asn.researcher_name || 'System'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Default Reviewer Views: 'Assigned Overview' or 'Assigned Reviews'
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#290E20] border border-pink-500/30 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Assigned Reviews</div>
          <div className="text-2xl font-extrabold text-pink-400 mt-1">{data?.metrics?.assigned_reviews || 0}</div>
        </div>
        <div className="bg-[#290E20] border border-pink-500/30 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Pending Reviews</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{data?.metrics?.pending_reviews || 0}</div>
        </div>
        <div className="bg-[#290E20] border border-pink-500/30 rounded-xl p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">Completed Reviews</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{data?.metrics?.completed_reviews || 0}</div>
        </div>
      </div>

      {/* Main Reviewer Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Assignments */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">Assigned Reports</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {data?.assignments.length === 0 ? (
              <div className="p-6 bg-[#290E20] rounded-xl text-center text-xs text-pink-300 border border-pink-500/30">
                No review assignments assigned yet.
              </div>
            ) : (
              data?.assignments.map((asn: ReviewAssignment) => {
                const isSelected = selectedAssignmentId === asn.assignment_id;
                return (
                  <div
                    key={asn.assignment_id}
                    onClick={() => setSelectedAssignmentId(asn.assignment_id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-pink-500/20 border-pink-400 shadow-md'
                        : 'bg-[#290E20] border-pink-500/30 hover:border-pink-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-pink-300">{asn.assignment_id}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {asn.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-2">{asn.question}</div>
                    <div className="text-[10px] text-gray-300 mt-2 flex items-center justify-between">
                      <span>Researcher: {asn.researcher_name || 'System'}</span>
                      <span>Deadline: {asn.deadline?.slice(0, 10)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {detail ? (
            <>
              {/* Assignment Overview */}
              <div className="bg-[#290E20] border border-pink-500/30 rounded-2xl p-6 space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-pink-400 font-bold">SESSION: {detail.session?.session_id}</span>
                  <span className="text-emerald-400 font-bold">STATUS: {detail.assignment?.status}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{detail.session?.question}</h2>
                {detail.report && (
                  <div className="text-xs text-gray-200 bg-[#180813] p-4 rounded-xl border border-pink-900/50">
                    <span className="font-bold text-pink-400">Executive Summary:</span> {detail.report.executive_summary}
                  </div>
                )}
              </div>

              {/* Claims & Evidence Review */}
              <div className="bg-[#290E20] border border-pink-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Evidence &amp; Claim Evaluation
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {detail.claims.map((c: Claim) => (
                    <div key={c.claim_id} className="p-3 bg-[#180813] border border-pink-900/50 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-gray-200">
                        <span>[{c.claim_category}] {c.claim_text}</span>
                        <span className="text-emerald-400">{c.verification_status}</span>
                      </div>
                      <div className="text-gray-300 text-[11px]">{c.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Annotation Comments */}
              <div className="bg-[#290E20] border border-pink-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Reviewer Annotations &amp; Feedback
                </h3>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {detail.comments.map((cmt: any) => (
                    <div key={cmt.comment_id} className="p-3 bg-[#180813] border border-pink-900/50 rounded-xl text-xs space-y-1">
                      <div className="text-[10px] text-pink-300">{cmt.created_at.slice(0, 10)}</div>
                      <div className="text-gray-200">{cmt.comment_text}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add evaluation comment..."
                    className="flex-1 bg-[#180813] border border-pink-900/50 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-pink-400"
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              {/* Review Decision Controls */}
              <div className="bg-[#290E20] border border-pink-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                  Issue Review Decision
                </h3>

                <textarea
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Provide detailed decision justification..."
                  rows={2}
                  className="w-full bg-[#180813] border border-pink-900/50 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-400"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => handleSubmitDecision('APPROVED')}
                    className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition-all"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleSubmitDecision('APPROVED_WITH_OBSERVATIONS')}
                    className="py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs rounded-xl transition-all"
                  >
                    Approve (Obs)
                  </button>
                  <button
                    onClick={() => handleSubmitDecision('REVISION_REQUIRED')}
                    className="py-2.5 px-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={() => handleSubmitDecision('REJECTED')}
                    className="py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 bg-[#290E20] border border-pink-500/30 rounded-2xl text-center text-xs text-pink-300">
              Select an assignment from the left list to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
