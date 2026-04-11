import prisma from "../lib/prisma.js";

async function checkModels() {
  console.log("Prisma keys:", Object.keys(prisma));
  process.exit(0);
}

checkModels().catch(err => {
  console.error(err);
  process.exit(1);
});
