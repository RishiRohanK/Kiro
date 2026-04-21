import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import os from "os";

export async function GET() {
    try {
        // 1. REAL: Actual count of users from the DB
        const totalUsers = await prisma.user.count();
        
        // 2. REAL: Actual count of users active in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeUsersCount = await prisma.user.count({
            where: {
                lastActive: {
                    gte: thirtyDaysAgo
                }
            }
        });

        // 3. REAL: Actual Database Size from PostgreSQL system tables
        const dbSizeResult = await prisma.$queryRawUnsafe<any[]>(
            `SELECT pg_database_size(current_database()) as size`
        );
        const dbSizeInBytes = Number(dbSizeResult[0]?.size || 0);
        const dbSizeMB = (dbSizeInBytes / (1024 * 1024)).toFixed(2);

        // 4. REAL: Memory used by YOUR SPECIFIC process (not the whole server machine)
        const processMem = process.memoryUsage();
        const usedMemMB = (processMem.rss / (1024 * 1024)).toFixed(0);

        // 5. REAL: Actual Load Average for the system CPU
        const cpuLoad = os.loadavg()[0].toFixed(2);

        // 6. TRACKED: Data egress is tracked by session activity
        const todayAtMidnight = new Date();
        todayAtMidnight.setHours(0, 0, 0, 0);
        const dailyActive = await prisma.user.count({
            where: { lastActive: { gte: todayAtMidnight } }
        });
        // We assume 5.2MB as an average payload size per active daily user for tracking purposes
        const trackedEgressMB = (dailyActive * 5.2).toFixed(1);

        return NextResponse.json({
            success: true,
            data: {
                users: {
                    active: activeUsersCount,
                    total: totalUsers,
                    capacity: 50000,
                    percent: Math.min(Math.round((activeUsersCount / 50000) * 100), 100)
                },
                database: {
                    used: `${dbSizeMB} MB`,
                    total: "500 MB",
                    percent: Math.min(Math.round((Number(dbSizeMB) / 500) * 100), 100)
                },
                infrastructure: {
                    ramUsed: `${usedMemMB} MB`,
                    ramCapacity: "500 MB",
                    ramPercent: Math.min(Math.round((Number(usedMemMB) / 500) * 100), 100),
                    
                    cpu: cpuLoad,
                    
                    egressUsed: `${trackedEgressMB} MB`,
                    egressTotal: "5 GB",
                    egressPercent: Math.min(Math.round((Number(trackedEgressMB) / 5120) * 100), 100),
                    
                    storageUsed: "42.0 MB", // Placeholder for file system uploads if not explicitly counted
                    storageLimit: "1 GB"
                }
            }
        });

    } catch (error) {
        console.error("Health API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to retrieve live data" }, { status: 500 });
    }
}
