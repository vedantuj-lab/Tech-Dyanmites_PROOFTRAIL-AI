import {
  SystemHealth,
  ResearchSession,
  ResearchReport,
  ResearchEvent,
  Source,
  Claim,
  EvidenceRecord,
  ConflictRecord,
} from '../types';

const API_BASE = '/api';

export async function fetchHealthStatus(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function startResearch(question: string, sessionId?: string): Promise<{ session_id: string; status: string; report_id: string }> {
  const res = await fetch(`${API_BASE}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, session_id: sessionId }),
  });
  if (!res.ok) throw new Error('Failed to start research investigation');
  return res.json();
}

export async function fetchResearchSession(sessionId: string): Promise<ResearchSession> {
  const res = await fetch(`${API_BASE}/research/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch research session');
  return res.json();
}

export async function fetchResearchEvents(sessionId: string): Promise<ResearchEvent[]> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/events`);
  if (!res.ok) throw new Error('Failed to fetch research events');
  return res.json();
}

export async function fetchResearchSources(sessionId: string): Promise<Source[]> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/sources`);
  if (!res.ok) throw new Error('Failed to fetch research sources');
  return res.json();
}

export async function fetchResearchClaims(sessionId: string): Promise<{ claims: Claim[]; evidence_records: EvidenceRecord[]; conflicts: ConflictRecord[] }> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/claims`);
  if (!res.ok) throw new Error('Failed to fetch research claims');
  return res.json();
}

export async function fetchResearchReport(sessionId: string): Promise<ResearchReport> {
  const res = await fetch(`${API_BASE}/research/${sessionId}/report`);
  if (!res.ok) throw new Error('Failed to fetch research report');
  return res.json();
}

export async function fetchHistory(): Promise<ResearchSession[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch research history');
  return res.json();
}

export async function deleteHistorySession(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/history/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete research session');
}

export function getPdfExportUrl(sessionId: string): string {
  return `${API_BASE}/research/${sessionId}/export/pdf`;
}
