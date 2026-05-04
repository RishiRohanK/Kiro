import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.schedule.updateMany({
    where: {
      batch: "Batch 1",
      week: {
        contains: "Week 2",
        mode: 'insensitive'
      }
    },
    data: {
      deadline: new Date("2026-05-10T23:59:59Z")
    }
  });

  console.log(`Updated ${result.count} schedule items for Batch 1 Week 2.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
