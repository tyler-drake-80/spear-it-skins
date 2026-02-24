# Software Implementation and Testing Document For Group 3

## Authors: Tyler Drake, Christian Wilsey, Luis Villanueva, Emanuel Reyes Martinez, Jamie Velasquez

### 1. Programming languages
 - JavaScript
    - **Where it's used:** Backend (Node.js/Express API) and frontend application logic
    - **Reason for choosing:** Allows us to use a consistent languag across both frontend and backend development. Using Node.js with Express provides a lightweight and flexible server framework which is well-suited for building REST APIs. 
 - HTML
    - **Where used:** Frontend page structure 
    - **Reason for choosing:** Provides structural foundation for rendering browser content.
 - CSS
    - **Where used:** Frontend styling and layout.
    - **Reason for choosing:** Allows clean layout control and good application responsiveness

 - SQL
    - **Where used:** Database schema definition and future query logic 
    - **Reason for choosing:** Provides a structured way to define and query data. It is well suited for this structured weapon/skin data relationship scheme.

### 2. Platforms, APIs, Databases, other technologies
 - Node.js 
    - Used as the backend runtime environment for executing server side JavaScript
 - Express.js 
    - Used to implement our REST API under /api/v1/.
    - Handles routing, middleware, and request/response processing.
 - PostgreSQL
    - Used as our relational database system for storing weapon and skin data.
 - Docker
    - Used to run and manage our PostgreSQL DB instance in a consistent, containarized environment
 - Skinport API
    - Used as an external data source. 
    - Backend retrieves and caches data from Skinport to provide consistent API responses while database integration is in progress.
 - Node-cron
    - Used to periodically refresh cached data from the external API.
 

### 3. Execution based functional testing 
For increment 1, functional testing focused on verifying core API behavior and frontend navigation. 
 - Backend functional testing:
    - Verified that /api/v1/ route responds correctly to requests.
    - Confirmed that the API returns structured JSON data in the expected format.
    - Tested behavior when environment variables are missing.
    - Verified successful Dockerized database startup and schema initialization.
    - Manually tested API endpoints using browser requests 
 - Frontend functional testing:
    - Verified that navigation bar dropdown menus correctly route to each weapon category.
    - Confirmed that category pages load correctly.
    - Confirmed that individual weapon pages render and correspond to the correct URLs.

### 4. Execution based non-functional testing 
For increment 1, non-functional testing primarily focused on stability, structure, and maintainablity rather than performance optimization.
 - **Stability:** Tested API behavior under repeated requests to ensure no crashes
 - **Reliability:** Ensured the API response format remains stable even as backend internals transition from external cached data to database-backed data.
 - **Maintainabilty:** Structured the backend into modular components, ensured consistent response formats to reduce future breaking changes.
 - **Performance:** While full performance testing not yet conducted, current caching of external API data reduces repeated external calls and improves response consitency.

### 5. Non-execution based testing 
Non-execution based testing was conducted through review processes.
 - **Code reviews:** All major features developed in seperate branches and merged via PRs. Team members review each other's code before merging into main.
 - **Branch management:** Features were isolated in dedicated branches to reduce merge conflicts.
 - **Walkthroughs:** Response formats were coordinated with frontend team before locking in structure.
 - **Documentation:** Schema initialization scripts were committed and reviewed. Increment progress and API routes were clearly communicated.
