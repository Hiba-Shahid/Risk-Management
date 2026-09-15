# RiskVision — FYP Risk Management Dashboard

A full-stack MERN web application for managing Final Year Project risks: surveys, risk register, PERT scheduling, technical vs non-technical analysis, and deadline response strategies.

## Features

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Total/high-priority risks, mitigation progress, pie charts, heatmap, timeline |
| **Survey** | Collect student responses, top-5 risks chart, mitigation suggestions |
| **Risk Register** | CRUD, auto priority (P×I), filtering, PDF/CSV export, AI recommendations |
| **PERT** | T_E = (O+4M+P)/6, Gantt chart, critical path, delay simulation |
| **Comparison** | Technical vs non-technical bar/radar charts, case studies |
| **Deadline** | Avoidance, mitigation, transfer, acceptance strategies |

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Recharts, Lucide icons
- **Backend:** Node.js, Express.js, MongoDB, PDFKit
- **Optional:** JWT auth (demo user included)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or MongoDB Atlas URI)

## Quick Start

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

API runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

### 3. Demo data

The seed script loads sample risks, surveys, PERT tasks, and a demo user:

- **Email:** `demo@risktrack.app`
- **Password:** `demo123`

## Project Structure

```
Risk Management/
├── backend/
│   ├── models/       # User, Risk, Survey, Task
│   ├── routes/       # API endpoints
│   ├── utils/        # Mitigation maps, AI suggestions
│   └── seed.js       # Sample data
├── frontend/
│   └── src/
│       ├── pages/    # All UI modules
│       └── components/
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard analytics |
| GET/POST | `/api/risks` | Risk register CRUD |
| GET | `/api/risks/export/csv` | Export CSV |
| GET | `/api/risks/export/pdf` | Export PDF |
| GET | `/api/surveys/analytics` | Survey top-5 & mitigations |
| GET | `/api/tasks` | PERT schedule + critical path |
| POST | `/api/tasks/simulate-delay` | Delay simulation |

## Risk Priority Formula

```
Priority = Probability × Impact
```

Example: P=4, I=5 → Priority=20 (Critical)

## License

MIT — Built for academic FYP demonstration.
