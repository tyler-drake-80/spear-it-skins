# Software Requirements and Design Document For Group 3

## Authors: Tyler Drake, Christian Wilsey, ...

### 1. Overview
The system under development is a web based application that provides structured access to Counter-Strike skin and weapon market data. The platform consists of a frontend web interface and a backend RESTful API. The frontend allows users to browse weapon categories and navigate to individual weapon pages, while the backend provides structured JSON data through versioned API endpoints.

The backend currently retrieves and caches skin data from an external marketplace API (Skinport) and is transitioning to a database-backed architecture using PostgreSQL. The system is designed to support scalable data storage, filtering, and presentation of weapon and skin information. Increment 1 focuses on delivering a stable versioned API and a structured frontend skeleton ready for full integration.

### 2. Functional Requirements
**FR-1 (High priority)** - The system shall expose a versioned REST API under route /api/v1/.
**FR-2 (High priority)** - System shall return structured JSON responses for all valid API requests.
**FR-3 (High priority)** - System shall retrieve skin and weapon data from an external marketplace API and provide it through its own API endpoint.
**FR-4 (High priority)** - The system shall initialize and connect to a PostgreSQL database when a valid database configuration is provided. 
**FR-5 (Medium priority)** - System shall initialize the required databasse schema for storing weapon and skin data.
**FR-6 (High priority)** - Frontend shall provide category pages for pistols, rifles, SMGs, knives, and heavy weapons.
**FR-7 (High priority)** - Frontend shall provide a homepage accessible from the root URL.
**FR-8 (High priority)** - Frontend shall provide individual weapon pages accessible via unique URLs.
**FR-9 (Medium priority)** - Frontend shall provide a navigation bar with dropdown menuse allowing users to navigate between weapon categories.
**FR-10 (Medium priority)** - System shall maintain a consistent API response format to ensure frontend compatability as backend evolves.

### 3. Non-functional Requirements
**NFR-1 (Performance):** System shall respond to API requests within a reasonable time frame under normal usage conditions (target=1 second for cached responses).
**NFR-2 (Reliability):** System shall not crash or terminate unexpectedly due to invalid requests or missing environment configuration.
**NFR-3 (Scalability):** Backend architecture shall support migration from externally cached data to database-backed data without breaking API contracts.
**NFR-4 (Maintainability):** Codebase shall be modular, seperating routing, database logic, and external API integration into distinct components.
**NFR-5 (Portability):** The database shall be deployable using Docker to ensure consistent execution across development environments.
**NFR-6 (Usability):** The frontend navigation structure shall allow users to intuitively browse between weapon categories. 
**NFR-7 (Versioning Stability):** The API shall use versioned routes to prevent breaking changes in future increments. 

### 4. Use Case Diagram
 - **Primary actor:** User (website visitor)
 - **Use cases:** View homepage, view weapon categories, view individual weapon page, request weapon data, initialize database, retreive external market data

### 5. Class Diagram and/or Sequence Diagrams
 - User requests weapon data
    - Lifelines:
        - User
        - Frontend
        - Backend router
        - External API
        - Database
    - Flow:
        1. User loads page
        2. Frontend sends request to /api/v1/
        3. Backend processes request
        4. Backend retrieves cached/external data
        5. Backend returns JSON
        6. Frontend renders data
        7. Backend initializes database
        8. User navigates categories

### 6. Operating Environment
**Backend:**
 - Node.js (v18+)
 - Express.js 
 - PostgreSQL 
 - Docker 
**Frontend:**
 - Web browser
 - HTML/CSS/JS 
**Development tools:**
 - Git / GitHub
 - Docker 
 - npm 

### 7. Assumptions and Dependencies
**Assumptions:**
 - The external Skinport API remains available and stable.
 - Users will access the system via modern browsers.
 - Environement variables are properly configured
**Dependencies:**
 - Skinport API 
 - Node.js runtime
 - PostgreSQL
 - Docker
 - npm packages 

