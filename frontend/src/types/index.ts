export type UserRole = 'RESEARCHER' | 'REVIEWER' | 'ADMIN';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization?: string;
  created_at?: string;
  status?: string;
}

export type ResearchStatus =
  | 'PENDING'
  | 'PLANNING'
  | 'SEARCHING'
  | 'ANALYZING'
  | 'VERIFYING'
  | 'COMPLETED'
  | 'FAILED'
  | 'INSUFFICIENT_EVIDENCE';

export type ClaimCategory =
  | 'FACTUAL'
  | 'STATISTICAL'
  | 'POLICY'
  | 'PROJECTION'
  | 'OPINION'
  | 'MARKET_DATA';

export type VerificationStatus =
  | 'SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'CONFLICTING'
  | 'UNVERIFIED';

export type EvidenceRelationship = 'SUPPORTS' | 'CONTRADICTS' | 'CONTEXTUALISES';

export interface ResearchDimension {
  dimension_name: string;
  description: string;
  target_queries: string[];
}

export interface ResearchPlan {
  session_id: string;
  objective: string;
  geography?: string;
  time_period?: string;
  subject_scope: string;
  subquestions: string[];
  dimensions: ResearchDimension[];
  max_rounds: number;
  max_sources: number;
}

export interface ResearchSession {
  session_id: string;
  user_id?: string;
  question: string;
  created_at: string;
  status: ResearchStatus;
  plan?: ResearchPlan;
  report_id?: string;
}

export interface Source {
  source_id: string;
  session_id: string;
  url: string;
  canonical_url: string;
  title: string;
  domain: string;
  snippet: string;
  content: string;
  publication_date?: string;
  retrieved_at: string;
  search_round: number;
  search_query: string;
  quality_assessment: 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT_ASSESSED';
  quality_explanation?: string;
}

export interface Claim {
  claim_id: string;
  session_id: string;
  claim_text: string;
  claim_category: ClaimCategory;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  verification_status: VerificationStatus;
  explanation?: string;
}

export interface EvidenceRecord {
  evidence_id: string;
  claim_id: string;
  source_id: string;
  session_id: string;
  exact_passage: string;
  relationship: EvidenceRelationship;
  relevance_explanation: string;
  source_location?: string;
}

export interface ConflictRecord {
  conflict_id: string;
  session_id: string;
  claim_id?: string;
  source_a_id: string;
  source_b_id: string;
  passage_a: string;
  passage_b: string;
  conflict_type: string;
  explanation: string;
  resolved: boolean;
  resolution_note?: string;
}

export interface CitationValidationResult {
  is_valid: boolean;
  total_citations: number;
  valid_citations: number;
  missing_sources: string[];
  unsupported_claims: string[];
  invalid_citation_ids: string[];
  details: Record<string, any>;
}

export interface ResearchReport {
  report_id: string;
  session_id: string;
  question: string;
  created_at: string;
  executive_summary: string;
  research_scope: string;
  methodology: string;
  key_findings: string[];
  claim_verifications: Claim[];
  supporting_evidence: EvidenceRecord[];
  conflicting_information: ConflictRecord[];
  source_quality_assessment: Array<Record<string, any>>;
  research_gaps: string[];
  limitations: string[];
  conclusion: string;
  references: Source[];
  citation_validation: CitationValidationResult;
}

export interface ResearchEvent {
  event_id: string;
  session_id: string;
  timestamp: string;
  event_type: string;
  description: string;
  metadata: Record<string, any>;
}

export interface SystemHealth {
  status: string;
  app_env: string;
  mock_mode: boolean;
  version: string;
  nebius: { status: string; details: string; model?: string };
  tavily: { status: string; details: string };
  database: { status: string; path: string };
}

export interface ReviewAssignment {
  assignment_id: string;
  session_id: string;
  assigned_reviewer_id: string;
  assigned_by_admin_id: string;
  deadline?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'REVISION_REQUESTED' | 'REJECTED';
  created_at: string;
  question?: string;
  researcher_name?: string;
  reviewer_name?: string;
  admin_name?: string;
}

export interface ReviewComment {
  comment_id: string;
  assignment_id: string;
  reviewer_id: string;
  claim_id?: string;
  source_id?: string;
  comment_text: string;
  created_at: string;
}

export interface ReviewDecision {
  decision_id: string;
  assignment_id: string;
  reviewer_id: string;
  decision: 'APPROVED' | 'APPROVED_WITH_OBSERVATIONS' | 'REVISION_REQUIRED' | 'REJECTED';
  decision_note: string;
  created_at: string;
}

export interface AuditLog {
  log_id: string;
  actor_user_id?: string;
  action: string;
  target_resource: string;
  details: Record<string, any>;
  timestamp: string;
}
