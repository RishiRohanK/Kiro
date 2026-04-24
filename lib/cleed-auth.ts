import prisma from "@/lib/prisma";

// Using the database (Prisma) to persist administrative settings
// This replaces the temporary local JSON file for industrial-grade synchronization.

export async function getCleedPassword(): Promise<string> {
  try {
    const setting = await prisma.cleedSettings.findUnique({
      where: { settingKey: "admin_password" }
    });
    
    if (setting) {
      return setting.settingValue;
    }
  } catch (error) {
    console.error("Failed to read CLEED settings from database:", error);
  }
  
  // Fallback to environment variable if database entry is missing
  return process.env.CLEED_PASSWORD || "devhacksender@123";
}

export async function updateCleedPassword(newPassword: string): Promise<void> {
  try {
    await prisma.cleedSettings.upsert({
      where: { settingKey: "admin_password" },
      update: { settingValue: newPassword, updatedAt: new Date() },
      create: { 
        id: "cleed_pwd_sync", 
        settingKey: "admin_password", 
        settingValue: newPassword 
      }
    });
    console.log("CLEED password synchronized in database.");
  } catch (error) {
    console.error("Failed to update CLEED settings in database:", error);
    throw new Error("Synchronization failure.");
  }
}
