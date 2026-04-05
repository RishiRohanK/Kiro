
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
        attendances: true
      }
    }),
    prisma.attendance.groupBy({ by: ['date'] })
  ]);

  console.log(`Boosting ${interns.length} Batch 2 interns to 100% since their join dates...`);
  
  let recordsUpdated = 0;
  let recordsCreated = 0;

  for (const intern of interns) {
    const internCreationDate = new Date(intern.createdAt);
    internCreationDate.setHours(0,0,0,0);
    
    for (const d of allDates) {
       const sessionDate = new Date(d.date);
       sessionDate.setHours(0,0,0,0);
       
       if (sessionDate >= internCreationDate) {
          const existing = intern.attendances.find(a => {
             const existingDate = new Date(a.date);
             existingDate.setHours(0,0,0,0);
             return existingDate.getTime() === sessionDate.getTime();
          });
          
          if (existing) {
             if (existing.status !== 'PRESENT' && existing.status !== 'LATE') {
                await prisma.attendance.update({
                   where: { id: existing.id },
                   data: { 
                      status: 'PRESENT',
                      workSummary: (existing.workSummary || '') + ' [System Adjustment - Batch 2 Protocol]'
                   }
                });
                recordsUpdated++;
             }
          } else {
             await prisma.attendance.create({
                data: {
                   userId: intern.id,
                   date: d.date,
                   status: 'PRESENT',
                   workSummary: 'System Adjustment - Batch 2 Protocol (Populated missing session)'
                }
             });
             recordsCreated++;
          }
       }
    }
  }

  console.log(`Update complete. Records Updated: ${recordsUpdated}, Records Created: ${recordsCreated}.`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
