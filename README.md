<div align="center">

# STUDENT FORGE | PLATFORM ECOSYSTEM
**Industrial standard internship & assessment infrastructure**

Student Forge is a high-density, secure ecosystem designed for institutional learning and performance tracking. The platform integrates industrial examination terminals, real-time administrative observability, and automated task validation nodes.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Security Logs](/admin/logs)

---

### TECHNOLOGY STACK

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) 

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) 
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## SYSTEM MODULES

### INDUSTRIAL ASSESSMENT ENGINE (/exams)
A secure examination terminal implementing Professional marking standards (+3 / -1).
- **Proctoring**: Mandatory full-screen enforcement and focus-loss violation logging via DOM observability.
- **Evaluation**: Zero-trust server-side scoring logic with encrypted evaluation keys.
- **Review Terminal**: Dedicated interface for candidate verification and qualifying state management.

### CLEED ADMINISTRATIVE COMMAND CENTER (/cleed)
The central intelligence unit for ecosystem management.
- **Observability**: Live tracking of active examinees, violation markers, and session diagnostics.
- **Unified Registry**: Management portal for interns, hiring applications, and employee nodes.
- **Submission Vault**: Centralized repository for UI/UX tasks and technical assignments.

### SYSTEM RELIABILITY DASHBOARD (/admin/logs)
Real-time infrastructure health monitoring and deployment auditing.
- **Audit Logs**: Live Git commit history and deployment verification.
- **Health Indicators**: Per-deployment status tracking with "Ready" state validation.
- **Incident Response**: Automated recovery status indicators and system integrity reporting.

### GLOBAL MAINTENANCE INFRASTRUCTURE
A high-availability status framework used to communicate system health to all nodes.
- **Operational Banner**: Real-time status updates with versioned security verification.
- **Protocol Lockdown**: Emergency capability to suspend API mutations during detected threats.

---

## SECURITY ARCHITECTURE (PATCH V3.0.41)
The ecosystem operates on a zero-trust model with advanced browser-level isolation.

- **DOS Protection**: Integrated payload threshold monitoring (1MB limit) to prevent resource exhaustion.
- **Rate Limiting**: Intelligent traffic shaping with secondary security blocks for sensitive authentication routes.
- **Path Cloaking**: Automated rejection of requests targeting sensitive dotfiles (.git, .env, .aws, .ssh).
- **Enhanced Headers**: Strict HSTS enforcement, X-Frame-Options (DENY), and Cross-Origin-Opener-Policy (COOP) for threat mitigation.
- **DNS Hardening**: Disabled DNS prefetching to eliminate secondary exfiltration vectors.

---

## OPERATIONAL PROTOCOL

### DOCKER DEPLOYMENT (Recommended)
```bash
# Initialize the industrial cluster (LB + App Nodes)
docker-compose up --build
```
*The ecosystem will be accessible at http://localhost (Port 80).*

### LOCAL DEVELOPMENT
```bash
# Dependency acquisition
npm install

# Client generation
npx prisma generate

# Development runtime
npm run dev
```

---

<div align="center">
**Student Forge Technologies Private Limited — 2026**
*Minimalist Industrial Standard | Engineered for Integrity*
</div>