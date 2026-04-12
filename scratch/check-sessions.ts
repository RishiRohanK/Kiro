import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sessions = await prisma.examSession.findMany({
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  })
  console.log(JSON.stringify(sessions, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
