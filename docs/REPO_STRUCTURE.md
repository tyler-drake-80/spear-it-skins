# Repository Structure & Contribution Guide

This document explains **how the repository is organized**, what each section is responsible for, and **guidelines for working within each area**.  
The goal is to keep the project understandable, scalable, and easy to collaborate on.

---

## High-Level Repository Structure
repo-root/
├── backend/ # Node.js + TypeScript + Express API
├── frontend/ # React client application
├── docs/ # Architecture, API contracts, and planning docs
├── VERSION_CONTROL_GUIDE.md
└── README.md


Each major folder represents a **logical system boundary**.  
Code should stay within its boundary unless there is a clear reason otherwise.

---

## Backend (`/backend`)

The backend is responsible for:
- Serving the REST API
- Aggregating and transforming market data
- Authentication and authorization
- Business logic and persistence

### Backend Structure

backend/
├── src/
│ ├── app.ts # Express app configuration
│ ├── server.ts # Server entry point
│ ├── routes/ # API route definitions
│ ├── services/ # Business logic (no HTTP concerns)
│ ├── middleware/ # Cross-cutting request logic
│ ├── config/ # Environment and configuration
│ └── types/ # Shared or extended TypeScript types
├── .env.example
├── package.json
└── tsconfig.json
  

### Backend Guidelines
- **Routes should be thin**: no complex logic in route handlers
- **Business logic lives in `services/`**
- **Environment variables are accessed only through config**
- No frontend assumptions (no JSX, no browser APIs)
- Prefer explicit types over `any`

---

## Frontend (`/frontend`)

The frontend is responsible for:
- User interface and interaction
- Rendering data from the backend API
- Client-side routing and state management

*(Exact structure may evolve as the frontend team decides.)*

### Frontend Guidelines
- Treat the backend as a **black box** accessed via HTTP
- Do not hardcode backend internals
- Prefer reusable components
- API calls should be centralized (e.g., `/api` or `/services` folder)

---

## Documentation (`/docs`)

The `docs/` folder contains **non-code artifacts** that explain how the system works.

Examples:
docs/
├── api.md # API endpoints and request/response shapes
├── data-model.md # Database schema and relationships
├── architecture.md # High-level system design
└── decisions.md # Architecture/tech decisions and rationale


### Documentation Guidelines
- Keep docs **short, current, and useful**
- Update docs when changing contracts or structure
- Prefer examples over long explanations

---

## Architectural Responsibilities (Conceptual Sections)

These are **logical areas of work**, not necessarily folders.

### 1. API & Routing
- Define endpoint paths and HTTP methods
- Validate request inputs
- Delegate to services

### 2. Services (Business Logic)
- Transform and aggregate data
- Apply rules and calculations
- Independent of HTTP and Express

### 3. Data Layer
- Database schemas
- Queries and persistence logic
- No UI or request handling logic

### 4. Authentication & Authorization
- User identity
- Permissions and access control
- Token/session handling

### 5. Infrastructure & Tooling
- Build scripts
- Environment configuration

---

## Contribution Workflow
**Make sure to read VERSION_CONTROL_GUIDE.md in its entirety before contributing**
1. **Create a feature branch** (never work directly on `main`)
2. Make focused, logical commits
3. Open a pull request with:
   - What changed
   - Why it changed
   - Any follow-up work needed
4. Request at least one reviewer
5. Address feedback before merging

---

## General Guidelines

- Prefer clarity over cleverness
- Avoid “quick hacks” that break structure
- If unsure where something belongs, ask before committing
- Small, reviewable PRs > large, risky ones
- Code is written for **humans first, machines second**

---

## Final Note

This structure is not about restriction — it exists to:
- Reduce merge conflicts
- Make onboarding easier
- Allow the project to grow without chaos

If the project outgrows this structure, we adapt it together.

