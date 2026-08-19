# Architectural Migration Report: CarePulse V1

## 1. Executive Summary
This report outlines the structural transformation of the CarePulse application from a Next.js Full-Stack Monolith (coupled with Appwrite) to a strict Decoupled Monorepo Architecture. This prepares the system for a robust API-driven integration with a future Laravel backend.

---

## 2. Structural Changes Executed

### Before: The Monolithic Approach
Previously, the entire application resided in the root directory. Next.js was responsible for both rendering the user interface and handling backend business logic (Server Actions connecting to Appwrite/Databases).

**Previous Structure:**
```text
/care-pulse-v1
├── app/                  # Frontend UI Routes
├── components/           # Frontend React Components
├── lib/                  
│   ├── actions/          # ❌ Backend Logic (Spaghetti)
│   ├── db.ts             # ❌ Backend Database Logic
│   └── utils.ts          # Frontend utilities
├── package.json          # Combined dependencies
└── tailwind.config.js    
```

### After: The Monorepo Approach (Separation of Concerns)
The repository has been restructured into a Monorepo utilizing Workspace management. The UI and the legacy backend logic have been physically separated to enforce strict boundaries.

**New Structure:**
```text
/care-pulse-v1
├── package.json                # Monorepo Workspace Config
│
├── frontend/                   # 100% Isolated Next.js Presentation Layer
│   ├── app/                    
│   ├── components/             
│   ├── lib/utils.ts            # Strictly frontend utilities
│   └── package.json            # Frontend-only dependencies
│
├── old-backend/                # Isolated Legacy Appwrite Logic
│   ├── package.json            
│   └── src/                    
│       ├── actions/            # Extracted server actions
│       ├── db.ts               # Extracted DB handlers
│       └── auth.ts             
│
└── laravel-backend/            # Reserved for the future Laravel API
```

---

## 3. Method Comparison: Old vs. New Architecture

| Feature | Old Method (Next.js Server Actions + Appwrite) | New Method (Next.js SPA + Laravel API) |
| :--- | :--- | :--- |
| **Architecture Type** | Full-Stack Monolith (BaaS) | Decoupled Client-Server (Micro-services oriented) |
| **Separation of Concerns** | **Low:** UI components directly imported backend logic (`@/lib/actions`), creating tight coupling. | **High:** Frontend has zero knowledge of database structures or server operations. They communicate exclusively via HTTP. |
| **Scalability** | **Limited:** Scaling the frontend also scales the backend unnecessarily. Serverless execution limits persistent database connections. | **High:** The Laravel API can be load-balanced and scaled entirely independently of the Next.js frontend. |
| **Team Velocity** | **Prone to Conflicts:** Frontend and backend developers step on each other's toes in the same `lib/` folders. | **Parallel Development:** A dedicated backend team can build the Laravel API while the UI team works on the Next.js SPA simultaneously. |
| **Security Boundaries** | **Blurred:** Secrets and environment variables live in the same project, risking accidental exposure to the client. | **Strict:** Laravel holds all database credentials. The Next.js frontend only holds non-sensitive public API keys. |
| **Data Integrity** | Appwrite handles basic validation, but complex cross-table transactions are difficult in serverless Next.js. | Laravel provides Eloquent ORM, strict transaction control, and centralized Request Validation before data even touches the controllers. |

---

## 4. Next Steps for Development

To successfully transition to the Laravel backend without breaking the workflow, the following roadmap is recommended:

1. **Cleanse the Frontend:** Open `frontend/components/` (e.g., `PatientForm.tsx`) and remove all remaining imports targeting `@/lib/actions/...`.
2. **Implement API Services:** Replace direct function calls with abstract HTTP requests (e.g., Axios or Fetch wrappers).
3. **Mock the API:** Temporarily return mock JSON data from these HTTP requests so the frontend compiles and runs beautifully in isolation.
4. **Initialize Laravel:** Once the frontend is 100% standalone, initialize Laravel in `laravel-backend/` and start building the real endpoints to replace the mock data.
