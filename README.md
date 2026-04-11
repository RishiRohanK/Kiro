# STUDENT FORGE | LEARN GRID ECOSYSTEM
**VERSION 2.5.0 (ENTERPRISE ASSESSMENT OVERHAUL)**

STUDENT FORGE is a secure, high-fidelity internship and learning management ecosystem. The platform implements an industrial-grade examination terminal, performance analytics, and a centralized administrative command center.

---

## CORE SYSTEM ARCHITECTURE

### 1. SECURE EXAMINATION TERMINAL (/EXAMS)
An industrial-standard assessment engine synchronized with JEE Mains protocols.
- **Marking Standard**: +3 for correct nodes, -1 for negative evaluations.
- **Session Integrity Protocol**:
  - Mandatory Full-screen enforcement via DOM API.
  - Real-time Violation logging (Focus manipulation detection).
  - Standalone Review Terminal for candidate verification state management.
- **Server-Side Evaluation**: scoring logic executed strictly on the backend to prevent client-side intercept manipulation.

### 2. INTERN PERFORMANCE ANALYTICS (/INTERN/DASHBOARD/REPORTS)
High-density diagnostic reporting for candidates.
- **Metric Scale**: Quantitative performance evaluation based on 150-mark standard.
- **Visualization**: Graphical representation of intern trajectory and accuracy nodes.
- **Automated Feedback**: Diagnostic commentary based on assessment data nodes.

### 3. CLEED COMMAND CENTER (/CLEED/DASHBOARD)
The administrative central unit of the ecosystem.
- **Live Monitoring**: Real-time observability of active sessions and violation counts.
- **Unified Management**: Centralized control over interns, scheduled tasks, and timelines.
- **Hiring Registry**: Operational portal for recruitment and interview orchestration.

---

## DETAILED TECHNOLOGY STACK BREAKDOWN

| Layer | Technology | Specification |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16.2.0 | Turbopack compilation engine with file-based routing |
| **Runtime Environment** | Node.js | Asynchronous event-driven JavaScript runtime |
| **Database Engine** | PostgreSQL | Relational database with strictly typed schemas |
| **ORM / Data Access** | Prisma 7.6.0 | Type-safe database client and automated migration node |
| **Styling Architecture** | Tailwind CSS | Utility-first CSS framework for industrial aesthetics |
| **Scroll Interpolation** | Lenis | Unified smooth scroll with `data-lenis-prevent` isolation |
| **Iconography Node** | Lucide React | SVG-based performance iconography terminal |
| **API Protocol** | REST / JSON | Stateless communication between frontend and backend |
| **Security Layer** | JWT / SMTP | Token-based authentication and secure mail relays |

---

## INSTALLATION AND DEPLOYMENT PROTOCOL

### DEVELOPMENT ENVIRONMENT
```bash
# REQUISITE: Node node_modules installation
npm install

# PRISMA CLIENT REGENERATION
npx prisma generate

# EXECUTION VIA TURBOPACK
npm run dev
```

### PRODUCTION BUILD
```bash
# OPTIMIZED PRODUCTION COMPILE
npm run build

# START PRODUCTION SERVER NODE
npm run start
```

---

## ZERO-TRUST SECURITY MODEL
STUDENT FORGE operates on a zero-trust architecture for assessment data. All evaluation nodes (`CORRECT_ANSWERS`) are isolated within the backend environment, ensuring the client layer only processes question text and never the evaluation keys.

---

### VERSION LOG (V2.5.0)
- IMPLEMENTED STANDALONE REVIEW TERMINAL FOR OPTIMIZED ASSESSMENT EXIT FLOWS.
- UPGRADED TO +3 / -1 MARKING STANDARD ACROSS ALL DIAGNOSTIC LAYERS.
- RESOLVED LENIS SCROLLING CONFLICTS IN INDEPENDENT UI REGIONS via DATA-LENIS-PREVENT.
- FORCED DYNAMIC PRISMA CLIENT REFRESH TO PREVENT STALE SESSION STATES IN DEV.

---
**STUDENT FORGE TECHNOLOGIES PRIVATE LIMITED © 2026**
*MINIMALIST INDUSTRIAL STANDARD | ENGINEERED FOR INTEGRITY*