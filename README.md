<p align="center">
  <img src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png" width="320" alt="Skill Grid Logo" />
</p>

# Skill Grid Platform | Architectural Log

The Skill Grid platform is a high-fidelity architectural ecosystem designed for technical career acceleration. This repository maintains a strictly minimalist, comment-free codebase optimized for security and horizontal scale.

---

## ⚡ Technical Update Registry (V2.2.0)

### 🛡️ Institutional Security Overhaul
- **Distributed Redis Caching**: Implemented a global rate-limiting gateway via ioredis to prevent brute-force attacks across all load-balanced nodes.
- **28-Hour Account Lockout**: Integrated a persistent security block that triggers automatically after 5 failed password attempts.
- **PostgreSQL Hardening (RLS)**: Deployed Row-Level Security with case-sensitive Prisma-mapped policies to eliminate PII leakages between Intern and Applicant nodes.
- **Edge Gateway Policy**: Forced HSTS, Content-Security-Policy (CSP), and cross-origin isolation via Next.js Edge Middleware.

### 📊 Administrative & Audit Suite
- **Submission Audit Filters**: New deep-filtering logic in the CLEED dashboard to track missing Task 1 submissions for Batch 1 and 2.
- **Automated CSV Reporting**: High-fidelity export terminal for generating missing-submission audit reports.
- **Rescheduling Terminal**: Integrated PATCH API handlers and specialized corporate email templates for interview rescheduling.
- **Portal Continuity**: Programmatically re-enabled Batch 2 submission deadline until April 9, 2026.

### ⚙️ System Optimization
- **Codebase Neutralization**: Stripped all code comments across .ts, .tsx, .js, and .prisma files for a clean, industrial-grade production build.
- **Load Balancer Observability**: Deployed `/api/health` for real-time database and system telemetry.
- **Vulnerability Remediation**: Resolved 28+ high-risk security flaws in the core dependency tree.

---

**[platform.studentforge.in](https://platform.studentforge.in)**

© 2026 Student Forge Technologies Private Limited. All platform protocols and technical assets are protected.
