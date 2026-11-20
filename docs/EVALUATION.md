# ProofTrail AI — Evaluation & Verification Suite

This document details the automated evaluation suite and testing methodologies used to verify ProofTrail AI.

---

## 1. Test Suite Summary

The test suite covers unit, service integration, database, and end-to-end pipeline components:

| Test Module | Coverage Area | Key Verification Assertions |
|---|---|---|
| `test_planner.py` | Research Planner | Subquestion decomposition, dimension creation, max round bounds |
| `test_search.py` | Tavily Web Search | Query execution, result schema validation, domain parsing |
| `test_source_manager.py` | Source Manager | Tracking param stripping, URL canonicalization, deduplication |
| `test_evidence.py` | Evidence Engine | Factual claim extraction, verbatim passage mapping |
| `test_verification.py` | Verification Statuses | Enums (`SUPPORTED`, `PARTIALLY_SUPPORTED`, `CONFLICTING`, `UNVERIFIED`) |
| `test_conflicts.py` | Conflict Detector | Discrepancy detection between contradictory sources |
| `test_citations.py` | Citation Integrity | Deterministic validation, invalid citation flagging, unsupported claim reclassification |
| `test_database.py` | SQLite Persistence | CRUD operations for sessions, events, sources, claims, and reports |
| `test_orchestrator.py` | Orchestrator Pipeline | Full end-to-end research flow execution and report generation |

---

## 2. Running Automated Tests

Run all unit and integration tests using pytest:

```bash
pytest -v
```

Run Python syntax compilation check:

```bash
python -m compileall src
```

---

## 3. Mandatory Safety & Integrity Invariants

1. **Fabricated Citation Rejection:** If an LLM generates a reference to a nonexistent source ID (e.g. `[SRC_999]`), the deterministic citation validator flags it and marks the report validation as failed.
2. **Unsupported Claim Reclassification:** Any claim marked as `SUPPORTED` without a mapped verbatim source passage is reclassified to `UNVERIFIED`.
3. **Prompt Injection Defense:** Web content containing instruction override triggers (e.g., `ignore previous instructions`) is filtered before prompt assembly.
