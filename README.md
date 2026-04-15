<div align="center">

# STUDENT FORGE | LEARN GRID ECOSYSTEM
**Version 2.7.0 — Task Orchestration & Industrial Assessment**

Student Forge is a secure, high-fidelity internship and learning management ecosystem. 
Engineered for performance, the platform implements an industrial-grade examination terminal, performance analytics, and a centralized administrative command center.

[**Documentation**](/docs) • [**Intern Portal**](/intern/signin) • [**Admin Dashboard**](/cleed/dashboard) • [**Task Submission**](/task-submission)

---

### 🛡️ TECH STACK

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
<br/>
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) 
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) 
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) 
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
<br/>
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-61DAFB?style=for-the-badge&logo=lucide&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

</div>

---

## 🏗️ CORE SYSTEM ARCHITECTURE

### 1. Secure Examination Terminal (`/exams`)
An industrial-standard assessment engine synchronized with Professional protocols.
- **Marking Standard**: +3 for correct nodes, -1 for negative evaluations.
- **Security Integrity**: Full-screen enforcement, violation logging, and server-side evaluation.

### 2. Cleed Command Center (`/cleed/dashboard`)
The administrative central unit of the ecosystem.
- **Real-time Monitoring**: Observability of active sessions and violation counts.
- **Submissions Vault**: Centralized verification for all technical and weekly intern tasks.

### 3. Intern Analytics Dashboard (`/intern/dashboard`)
Diagnostic reporting with graphical trajectory nodes and performance metrics based on a 150-mark standard.

### 4. Public Task Submission (`/task-submission`)
A streamlined node for external task entries with automated synchronization to the vault.

---

## 🚀 INSTALLATION PROTOCOL

### Development Environment
```bash
# Requisite: Node node_modules installation
npm install

# Prisma client regeneration
npx prisma generate

# Execution via Turbopack / TSX
npm run dev
```

### Database Synchronization
Ensure the PostgreSQL environment is active, then synchronize the schema:
```bash
npx prisma db push
```

---

## 🛡️ ZERO-TRUST SECURITY MODEL
Student Forge operates on a zero-trust architecture for assessment data. All evaluation nodes (`CORRECT_ANSWERS`) are isolated within the backend environment, ensuring the client layer only processes question text and never the evaluation keys.

---

### 📜 VERSION LOG (v2.7.0)
- **New**: Integrated **Public Task Submission** page with vault synchronization.
- **New**: Added **Submission records** filter system in Cleed Dashboard.
- **Fix**: Resolved Prisma client state synchronization in local dev environments.
- **Update**: Standardized UI typography for minimalist industrial aesthetics.

---
<div align="center">
**Student Forge Technologies Private Limited © 2026**<br/>
*Minimalist industrial standard | Engineered for integrity*
</div>