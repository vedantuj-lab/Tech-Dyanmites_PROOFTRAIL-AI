# ProofTrail AI — The Evidence Intelligence Engine

> ODSC × Nebius Hackathon Submission · Challenge: *Build a research agent that brings its sources*

**One-line pitch:** ProofTrail AI transforms research questions into structured, sourced, verifiable research reports and decision briefs using live web search, open-model AI reasoning, claim verification, source-quality analysis, website importing, document intelligence, and transparent citations.

- **Tagline:** *"Don't Just Trust the Answer. Trace the Evidence."*
- **Repository:** [https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI](https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI)
- **Latest Commit:** `c7593be`
- **Live Server URL:** [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🌟 What's New in ProofTrail AI v1.0 Enterprise Platform

1. **Multi-Role RBAC & Workspaces**:
   - **Researcher Workspace:** Multi-stage web investigations, research planning, claim matrix, conflict detector, decision briefs, PDF report exporter, website importer, document intelligence library, watchlist, collections.
   - **Analyst / Reviewer Workspace:** Peer-review editor workspace, evidence annotation, version comparison, and decision submission (`Approved`, `Approved with Observations`, `Revision Required`, `Rejected`).
   - **Administrator Control Hub:** User management directory, role permissions, reviewer workload assignments, platform analytics, security audit logs.
2. **Real-World High-Resolution Professional Photography**:
   - 13 high-resolution photographs stored locally in `frontend/public/images/` covering multi-monitor research analyst setups, document archives, SOC security centers, and modern office split-screen login.
3. **21 Feature-Specific Color Identities**:
   - Distinct, synchronized feature theme palettes (`theme.ts`) that update sidebar active states, header bars, background gradients, card borders, buttons, and status badges.
4. **1-Click Role Demo Login System**:
   - **Aarav Mehta** (`researcher@prooftrail.demo` / `Research@123` - Researcher)
   - **Ananya Sharma** (`reviewer@prooftrail.demo` / `Review@123` - Analyst/Reviewer)
   - **Rohan Kapoor** (`admin@prooftrail.demo` / `Admin@123` - Administrator)
5. **Database Migration Safeguard & Seeder**:
   - Automated SQLite column migration safeguard (`ALTER TABLE research_sessions ADD COLUMN user_id TEXT;`) and idempotent database seeder (`scripts/seed_demo.py`).

---

## The Problem

A standard LLM chatbot generates fluent answers, but researchers, market analysts, and decision-makers face critical pain points:
1. **Unverifiable Hallucinations:** Answers sound confident but lack traceable source passages.
2. **Hidden Contradictions:** Standard answers smooth over conflicting market data or policies without surfacing disagreement between sources.
3. **Broken or Fabricated Citations:** LLMs frequently invent citation links or cite sources that do not contain the claimed assertion.

ProofTrail AI solves this by prioritizing **evidence integrity over unverified text generation**. It extracts discrete factual claims, connects each claim to exact verbatim passages from live web sources, detects conflicting evidence, and runs deterministic code-level citation validation before generating the report.

---

## Architecture Diagram

```
Question / URL / Document → Research Planner → Multi-Round Tavily Search → Source Deduplication → Nebius Inference → Claim & Evidence Extraction → Conflict Detection → Deterministic Citation Validation → Decision Brief & PDF Export
```

---

## 21 Synchronized Feature Color Palettes

| Feature / Workspace Module | Feature Theme Palette | Sidebar Active State | Background Image Direction |
|---|---|---|---|
| **Overview / Home** | Royal Blue & Gold (`#3B82F6` / `#F59E0B`) | `bg-blue-500/20 text-blue-400 border-blue-500/50` | Abstract evidence network & intelligence |
| **Research Workspace** | Deep Teal & Sea Green (`#10B981` / `#34D399`) | `bg-emerald-500/20 text-emerald-400 border-emerald-500/50` | Digital research & multi-screen workspace |
| **Website Importer** | Burnt Orange & Terracotta (`#EA580C` / `#F97316`) | `bg-orange-500/20 text-orange-400 border-orange-500/50` | Digital web connections & data extraction |
| **Document Library** | Royal Violet & Lavender (`#8B5CF6` / `#A78BFA`) | `bg-violet-500/20 text-violet-400 border-violet-500/50` | Organized digital documents & archives |
| **Evidence Explorer** | Jade Green & Mint (`#34D399` / `#6EE7B7`) | `bg-emerald-400/20 text-emerald-300 border-emerald-400/50` | Connected evidence nodes & documents |
| **Evidence Map** | Coral & Warm Pink (`#F43F5E` / `#FB7185`) | `bg-rose-500/20 text-rose-400 border-rose-500/50` | Network graphs & visual mapping |
| **Conflict Detection** | Burgundy & Crimson (`#E11D48` / `#F43F5E`) | `bg-rose-600/20 text-rose-400 border-rose-600/50` | Analytical comparison & contradiction panels |
| **Source Quality** | Olive Green & Gold (`#84CC16` / `#A3E635`) | `bg-lime-500/20 text-lime-400 border-lime-500/50` | Research papers & domain evaluation |
| **Decision Intelligence** | Deep Burgundy & Champagne (`#D97706` / `#F59E0B`)| `bg-amber-600/20 text-amber-400 border-amber-600/50` | Executive strategy & decision analysis |
| **Assigned Reviews (Reviewer)**| Dark Plum & Soft Rose (`#EC4899` / `#F472B6`) | `bg-pink-500/20 text-pink-400 border-pink-500/50` | Professional peer-review environment |
| **User Management (Admin)** | Sky Blue & Copper (`#38BDF8` / `#0284C7`) | `bg-sky-500/20 text-sky-400 border-sky-500/50` | Team & account management |
| **Audit Logs (Admin)** | Dark Charcoal & Crimson (`#F87171` / `#EF4444`)| `bg-red-500/20 text-red-400 border-red-500/50` | Security event tracking & audit trails |

---

## Setup & Installation

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ and `npm`

### 2. Quickstart

```bash
# Clone the repository
git clone https://github.com/vedantuj-lab/Tech-Dyanmites_PROOFTRAIL-AI.git
cd Tech-Dyanmites_PROOFTRAIL-AI

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env

# Seed Demo Database & Accounts
python scripts/seed_demo.py

# Build React Frontend
cd frontend
npm install
npm run build
cd ..

# Launch FastAPI Web Server
python -m uvicorn src.api:app --host 0.0.0.0 --port 8000
```

Open **`http://127.0.0.1:8000`** in your browser.

---

## Demo Accounts (1-Click Sign-In)

- **Researcher Account:** `researcher@prooftrail.demo` / `Research@123` (Name: *Aarav Mehta*)
- **Analyst / Reviewer Account:** `reviewer@prooftrail.demo` / `Review@123` (Name: *Ananya Sharma*)
- **Administrator Account:** `admin@prooftrail.demo` / `Admin@123` (Name: *Rohan Kapoor*)

---

## Testing & Security Controls

Run the full automated test suite using Pytest:

```bash
python -m pytest -v
```

Build Vite TypeScript production bundle:

```bash
cd frontend && npm run build
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
