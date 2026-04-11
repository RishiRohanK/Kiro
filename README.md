# Student Forge | Learn Grid Ecosystem
**Version 2.5.0 (Enterprise assessment overhaul)**

Student Forge is a secure, high-fidelity internship and learning management ecosystem. The platform implements an industrial-grade examination terminal, performance analytics, and a centralized administrative command center.

---

## Core system architecture

### 1. Secure examination terminal (/exams)
An industrial-standard assessment engine synchronized with JEE Mains protocols.
- **Marking standard**: +3 for correct nodes, -1 for negative evaluations.
- **Session integrity protocol**:
  - Mandatory full-screen enforcement via DOM API.
  - Real-time violation logging (Focus manipulation detection).
  - Standalone review terminal for candidate verification state management.
- **Server-side evaluation**: Scoring logic executed strictly on the backend to prevent client-side intercept manipulation.

### 2. Intern performance analytics (/intern/dashboard/reports)
High-density diagnostic reporting for candidates.
- **Metric scale**: Quantitative performance evaluation based on 150-mark standard.
- **Visualization**: Graphical representation of intern trajectory and accuracy nodes.
- **Automated feedback**: Diagnostic commentary based on assessment data nodes.

### 3. Cleed command center (/cleed/dashboard)
The administrative central unit of the ecosystem.
- **Live monitoring**: Real-time observability of active sessions and violation counts.
- **Unified management**: Centralized control over interns, scheduled tasks, and timelines.
- **Hiring registry**: Operational portal for recruitment and interview orchestration.

---

## Detailed technology stack breakdown

| Layer | Technology | Specification |
| :--- | :--- | :--- |
| **Core framework** | Next.js 16.2.0 | Turbopack compilation engine with file-based routing |
| **Runtime environment** | Node.js | Asynchronous event-driven JavaScript runtime |
| **Database engine** | PostgreSQL | Relational database with strictly typed schemas |
| **ORM / Data access** | Prisma 7.6.0 | Type-safe database client and automated migration node |
| **Styling architecture** | Tailwind CSS | Utility-first CSS framework for industrial aesthetics |
| **Scroll interpolation** | Lenis | Unified smooth scroll with `data-lenis-prevent` isolation |
| **Iconography node** | Lucide React | SVG-based performance iconography terminal |
| **API protocol** | REST / JSON | Stateless communication between frontend and backend |
| **Security layer** | JWT / SMTP | Token-based authentication and secure mail relays |

---

## Installation and deployment protocol

### Development environment
```bash
# Requisite: Node node_modules installation
npm install

# Prisma client regeneration
npx prisma generate

# Execution via Turbopack
npm run dev
```

### Production build
```bash
# Optimized production compile
npm run build

# Start production server node
npm run start
```

---

## Zero-trust security model
Student Forge operates on a zero-trust architecture for assessment data. All evaluation nodes (`CORRECT_ANSWERS`) are isolated within the backend environment, ensuring the client layer only processes question text and never the evaluation keys.

---

### Version log (v2.5.0)
- Implemented standalone review terminal for optimized assessment exit flows.
- Upgraded to +3 / -1 marking standard across all diagnostic layers.
- Resolved Lenis scrolling conflicts in independent UI regions via data-lenis-prevent.
- Forced dynamic Prisma client refresh to prevent stale session states in dev.

---
**Student Forge Technologies Private Limited © 2026**
*Minimalist industrial standard | Engineered for integrity*