<div align="center">

# KIRO LMS
**MVP Stage - Developed by Redlix Systems**

Kiro LMS is a high-performance Learning Management System designed for institutional learning, industrial assessments, and performance tracking. The platform integrates assessment terminals, real-time administrative observability, and automated task validation.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Security Logs](/admin/logs)

---

## TECHNOLOGY STACK

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=bull&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## SYSTEM MODULES

### ASSESSMENT ENGINE (/exams)
A secure examination terminal implementing professional marking standards (+3 / -1).
- Proctoring: Mandatory full-screen enforcement and focus-loss violation logging.
- Evaluation: Server-side scoring logic with encrypted evaluation keys.
- Review Terminal: Dedicated interface for candidate verification and qualifying state management.

### CLEED ADMINISTRATIVE COMMAND CENTER (/cleed)
The central unit for ecosystem management.
- Observability: Live tracking of active examinees, violation markers, and session diagnostics.
- Unified Registry: Management portal for interns, applications, and employee nodes.
- Submission Vault: Centralized repository for tasks and technical assignments.

### SYSTEM RELIABILITY DASHBOARD (/admin/logs)
Real-time infrastructure health monitoring and deployment auditing.
- Audit Logs: Live Git commit history and deployment verification.
- Health Indicators: Per-deployment status tracking with state validation.
- Incident Response: Automated recovery status indicators and system integrity reporting.

### GLOBAL MAINTENANCE INFRASTRUCTURE
A high-availability status framework used to communicate system health.
- Operational Banner: Real-time status updates with versioned security verification.
- Protocol Lockdown: Emergency capability to suspend API mutations during detected threats.

---

## SECURITY ARCHITECTURE
The ecosystem operates on a zero-trust model with browser-level isolation.

- DOS Protection: Payload threshold monitoring (1MB limit) to prevent resource exhaustion.
- Rate Limiting: Traffic shaping with security blocks for authentication routes.
- Path Cloaking: Rejection of requests targeting sensitive files (.git, .env, .aws, .ssh).
- Enhanced Headers: Strict HSTS enforcement, X-Frame-Options (DENY), and Cross-Origin-Opener-Policy (COOP).
- DNS Hardening: Disabled DNS prefetching to eliminate secondary exfiltration vectors.

---

## OPERATIONAL PROTOCOL

### DOCKER DEPLOYMENT
```bash
# Initialize the cluster
docker-compose up --build
```
The ecosystem will be accessible at http://localhost (Port 80).

### LOCAL DEVELOPMENT
```bash
# Dependency acquisition
npm install

# Client generation
npx prisma generate

# Development runtime
npm run dev

# Background worker (Optional)
npm run worker:email
```

---

<div align="center">
**Redlix Systems — 2026**
*Kiro LMS | Minimalist Standard | Engineered for Integrity*
</div>