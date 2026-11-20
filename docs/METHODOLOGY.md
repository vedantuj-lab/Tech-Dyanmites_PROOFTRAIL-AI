# ProofTrail AI — Evidence Research Methodology

"Don't Just Trust the Answer. Trace the Evidence."

ProofTrail AI enforces strict evidence integrity over conversational answer generation. This document describes the methodology used to plan research, collect sources, verify claims, detect conflicts, and validate citations.

---

## 1. Multi-Stage Research Planning

When a user submits a research question, the **Intelligent Research Planner** decomposes it along multiple dimensions:

1. **Objective Identification:** Establishes core analytical goals.
2. **Geographical & Temporal Scoping:** Clarifies target country/region and timeframe.
3. **Subquestion Generation:** Breaks the root question into 3–5 targeted subquestions.
4. **Dimension Allocation:** Groups subquestions into distinct research dimensions (e.g., Market Size, Policy & Subsidies, Competitive Landscape, Operational Risks).

---

## 2. Multi-Round Search & Deduplication

Web search is executed in up to 3 controlled rounds using **Tavily Live Web Search**:

- **Round 1 (Discovery):** Broad market queries to establish baseline landscape.
- **Round 2 (Investigation):** Targeted queries for specific policy numbers, regulatory gazettes, and company filings.
- **Round 3 (Verification):** Specialized queries focused on potential risk factors and conflicting figures.

**URL Canonicalization & Deduplication:**
- Query tracking parameters (`utm_source`, `utm_medium`, `fbclid`, `ref`, `gclid`) are stripped.
- Domain names are lowercased and URL fragments (`#anchors`) are dropped.
- Identical content under parameter variants is consolidated into a single source record (`SRC_001`, `SRC_002`).

---

## 3. Claim Extraction & Verbatim Passage Mapping

Rather than asking the LLM to write an ungrounded summary, the **Evidence Intelligence Engine** performs structured extraction:

- **Factual Claim Extraction:** Identifies verifiable factual statements.
- **Claim Categorization:** `FACTUAL`, `STATISTICAL`, `POLICY`, `PROJECTION`, `MARKET_DATA`, or `OPINION`.
- **Verbatim Passage Extraction:** Every claim must be linked to an exact, unedited passage from the retrieved source text.

---

## 4. Claim Verification Statuses

Claims are assigned one of four strict verification statuses:

- `SUPPORTED`: Backed by direct verbatim evidence passage from one or more credible sources.
- `PARTIALLY_SUPPORTED`: Supported in general concept, but specific figures or boundary conditions vary.
- `CONFLICTING`: Contradicted by another retrieved source.
- `UNVERIFIED`: Lacks direct supporting evidence passages.

---

## 5. Conflict & Discrepancy Detection

The **Conflict Detector** scans collected sources for opposing data points:

- **Statistical Discrepancies:** e.g., different projected charger requirements for 2027.
- **Methodology Differences:** e.g., total chargers vs. public fast chargers only.
- **Timeline Variations:** e.g., 2026 scheme expiry vs. 2028 extension.

Unresolved conflicts are explicitly highlighted in the final report and PDF export rather than hidden.

---

## 6. Deterministic Citation Validation

Before a report is presented to the user:

1. A deterministic Python script extracts all `SRC_xxx` references.
2. Verifies that every referenced ID matches a valid source in the current session.
3. Ensures claims marked as `SUPPORTED` possess mapped evidence records.
4. Reclassifies any unsupported claim to `UNVERIFIED` and attaches an integrity flag.
