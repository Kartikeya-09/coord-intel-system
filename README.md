# Coordination Intelligence System (CIS)

A full-stack web application that eliminates the "coordination black hole" in architecture, interior design, and construction projects — automatically tracing how a single change ripples across stakeholders, tasks, approvals, and dependencies.

**Live Demo:**
- Frontend: https://frontend-three-olive-42.vercel.app/
- Backend API: https://coord-intel-system.onrender.com/api/v1

---

## The Problem

Construction and interior fit-out projects involve many stakeholders — clients, architects, interior designers, project managers, contractors, vendors, and specialists. Information is scattered across WhatsApp, email, calls, and spreadsheets. When one stakeholder makes a change, it's often unclear:

- Who is responsible for what
- Who is affected by a change
- What depends on what
- What requires approval
- What is currently blocked
- What needs to happen next

CIS acts as a **coordination intelligence layer** — connecting stakeholders, activities, changes, dependencies, and approvals so that impact is identified automatically instead of relying on manual coordination and individual memory.

---

## Core Features

| Module | Description |
|---|---|
| **Stakeholder & Role Management** | Track stakeholders, their roles, and responsibility areas per project |
| **Activity & Change Tracking** | Log activities, decisions, issues, and change events as they happen |
| **Impact Analysis** ⭐ | Automatically traces a change through the dependency graph to identify affected activities, approvals, and stakeholders |
| **Dependency Management** | Model dependencies between tasks, activities, approvals, and deliverables |
| **Action Tracking** | Auto-generate and assign actions in response to identified impact |
| **Approval Management** | Track required approvals and what's blocked pending sign-off |
| **Coordination Alerts** | Notify affected stakeholders automatically when a change occurs |
| **Project Memory** | An auditable, chronological log of every change, decision, and resolution |

Access is role-scoped: **Admin/PM**, **Client**, and **Stakeholder** roles each see only what's relevant to them.

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Auth:** JWT-based authentication with role-based access control (RBAC)
- **Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

```
coord-intel-system/
├── backend/
│   ├── models/          # Mongoose schemas (Stakeholder, Task, Dependency, etc.)
│   ├── routes/          # Express API routes
│   ├── controllers/
│   ├── services/        # Impact traversal / dependency graph logic
│   ├── config/          # DB connection, env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── lib/              # API client calls to backend
│   ├── styles/
│   └── package.json
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd coord-intel-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```dotenv
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
PORT=5000
```

Run the backend:
```bash
npm run dev
```
The API will be available at `http://localhost:5000/api/v1`.

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Run the frontend:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## Deployment

**Backend (Render):**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN` (set to your live frontend URL, no trailing slash)

**Frontend (Vercel):**
- Root Directory: `frontend`
- Framework Preset: Next.js (auto-detected)
- Environment Variables: `NEXT_PUBLIC_API_URL` (set to your live Render backend URL + `/api/v1`)

> **Note:** `NEXT_PUBLIC_*` environment variables are baked in at build time — redeploy the frontend after changing them. Similarly, redeploy the backend after changing `CORS_ORIGIN`, and ensure the value has no trailing slash (CORS origin matching is exact-string).

---

## Demo Scenario

A residential interior fit-out project — **Patel Residence Fit-Out** — with stakeholders including the Client, Interior Designer, Architect, Procurement Vendor, Site Contractor, and Project Manager.

When the Interior Designer changes the flooring material mid-project, CIS automatically:
1. Flags the Procurement Vendor's material order as blocked
2. Flags the Site Contractor's installation schedule as affected
3. Flags the Client's budget approval as needing re-triggering
4. Auto-generates actions for the PM and Vendor
5. Sends coordination alerts to every affected stakeholder
6. Logs the full chain in Project Memory

---

## License

This project was built as a prototype/hackathon submission and is not licensed for production use as-is.
