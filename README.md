# Spear-It-Skins  
### A CS:GO Skin Market Analytics & Price Intelligence Platform

---

## Overview

Spear-It-Skins is a web-based analytics platform that aggregates, tracks, and visualizes pricing data for CS:GO skins across multiple online marketplaces. Users can browse skins, view historical price trends, compare prices between platforms, and receive alerts for price changes. The system supports authenticated users, favorites/watchlists, and advanced filtering. Admin tools allow data moderation and system oversight. The project emphasizes real-world API integration, data modeling, and full-stack web development.

---

## Motivation

The CS:GO skin economy is a large-scale digital marketplace involving millions of users and frequent price fluctuations. Existing tools are often cluttered, limited in analytics, or focused on monetization rather than insight. This project allows us to apply software engineering principles to a complex, data-driven system while learning full-stack development, API integration, and collaborative workflows. The domain is familiar and engaging, which motivates consistent contribution from all team members.

---

## Development only local Postgres 

This project uses Docker to run Postgres locally for development.

**Prerequisite**: Install Docker Desktop -> https://www.docker.com/products/docker-desktop/

**Start the database from project root**

```bash
docker-compose up -d 
```

**Stop the database**
```bash
docker-compose down
```

Database runs on **localhost:5432**

**Dev credentials:**
 - user: skins
 - password: skins
 - database: skins

## Implemented Features

### Backend
- `GET /api/v1/items/history?name=<market_hash_name>` — queries `item_price_history` from PostgreSQL and returns historical min/suggested price snapshots for a specific item

### Frontend
- Category pages now render clickable weapon cards (image + name) sourced from a `weapons` array in `categoryData`
- Weapon pages (`/category/:type/:itemId`) display skin cards that link to individual skin pages
- Skin pages (`/category/:type/:itemId/:skinId`) display a wear table with float ranges and live prices fetched from the backend, with a price history chart (Recharts) that loads on wear row click
- Shared skin data file (`src/data/skinsData.js`) centralises all skin/wear/case metadata and standard CS2 float ranges
- Vite dev server proxy configured to forward `/api` requests to the backend on port 4000

## Features & User Roles

### User Types

#### 1. Guest (Unauthenticated)
- Browse skin catalog
- View current prices
- View basic price history charts
- Search and filter skins by:
  - Weapon
  - Rarity
  - Wear
  - Price range

#### 2. Registered User
- Create and manage an account
- Add skins to a **watchlist**
- View **detailed price history**
- Set **price alerts** (email or in-app)
- Compare prices across marketplaces
- Track a virtual **portfolio value** (no real-money transactions)

#### 3. Admin
- Manage users
- Moderate skin data
- Trigger data refreshes
- Flag broken or missing API data
- View system metrics and logs

---

###  Core Features

- Skin catalog with detailed metadata (weapon, rarity, float, wear)
- Marketplace price aggregation
- Historical price tracking and visualizations
- Advanced filtering and search
- Watchlists and alert system
- Authentication and authorization
- Admin dashboard

---

##  Risks & Challenges

- Third-party API limitations (rate limits, data availability)
- Data normalization across different marketplaces
- Time constraints due to semester workload
- Frontend visualization complexity (charts, filters)
- Team coordination across multiple components

**Mitigation Strategies:**
- Early API testing
- Scoped MVP definition
- Weekly milestones
- Clear ownership of components

---

##  Existing Related Projects

Examples of similar platforms include:
- csgoskins.gg
- Steam Community Market
- Skinport analytics tools

### How Spear-It-Skins Is Different
- Focuses on **analytics and insight**, not transactions
- Clean, student-built UI emphasizing usability
- Unified price comparison across sources
- Portfolio simulation and alerting features

---

##  Tech Stack

### Platform
- Web Application

### Frontend
- React
- JavaScript / TypeScript

### Backend
- Node.js
- Express

### Database
- PostgreSQL

### Hosting
- Vercel / Render / Railway (TBD)

---

## Third-Party Libraries & APIs

- CS:GO skin pricing APIs (public APIs where permitted)
- Charting: Chart.js or Recharts
- Authentication: JWT / Passport.js
- Database ORM: Mongoose or Prisma
- GitHub for version control
- REST API architecture

---

## Team Organization

### Team Structure

A flat team structure with defined ownership and one rotating coordinator.

| Role | Responsibility |
|-----|----------------|
| Frontend Lead | UI development, React components, charts |
| Backend Lead | API design, data aggregation |
| Database Engineer | Schema design, database queries |
| DevOps / Integration | Deployment, CI, environment setup |
| QA / Documentation | Testing, documentation, demo preparation |

Each member contributes code weekly, reviewed through pull requests.

---

## Communication & Workflow

- GitHub for issues, pull requests, and milestones
- Discord for asynchronous communication
- Weekly in-person or Zoom meetings
- Agile-style weekly sprints
- Shared README and contribution guidelines

---

## License

This project is developed as part of **CEN 4090L – Software Engineering Lab** at Florida State University and is intended for educational purposes.

