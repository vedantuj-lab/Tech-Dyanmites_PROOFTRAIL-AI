# ProofTrail AI — The Evidence Intelligence Engine

> ODSC × Nebius Hackathon submission · Challenge: *Build a research agent that brings its sources*

**One-line pitch:** ProofTrail AI transforms research questions into structured, sourced, verifiable research reports using live web search, open-model AI reasoning, claim verification, and transparent citations.

- **Tagline:** *"Don't Just Trust the Answer. Trace the Evidence."*
- **Demo video (2–3 min):** [ProofTrail AI Walkthrough Video](https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI) *(Video link placeholder)*
- **Team:** Tech-Dynamites (`vedantuj-lab`)
- **Repository:** [https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI](https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI)

---

## The Problem

A standard LLM chatbot generates fluent answers, but researchers, market analysts, and decision-makers face critical pain points:
1. **Unverifiable Hallucinations:** Answers sound confident but lack traceable source passages.
2. **Hidden Contradictions:** Standard answers smooth over conflicting market data or policies without surfacing disagreement between sources.
3. **Broken or Fabricated Citations:** LLMs frequently invent citation links or cite sources that do not contain the claimed assertion.

ProofTrail AI solves this by prioritizing **evidence integrity over unverified text generation**. It extracts discrete factual claims, connects each claim to exact verbatim passages from live web sources, detects conflicting evidence, and runs deterministic code-level citation validation before generating the report.

---

## How It Works

```
Question → Research Plan → Multi-Round Tavily Search → Source Deduplication → Nebius Inference → Claim & Evidence Extraction → Conflict Detection → Deterministic Citation Validation → Structured Report & PDF Export
```

1. **Intelligent Research Planning:** Decomposes research questions into subquestions, geographical/temporal scope, and target search dimensions.
2. **Multi-Round Live Web Search:** Conducts controlled search stages (Discovery, Investigation, Verification) via Tavily.
3. **Source Management & Deduplication:** Normalizes URLs, strips tracking parameters (`utm_*`, `ref`, `fbclid`), and deduplicates canonical URLs.
4. **Evidence Intelligence Engine:** Extracts factual claims and maps verbatim, unedited supporting passages directly from source content.
5. **Conflict & Discrepancy Detection:** Surfacing opposing statistics, methodology differences, or policy timeline variations across sources.
6. **Deterministic Citation Validator:** Python code-level validator ensuring that every citation ID maps to a real source and that claims without verbatim evidence are flagged as `UNVERIFIED`.
7. **Multi-Interface & PDF Export:** Provides both a rich Streamlit workspace and a CLI tool, with ReportLab PDF export.

---

## Required Services

| Service / Requirement | Implementation Details |
|---|---|
| **Nebius Token Factory (Inference)** | Model: `MiniMaxAI/MiniMax-M3` (configurable via `NEBIUS_MODEL`) — Performs question decomposition, claim extraction, evidence interpretation, conflict analysis, and report synthesis. |
| **Tavily (Real-Time Web Search)** | Live multi-query web search adapter. Retains titles, canonical URLs, domains, snippets, publication dates, and raw text. |
| **SQLite Database** | Stores session state, raw queries, sources, verbatim passages, claims, evidence records, conflicts, trace logs, and reports. |
| **ReportLab** | Generates professional downloadable PDF reports with claim verification tables and reference indexes. |

---

## Setup & Installation

### 1. Prerequisites
- Python 3.11+
- Virtual environment tool (`venv`)

### 2. Quickstart

```bash
# Clone the repository
git clone https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI.git
cd Tech-Dyanmites_PROOFTRAIL-AI

# Create and activate a virtual environment
python -m venv .venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Install reproducible dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
```

Edit `.env` to add your API credentials:
```env
NEBIUS_API_KEY=your_nebius_api_key
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL=MiniMaxAI/MiniMax-M3
TAVILY_API_KEY=your_tavily_api_key
APP_ENV=development
DATABASE_PATH=data/prooftrail.db
MOCK_MODE=false
```

*Note: If API keys are omitted or `MOCK_MODE=true` is set, ProofTrail AI safely runs in local deterministic Mock Mode for offline evaluation and testing.*

---

## Usage Instructions

### 1. Command Line Interface (CLI)
Run a research investigation directly from your terminal:

```bash
python src/agent.py "Should a startup enter India's EV charging market in 2027?"
```

To automatically generate a PDF report:
```bash
python src/agent.py "Evaluate commercial viability of small modular nuclear reactors for datacenter power by 2030." --pdf
```

### 2. Streamlit Web Workspace
Launch the interactive 5-screen web application:

```bash
streamlit run app.py
```

Access the UI at `http://localhost:8501`.

The Streamlit interface provides:
- **Home:** Product overview, architecture, sample questions.
- **Workspace:** Real-time search configuration, API health check, live research trace log.
- **Evidence Explorer:** Interactive claim matrix, verbatim supporting passages, conflict analysis, source quality scores.
- **Final Report:** Executive summary, key findings, limitations, references, and PDF download.
- **Research History:** Past research sessions stored in SQLite with full reloading and deletion capabilities.

---

## Example Research Execution

**Question:** *"Should a startup enter India's EV charging market in 2027?"*

**Report Excerpt:**
> **Executive Summary:** Entering India's EV charging market in 2027 presents high strategic potential driven by a projected 32.5% CAGR through 2030 [SRC_001]. However, operators face high fixed demand charges per kVA from state electricity boards, stretching profitability payback to 4–5 years [SRC_003].

**Claim Verification Summary:**
- `[SUPPORTED]` Market projected to reach $4.1B by 2030 (32.5% CAGR). -> *Passage matched in [SRC_001]*
- `[SUPPORTED]` Ministry provides up to 70% capital subsidies for public fast chargers. -> *Passage matched in [SRC_002]*
- `[PARTIALLY_SUPPORTED]` High upfront grid connection fees pose margin risks. -> *Passage matched in [SRC_003]*

**Verified References:**
- `[SRC_001]` India EV Charging Infrastructure Market Size Report 2024–2030 (`grandviewresearch.com`)
- `[SRC_002]` NITI Aayog National EV Charging Infrastructure Guidelines (`niti.gov.in`)
- `[SRC_003]` Tata Power EZ Charge Operational Expansion Update (`tatapower.com`)

---

## Failure & Insufficient-Evidence Handling

If search returns no accessible results or Tavily API fails:
1. ProofTrail AI will not fabricate an answer or fake citations.
2. The orchestrator sets session status to `INSUFFICIENT_EVIDENCE`.
3. The report explicitly documents research limitations and missing dimensions.
4. If an LLM generates a citation reference to a nonexistent source ID (e.g. `[SRC_999]`), the deterministic validator flags the error and reclassifies unsupported claims to `UNVERIFIED`.

---

## Testing & Security Controls

Run the full automated test suite using Pytest:

```bash
pytest -v
```

Check Python syntax compilation:

```bash
python -m compileall src
```

### Security Measures:
- **Prompt Injection Defense:** Web content retrieved via Tavily is sanitized to remove prompt override attempts (e.g., `ignore previous instructions`).
- **Secret Protection:** API keys are loaded strictly from environment variables and never logged or exposed in UI state.

---

## Docker Instructions

Build and run ProofTrail AI using Docker:

```bash
# Build Docker image
docker build -t prooftrail-ai .

# Run Docker container
docker run -d -p 8501:8501 --env-file .env prooftrail-ai
```

---

## Judging Criteria Mapping

| Criterion | Weight | How ProofTrail AI Meets It & Where to Look |
|---|---|---|
| **Sourced and Verifiable Answers** | **30%** | Claims connected to verbatim source passages; deterministic citation validation (`src/services/citation_validator.py`, `src/services/evidence_engine.py`). |
| **Works End to End** | **25%** | Complete CLI (`src/agent.py`), Streamlit app (`app.py`), SQLite storage (`src/database/db.py`), and PDF export (`src/utils/pdf_export.py`). |
| **Usefulness** | **20%** | Solves LLM hallucinations and hidden conflicts for researchers, analysts, and founders. |
| **Agent Design** | **15%** | Decomposed planner, multi-stage researcher, evidence engine, conflict detector, quality assessor, synthesizer, and orchestrator (`src/agent_core/`). |
| **Use of Token Factory & Tavily** | **10%** | Nebius Token Factory inference (`src/services/nebius.py`) and Tavily web search (`src/services/tavily.py`). |

---

## License

MIT License. See [LICENSE](LICENSE) for details.
