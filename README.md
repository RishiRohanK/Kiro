<div align="center">

# STUDENT FORGE | LEARN GRID ECOSYSTEM
**Industrial standard internship & assessment infrastructure**

Student Forge is a high-density, secure ecosystem designed for institutional learning and performance tracking. The platform integrates industrial examination terminals, real-time administrative observability, and automated task validation nodes.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Task Submission](/task-submission)

---

### TECHNOLOGY STACK

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) 
![Razorpay](https://img.shields.io/badge/Razorpay-008CFF?style=flat-square&logo=razorpay&logoColor=white)

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
- **Submission Vault**: Centralized repository for UI/UX tasks, technical assignments, and feedback nodes.

### INTERN DIAGNOSTIC PORTAL (/intern)
Performance-centric dashboard for candidate growth tracking.
- **Reporting**: Automated trajectory analysis based on 150-mark quantitative standards.
- **Workflow**: Automated task allocation, schedule synchronization, and attendance tracking.
- **Assets**: Secure distribution of industrial letters and performance certifications.

### PUBLIC TASK ORCHESTRATION (/task-submission)
A specialized endpoint for public task entries with automated synchronization to the Cleed Vault for reviewer validation.

### EDUCATIONAL HUBS
- **Courses & Roadmaps**: Curated learning paths with progress tracking.
- **DSA Mastery**: Data Structures and Algorithms diagnostic nodes.
- **Ideas Hub**: Collaborative terminal for innovation and project ideation.
- **Certifications**: Automated verification system for professional completions.

### HORIZONTAL SCALING & CONTAINERIZATION
The platform implements an industrial-grade containerized cluster with Nginx load balancing.
- **Dockerization**: Integrated multi-stage Docker builds for high-performance production runtimes.
- **Load Balancing**: Nginx entry point with `ip_hash` to ensure sticky Socket.io sessions across multiple app nodes.
- **Scaling**: Optimized for horizontal scalability by deploying dual application nodes within a dedicated bridge network.

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

### DATABASE SYNCHRONIZATION
```bash
# Push schema updates to live DB
npx prisma db push
```

---

## SECURITY ARCHITECTURE
The system operates on a zero-trust model. Competitive evaluation data and sensitive proctoring logs are isolated within the backend runtime. Client-side interactions are strictly limited to presentation and secure data entry via validated endpoints.

---

<div align="center">
**Student Forge Technologies Private Limited — 2026**
*Minimalist Industrial Standard | Engineered for Integrity*
</div>