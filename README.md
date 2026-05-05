<div align="center">

# KIRO LMS
**MVP Stage - Developed by Redlix Systems**

Kiro LMS is a high-performance Learning Management System with integrated background processing for industrial-scale reliability.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Security Logs](/admin/logs)

---

## TECHNOLOGY STACK

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=bull&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## BACKGROUND PROCESSING (BULLMQ + REDIS)

The system uses BullMQ and Redis for high-reliability background tasks (e.g., email dispatch, notifications).

### Worker Management
To handle background jobs, you must run the dedicated workers separately from the Next.js server:

```bash
# Start Email Worker
npm run worker:email

# Start Notification Worker
npm run worker:notification
```

### Queue Architecture
- **Email Queue**: Processes all system communications (onboarding, password resets, offer letters).
- **Notification Queue**: Handles real-time system alerts and push notifications.

---

## DEPLOYMENT PROTOCOL

### DOCKER DEPLOYMENT
The ecosystem is optimized for containerized environments including localized Redis and PostgreSQL nodes.

```bash
# Initialize the industrial cluster
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
```

---

<div align="center">
**Redlix Systems — 2026**
*Kiro LMS | Minimalist Standard | Engineered for Integrity*
</div>