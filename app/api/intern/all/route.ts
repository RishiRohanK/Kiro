import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const interns = await prisma.user.findMany({
      where: {
        role: Role.INTERN,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(interns);
  } catch (error) {
    console.error("Failed to fetch interns:", error);
    return NextResponse.json({ error: "Failed to fetch interns" }, { status: 500 });
  }
}
