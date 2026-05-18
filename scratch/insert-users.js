const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const usersToInsert = [
  {
    name: 'P. Vishnu Vardhan',
    email: 'podilivishnuvardhan24@gmail.com',
  },
  {
    name: 'S. Vamsi',
    email: 'vamsisaripalli7@gmail.com',
  },
  {
    name: 'D. Ram Ganesh',
    email: 'ramganeshdintakurthi@gmail.com',
  },
  {
    name: 'K. Pavan',
    email: 'pavankuppili93@gmail.com',
  }
];

async function main() {
  console.log('Starting user insertion...');
  
  // Hash the default password 'StudentForge2026!'
  const defaultPassword = 'StudentForge2026!';
  console.log(`Hashing default password "${defaultPassword}"...`);
  const hashedPassword = await bcrypt.hash(defaultPassword, 12);
  
  for (const user of usersToInsert) {
    try {
      console.log(`Inserting user: ${user.name} (${user.email})...`);
      
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: 'INTERN',
          isApproved: true,
          batch: 'Batch 3',
        },
        create: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: 'INTERN',
          isApproved: true,
          batch: 'Batch 3',
        }
      });
      
      console.log(`Successfully upserted: ${createdUser.name} (ID: ${createdUser.id})`);
    } catch (err) {
      console.error(`Failed to insert ${user.name}:`, err.message);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
