import fs from 'fs';
import path from 'path';

// Using a local JSON file to persist the administrative password override
// In a full production system, this would be in a secured database.
const AUTH_FILE = path.join(process.cwd(), 'cleed-auth.json');

interface AuthData {
  passwordOverride?: string;
}

export function getCleedPassword(): string {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8')) as AuthData;
      if (data.passwordOverride) {
        return data.passwordOverride;
      }
    }
  } catch (error) {
    console.error("Failed to read CLEED auth file:", error);
  }
  return process.env.CLEED_PASSWORD || "admin123";
}

export function updateCleedPassword(newPassword: string): void {
  try {
    const data: AuthData = { passwordOverride: newPassword };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
    console.log("CLEED password synchronized successfully.");
  } catch (error) {
    console.error("Failed to update CLEED auth file:", error);
    throw new Error("Synchronization failure.");
  }
}
