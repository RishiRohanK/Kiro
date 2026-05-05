<div align="center">

# Kiro LMS
**MVP Stage - Developed by Redlix Systems**

Kiro LMS is a high-performance Learning Management System with background processing for reliable task management.

[Documentation](/docs) • [Intern Portal](/intern/signin) • [Cleed Dashboard](/cleed/dashboard) • [Security Logs](/admin/logs)

---

## Technology Stack

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-FF4500?style=for-the-badge&logo=bull&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | Next.js | Modern framework for fast web apps |
| **Frontend** | React | Library for building user interfaces |
| **Language** | TypeScript | Type-safe programming |
| **Styling** | Tailwind CSS | Utility-first CSS for design |
| **Animations** | Framer Motion | Smooth animations and transitions |
| **Database** | PostgreSQL | Relational database for storing data |
| **ORM** | Prisma | Database tool and migrations |
| **Caching** | Redis | Fast data caching and session storage |
| **Queueing** | BullMQ | Background job and message queue |
| **Real-time** | Socket.io | Real-time chat and monitoring |
| **Auth** | Supabase | Secure login and authentication |
| **Mailing** | Nodemailer | Sending emails and onboarding info |
| **Payments** | Razorpay | Handling financial transactions |
| **DevOps** | Docker | Container system for easy deployment |

</div>

---

## Background Processing (BullMQ + Redis)

The system uses BullMQ and Redis to handle tasks like sending emails and notifications in the background.

### Worker Management
To handle background jobs, you must run the workers separately from the main server:

```bash
# Start Email Worker
npm run worker:email

# Start Notification Worker
npm run worker:notification
```

### Queue Architecture
- **Email Queue**: Handles all system emails like onboarding and password resets.
- **Notification Queue**: Handles live alerts and push notifications.

---

## Deployment Protocol

### Docker Deployment
The system is ready for Docker and includes Redis and PostgreSQL setup.

```bash
# Start the system
docker-compose up --build
```
The app will be available at http://localhost (Port 80).

### Local Development
```bash
# Install dependencies
npm install

# Generate database client
npx prisma generate

# Run development server
npm run dev
```

---

<div align="center">
**Redlix Systems — 2026**
*Kiro LMS | Minimalist Standard | Built for Integrity*
</div>