
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const [interns, allDates] = await Promise.all([
    prisma.user.findMany({
      where: { role: "INTERN", batch: "Batch 2" },
      include: {
        attendances: {
          select: { status: true, date: true }
        }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.attendance.groupBy({
      by: ['date']
    })
  ]);

  const results = interns.map(intern => {
    const presentCount = intern.attendances.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    
    const internCreationDate = new Date(intern.createdAt);
    internCreationDate.setHours(0, 0, 0, 0);

    const relevantDays = allDates.filter(d => {
       const sessionDate = new Date(d.date);
       sessionDate.setHours(0, 0, 0, 0);
       return sessionDate >= internCreationDate;
    });

    const relevantDaysCount = relevantDays.length;
    const percentage = relevantDaysCount > 0 ? (presentCount / relevantDaysCount) * 100 : 0;
    
    return {
      name: intern.name,
      joined: intern.createdAt.toISOString().split('T')[0],
      present: presentCount,
      totalTracked: relevantDaysCount,
      percentage: Math.round(percentage) + '%'
    };
  });

  console.log('Attendance Report for Batch 2 (Fair Calculation):');
  console.table(results);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
