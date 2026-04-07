<p align="center">
  <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png" width="280" alt="Skill Grid Logo" />
</p>

# Skill Grid Platform

<p align="center">
  <b>[Architecture Hub](https://platform.studentforge.in/docs)</b> | 
  <b>[Technical Tools](https://platform.studentforge.in/tools)</b> | 
  <b>[Resource Registry](https://platform.studentforge.in/resources)</b> | 
  <b>[Community Board](https://platform.studentforge.in/community)</b> | 
  <b>[Support Mission](https://platform.studentforge.in/support)</b>
</p>

---

## Technical Overview

The Skill Grid platform, powered by Student Forge Technologies Private Limited, is a high-fidelity learning and internship ecosystem designed for technical career acceleration. This repository hosts the core platform architecture, featuring a high-density minimalist design language and durable workflow integrations.

### PRO-2.2.0 Institutional Security & Management
The latest technical iteration (PRO-2.2.0) introduces institutional-grade security and administrative tools:

- **Distributed Security Gateway**: Integration of **Redis Cache** (ioredis) within the Edge Middleware for global, load-balanced rate limiting and bot deflection.
- **Institutional Lockout Logic**: Implementation of a persistent **28-hour account block** triggered after 5 consecutive failed password entries, backed by database-level auditing.
- **Data Leakage Prevention (RLS)**: Activation of PostgreSQL **Row-Level Security** with case-sensitive Prisma-mapped policies to isolate Intern and Applicant PII.
- **Interview Rescheduling Terminal**: Integrated `PATCH` API handlers and standardized email automation for professional reschedule notices.
- **Submission Audit Suite**: Deep-filter logic for identifying missing Task 1 submissions with automated CSV reporting for administrative oversight.
- **Zero-Friction Deadline Extension**: Re-enabled Batch 2 internship submission portals through April 2026 for mission continuity.

---

## 🏗️ Technical Stack

- **Framework**: Next.js 16 (Canary Stability)
- **Styling**: Tailwind CSS 4 (Minimalist High-Density Utility)
- **Database**: Prisma 7 with PostgreSQL (RLS Enabled)
- **Caching**: ioredis (Distributed Security State)
- **Emails**: Custom Mail Engine 2.2 (Resend / AWS SES / Gmail App compatible)

---

## 📂 Platform Page Registry

The current ecosystem is composed of the following mission-critical page nodes:

### Core Hubs
- **/admin**: Centralized administrative terminal and mission control.
- **/cleed/dashboard**: Administrative command center for hiring and intern auditing.
- **/ambassador**: Strategic lead program for campus vanguard leaders.
- **/community**: Collective intelligence board and innovation idea registry.

### Professional Internship Registry
- **/internships**: Definitive registry of mission-critical internship opportunities.
- **/intern**: Intern-specific dashboard for real-time mission tracking and certification.

### Academic Architecture (Academy)
- **/courses**: Academic enrollment and course management gateway.
- **/roadmaps**: Technical career path archives and roadmap terminals.

---

## 🚀 Getting Started

### Development Environment
Initiate the local development environment synchronized with the edge middleware:

```bash
npm run dev
```

### Manual Security Checks
Security protocols (HSTS, CSP, and RLS) can be audited via the `/api/health` node, providing real-time database and uptime telemetry.

---

## 📍 Platform Redirection

All primary mission anchors are formally synchronized with the production domain:

**[platform.studentforge.in](https://platform.studentforge.in)**

---

© 2026 Student Forge Technologies Private Limited. All platform protocols and technical assets are protected.
