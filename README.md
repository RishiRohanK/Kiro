# STUDENT FORGE | Learn Grid Ecosystem
**Version 2.5.0 (Enterprise Assessment Overhaul)**

STUDENT FORGE is a secure, high-fidelity internship and learning management ecosystem built for scale and integrity. The platform features an industrial-grade examination terminal, advanced performance analytics, and a centralized administrative command center.

---

## 🚀 Key Modules

### 1. Secure Examination Terminal (`/exams`)
An industrial-standard assessment engine configured to JEE Mains protocols.
- **Marking Scheme**: +3 for correct answers, -1 for negative marking.
- **Session Integrity**:
  - Mandatory Full-screen enforcement.
  - Real-time Violation logging (Tab switching, Key-blocking: F5, F12, Ctrl+T).
  - Standalone Review Terminal for final candidate verification.
- **Server-Side Scoring**: Anti-cheat scoring logic executed strictly on the server to prevent payload manipulation.

### 2. Intern Performance Reports (`/intern/dashboard/reports`)
High-density diagnostic reporting for candidates.
- **Scale**: Performance metrics based on 150-mark standard.
- **Visualization**: Graphical representation of intern growth and accuracy.
- **Automated Feedback**: Diagnostic commentary based on assessment nodes.

### 3. CLEED Command Center (`/cleed/dashboard`)
The administrative heart of the ecosystem.
- **Live Monitoring**: Real-time tracking of active exam sessions and violation counts.
- **Unified Management**: Centralized control over interns, tasks, and scheduling.
- **Hiring Registry**: Advanced portal for talent acquisition and interview orchestration.

---

## 🛠 Tech Stack

- **Core Framework**: Next.js 16.2.0 (Turbopack Powered)
- **Database Engine**: PostgreSQL with Prisma ORM
- **Security Layer**: 
  - Dynamic Client Refresh (Preventing stale state).
  - Encrypted Local Storage Bridges for session transitions.
  - SMTP-based Secure Recovery.
- **UI/UX**: 
  - Tailwind CSS (Minimalist Industrial Aesthetic).
  - Lenis (Unified Smooth Scroll with selective exclusion via `data-lenis-prevent`).
  - Lucide React (Standardized Iconography).

---

## 🏗 Installation & Deployment

### Development Environment
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run with Turbopack
npm run dev
```

### Production Build
```bash
# Secure build with pre-generation
npm run build

# Start production server
npm run start
```

---

## 🔒 Security Protocol (Zero-Trust)
STUDENT FORGE operates on a zero-trust architecture for assessment data. All `CORRECT_ANSWERS` are isolated in the backend environment, ensuring that the frontend only receives question text, never the evaluation keys.

---

### 📅 Release Log (V2.5.0)
- **Implemented standalone Review Page** for optimized assessment exit flows.
- **Upgraded to +3 / -1 Marking Standard** across all diagnostic tools.
- **Resolved Lenis Scrolling Conflicts** in independent UI regions.
- **Forced Dynamic Prisma Client Refresh** to prevent hot-reload stale states.

---
**Student Forge Technologies Private Limited © 2026**
*Minimalist Industrial Standard | Engineered for Integrity*