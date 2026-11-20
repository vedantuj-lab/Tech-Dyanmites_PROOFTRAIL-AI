# ProofTrail AI — System Architecture & Design Specification

"Don't Just Trust the Answer. Trace the Evidence."

ProofTrail AI is an open-model research agent designed to transform complex research questions into structured, sourced, and verifiable research reports. This document outlines the system architecture, component interactions, and data flow.

---

## 1. High-Level Architecture Overview

```
                      [ User Input / CLI / Streamlit ]
                                    |
                                    v
                       [ Research Orchestrator ]
                                    |
      +-----------------------------+-----------------------------+
      |                             |                             |
      v                             v                             v
[ Research Planner ]      [ Multi-Round Search ]       [ Source Manager ]
(Nebius Inference)        (Tavily Live Web Search)      (Deduplication & Canonicalization)
      |                             |                             |
      +-----------------------------+-----------------------------+
                                    |
                                    v
                     [ Evidence Intelligence Engine ]
               (Claim Extraction & Verbatim Passage Mapping)
                                    |
      +-----------------------------+-----------------------------+
      |                             |                             |
      v                             v                             v
[ Claim Verification ]      [ Conflict Detector ]     [ Source Quality Assessor ]
(Status Classification)     (Discrepancy Analysis)     (Authority & Freshness)
      |                             |                             |
      +-----------------------------+-----------------------------+
                                    |
                                    v
                      [ Deterministic Citation Validator ]
                         (Evidence Integrity Guardrail)
                                    |
                                    v
                      [ Final Report & PDF Generator ]
                             (SQLite Storage)
```

---

## 2. Core Modules & Responsibilities

### 2.1 Research Orchestrator (`src/agent_core/orchestrator.py`)
- Central pipeline engine controlling workflow transitions.
- Manages state persistence across `PLANNING`, `SEARCHING`, `ANALYZING`, `VERIFYING`, and `COMPLETED`.
- Emits real-time workflow trace events for both CLI and Streamlit interfaces.

### 2.2 Nebius Token Factory Adapter (`src/services/nebius.py`)
- Interfaces directly with Nebius Token Factory API (`MiniMaxAI/MiniMax-M3`).
- Handles structured JSON parsing, prompt injection isolation, exponential backoff retries, and fallback deterministic mock completions when offline.

### 2.3 Tavily Web Search Adapter (`src/services/tavily.py`)
- Executes multi-query web searches using Tavily Search API.
- Normalizes search metadata (title, URL, domain, snippet, raw content, publication date).

### 2.4 Source Manager (`src/services/source_manager.py`)
- Strips tracking parameters (`utm_*`, `ref`, `fbclid`, fragments `#anchor`).
- Lowercases domains and deduplicates sources by canonical URL.
- Assigns stable source identifiers (`SRC_001`, `SRC_002`).

### 2.5 Evidence Intelligence Engine (`src/services/evidence_engine.py`)
- Extracts discrete factual, statistical, policy, and market claims.
- Maps exact, verbatim supporting passages directly from raw retrieved source text.

### 2.6 Deterministic Citation Validator (`src/services/citation_validator.py`)
- Code-level validator verifying that every cited source ID `SRC_xxx` exists in the session's source manifest.
- Reclassifies unsupported claims to `UNVERIFIED` if no verbatim evidence passage exists.

### 2.7 Database Layer (`src/database/db.py`)
- SQLite database storing research sessions, plans, raw search queries, sources, passages, claims, evidence records, conflicts, trace events, and final reports.

---

## 3. Data Persistence Schema (SQLite)

- `research_sessions`
- `research_plans`
- `sources`
- `source_passages`
- `claims`
- `evidence_records`
- `conflicts`
- `research_events`
- `reports`

---

## 4. Security & Prompt Injection Defense

1. **Untrusted Web Content Isolation:** Webpage content retrieved via Tavily is treated as untrusted data. Prompt injection patterns (e.g. `ignore previous instructions`, `system prompt:`) are sanitized.
2. **Deterministic Validation:** LLM output is never trusted blindly for citations. The Python validator verifies citation references programmatically.
