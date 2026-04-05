
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const batch2Interns = await prisma.user.findMany({
    where: { batch: 'Batch 2' },
    select: { name: true, createdAt: true }
  })
  console.log('Batch 2 Interns createdAt dates:')
  console.table(batch2Interns.map(i => ({ name: i.name, createdAt: i.createdAt.toISOString() })))
  
  const allDates = await prisma.attendance.groupBy({ by: ['date'] })
  console.log('Unique Attendance Dates:')
  console.log(allDates.map(d => d.date.toISOString()).sort())
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
