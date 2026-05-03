import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // 1-12
    const year = searchParams.get("year"); 
    
    if (!month || !year) {
      return NextResponse.json({ error: "Month and Year required" }, { status: 400 });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            batch: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Monthly Attendance Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
