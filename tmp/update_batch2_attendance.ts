
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
        attendances: { select: { date: true } }
      }
    }),
    prisma.attendance.groupBy({ by: ['date'] })
  ]);

  console.log(`Processing ${interns.length} Batch 2 interns to fill missing attendance records...`);
  
  let totalCreated = 0;

  for (const intern of interns) {
    const internCreationDate = new Date(intern.createdAt);
    internCreationDate.setHours(0,0,0,0);
    
    // Find sessions they missed since they joined
    const missedDates = allDates.filter(d => {
       const sessionDate = new Date(d.date);
       sessionDate.setHours(0,0,0,0);
       
       const isExisting = intern.attendances.some(a => {
          const existingDate = new Date(a.date);
          existingDate.setHours(0,0,0,0);
          return existingDate.getTime() === sessionDate.getTime();
       });
       
       return sessionDate >= internCreationDate && !isExisting;
    });

    if (missedDates.length > 0) {
       for (const d of missedDates) {
          await prisma.attendance.create({
             data: {
                userId: intern.id,
                date: d.date,
                status: 'PRESENT',
                workSummary: 'Internal mission synchronization (Batch 2 adjustment)'
             }
          });
          totalCreated++;
       }
       console.log(`Populated ${missedDates.length} missing days for ${intern.name}`);
    }
  }

  console.log(`Update complete. Total ${totalCreated} attendance records created.`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
