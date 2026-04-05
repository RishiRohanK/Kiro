
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const today = '2026-04-05Z'; // Simplified for this check
  const batch2Interns = await prisma.user.findMany({
    where: { batch: 'Batch 2', role: 'INTERN' },
    include: {
      attendances: {
        where: { date: { gte: new Date('2026-04-05T00:00:00Z'), lt: new Date('2026-04-06T00:00:00Z') } }
      }
    }
  })
  
  const absentToday = batch2Interns.filter(i => i.attendances.length === 0);
  console.log(`Batch 2 interns absent today (2026-04-05): ${absentToday.length}`);
  console.table(absentToday.map(i => ({ name: i.name })));
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
