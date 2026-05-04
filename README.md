<div align="center">

# STUDENT FORGE | PLATFORM ECOSYSTEM
**Industrial standard internship & assessment infrastructure**

Student Forge is a high-density, secure ecosystem designed for institutional learning and performance tracking. The platform integrates industrial examination terminals, real-time administrative observability, and automated task validation nodes.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Security Logs](/admin/logs)

---

---

## 🛠️ TECHNOLOGY STACK

The Student Forge platform is built on a high-performance, modern industrial stack designed for scalability and reliability.

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.2 (Turbopack) | Industrial-grade SSR/ISR framework with React 19 support |
| **Language** | TypeScript 5 | Strict-type safety for mission-critical logic |
| **Styling** | Tailwind CSS 4 | Atomic utility-first styling with hardware-accelerated transitions |
| **Animations** | Framer Motion 12 | Fluid, high-fidelity micro-interactions and layout transitions |
| **Database** | PostgreSQL | Robust relational engine via Prisma 7.5 ORM |
| **Authentication** | Supabase Auth / SSR | Zero-trust authentication with secure session state |
| **Real-time** | Socket.io 4.8 | Low-latency bi-directional communication for chat and live monitoring |
| **Caching** | Redis (ioredis) | High-speed data caching and rate-limiting infrastructure |
| **Mailing** | Nodemailer | Automated industrial notification and onboarding engine |
| **Payments** | Razorpay | Secure financial transaction gateway integration |
| **Deployment** | Vercel | High-availability serverless deployment with automated CI/CD |

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