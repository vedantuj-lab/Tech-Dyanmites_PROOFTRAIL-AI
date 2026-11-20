import {
  SystemHealth,
  ResearchSession,
  ResearchReport,
  ResearchEvent,
  Source,
  Claim,
  EvidenceRecord,
  ConflictRecord,
  User,
  ReviewAssignment,
  ReviewComment,
  ReviewDecision,
  AuditLog,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('prooftrail_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginApi(email: string, password: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function registerApi(
  email: string,
  password: string,
  full_name: string,
  organization?: string
): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, full_name, organization }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function fetchMeApi(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('Failed to fetch user session');
  return res.json();
}

export async function logoutApi(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
}

export async function fetchHealthStatus(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function startResearch(question: string, sessionId?: string): Promise<{ session_id: string; status: string; report_id: string }> {
  const res = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ question, session_id: sessionId }),
  });
  if (!res.ok) throw new Error('Failed to start research investigation');
  return res.json();
}

export async function fetchResearchSession(sessionId: string): Promise<ResearchSession> {
  const res = await fetch(`${API_BASE}/research/${sessionId}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research session');
  return res.json();
}

export async function fetchResearchEvents(sessionId: string): Promise<ResearchEvent[]> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/events`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research events');
  return res.json();
}

export async function fetchResearchSources(sessionId: string): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/sources`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research sources');
  return res.json();
}

export async function fetchResearchClaims(sessionId: string): Promise<{ claims: Claim[]; evidence_records: EvidenceRecord[]; conflicts: ConflictRecord[] }> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/claims`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research claims');
  return res.json();
}

export async function fetchResearchReport(sessionId: string): Promise<ResearchReport> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/report`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research report');
  return res.json();
}

export async function fetchHistory(): Promise<ResearchSession[]> {
  const res = await fetch(`${API_BASE}/history`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch research history');
  return res.json();
}

export async function deleteHistorySession(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${sessionId}`, { method: 'DELETE', headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to delete research session');
}

export function getPdfExportUrl(sessionId: string): string {
  return `${API_BASE}/research/${sessionId}/export/pdf`;
}

// --- IMPORTER & DOCUMENT INTELLIGENCE ---
export async function importWebsiteApi(sessionId: string, url: string): Promise<{ status: string; source: Source }> {
  const res = await fetch(`${API_BASE}/import/website`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ session_id: sessionId, url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Import failed' }));
    throw new Error(err.detail || 'Import failed');
  }
  return res.json();
}

export async function uploadDocumentApi(sessionId: string, file: File): Promise<{ status: string; source: Source }> {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function fetchDecisionBrief(sessionId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/decision-briefs/${sessionId}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch decision brief');
  return res.json();
}

export async function fetchEvidenceMap(sessionId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/evidence-map/${sessionId}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch evidence map');
  return res.json();
}

// --- REVIEWER API METHODS ---
export async function fetchReviewerDashboard(): Promise<any> {
  const res = await fetch(`${API_BASE}/reviewer/dashboard`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch reviewer dashboard');
  return res.json();
}

export async function fetchReviewerAssignments(): Promise<ReviewAssignment[]> {
  const res = await fetch(`${API_BASE}/reviewer/assignments`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch assignments');
  return res.json();
}

export async function fetchAssignmentDetail(assignmentId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/reviewer/assignments/${assignmentId}`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch assignment detail');
  return res.json();
}

export async function addReviewerComment(assignmentId: string, comment_text: string, claim_id?: string, source_id?: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reviewer/assignments/${assignmentId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ comment_text, claim_id, source_id }),
  });
  if (!res.ok) throw new Error('Failed to add comment');
}

export async function submitReviewerDecision(assignmentId: string, decision: string, decision_note: string): Promise<void> {
  const res = await fetch(`${API_BASE}/reviewer/assignments/${assignmentId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ decision, decision_note }),
  });
  if (!res.ok) throw new Error('Failed to submit review decision');
}

// --- ADMIN API METHODS ---
export async function fetchAdminDashboard(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/dashboard`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch admin dashboard');
  return res.json();
}

export async function fetchAdminUsers(roleFilter?: string): Promise<User[]> {
  const url = roleFilter ? `${API_BASE}/admin/users?role_filter=${roleFilter}` : `${API_BASE}/admin/users`;
  const res = await fetch(url, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function updateAdminUserStatus(userId: string, status: string, role?: string): Promise<User> {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ status, role }),
  });
  if (!res.ok) throw new Error('Failed to update user status');
  return res.json();
}

export async function fetchAdminAssignments(): Promise<ReviewAssignment[]> {
  const res = await fetch(`${API_BASE}/admin/assignments`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch all assignments');
  return res.json();
}

export async function createAdminAssignment(sessionId: string, reviewerId: string, deadlineDays: number = 7): Promise<ReviewAssignment> {
  const res = await fetch(`${API_BASE}/admin/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ session_id: sessionId, reviewer_id: reviewerId, deadline_days: deadlineDays }),
  });
  if (!res.ok) throw new Error('Failed to assign reviewer');
  return res.json();
}

export async function fetchAdminAuditLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, { headers: getAuthHeader() });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}
