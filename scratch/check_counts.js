const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = {
    feedback: await prisma.feedback.count(),
    uiux: await prisma.uIUXSubmission.count(),
    weekly: await prisma.scheduleSubmission.count(),
    publicTasks: await prisma.taskSubmission.count(),
  };
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
