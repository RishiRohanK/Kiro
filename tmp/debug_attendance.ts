
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const intern = await prisma.user.findFirst({
    where: { name: { contains: 'PRABHAVDATH' } },
    include: { attendances: true }
  })
  
  if (!intern) return;
  console.log(`Presence for ${intern.name} (Joined: ${intern.createdAt.toISOString()}):`);
  console.table(intern.attendances.map(a => ({ date: a.date.toISOString(), status: a.status })));
  
  const allDates = await prisma.attendance.groupBy({ by: ['date'] });
  const relevant = allDates.filter(d => d.date >= intern.createdAt);
  console.log('Global relevant dates:');
  console.table(relevant.map(d => ({ date: d.date.toISOString() })));
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
