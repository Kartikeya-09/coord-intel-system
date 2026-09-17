# Coordination Intelligence System (CIS)

The Coordination Intelligence System (CIS) is a web application for the architecture, interior design, and construction (AIC) industry. It acts as a coordination intelligence layer for multi-stakeholder projects, replacing manual, ad-hoc coordination (WhatsApp, email, spreadsheets) with a structured system that understands relationships between people, tasks, changes, and approvals.

---

## Project Structure

```
coord-intel-system/
├── backend/                  # Express.js REST API with MongoDB (Mongoose)
│   ├── models/               # Mongoose schemas (Stakeholder, Project, Activity, Approval, etc.)
│   ├── routes/               # REST API endpoints
│   ├── controllers/          # Endpoint request handlers
│   ├── services/             # Pure intelligence logic (impactAnalysis, dependencyService, etc.)
│   ├── scripts/              # Seed & utility scripts (seedDemo.js, clearDemo.js)
│   └── tests/                # Unit & integration tests
└── frontend/                 # Next.js frontend (Pages Router)
    ├── pages/                # Next.js pages (Dashboard, Stakeholders, Activities, Changes, etc.)
    ├── components/           # UI components (ImpactSummary, ReasoningChain, ActionCard, etc.)
    └── lib/                  # API client wrapper
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally at `mongodb://localhost:27017/cis` (or custom URI configured in `backend/.env`)

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The Express API server starts at `http://localhost:5000`. Test the health check endpoint at:
`http://localhost:5000/api/v1/health`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Next.js web application starts at `http://localhost:3000`.

---

## Running Tests

To execute unit and integration test suites:

```bash
cd backend
npm test
```

---

## Demo Seed Script & UI Walkthrough

We provide a standalone seed script to automatically populate the database with a complete demo scenario (residential fit-out project with 6 stakeholders, activities, approvals, dependencies, and a logged change event with BFS impact analysis).

### 1. Seed Demo Data

Make sure your MongoDB server is running, then execute:

```bash
node backend/scripts/seedDemo.js
```

To clear the database at any time:

```bash
node backend/scripts/clearDemo.js
```

### 2. End-to-End Walkthrough Steps

1. Open **`http://localhost:3000`** in your browser. It will automatically redirect to `/projects`.
2. Click on the seeded project: **"Patel Residence Fit-Out"**.
3. **Dashboard (`/projects/<id>`)**: View open actions, pending approvals, stakeholder counts, and recent project memory entries.
4. **Stakeholders (`/projects/<id>/stakeholders`)**: View the 6 project stakeholders and their assigned responsibility areas.
5. **Activities & Dependency Manager (`/projects/<id>/activities`)**: View activities, blocked flags, and dependency edges.
6. **Change Events (`/projects/<id>/changes`)**: Click **"View Impact Analysis"** on the seeded change event (*"Flooring material changed from engineered wood to Italian marble"*) to inspect the **Impact Traversal Summary** and step-by-step **Reasoning Chains**.
7. **Actions Board (`/projects/<id>/actions`)**: Inspect open auto-generated actions grouped by assigned stakeholder (Vendor, Contractor, Client).
8. **Approvals (`/projects/<id>/approvals`)**: Toggle approval statuses to see real-time downstream activity blocking & unblocking.
9. **Alerts Inbox (`/projects/<id>/alerts`)**: Select any stakeholder from the dropdown to see their personalized impact alert notifications.
10. **Project Memory (`/projects/<id>/memory`)**: Filter or keyword-search the immutable, append-only log of all project events.
