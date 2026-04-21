import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
          id: true,
          name: true,
          email: true,
          handRaised: true,
          letterUrl: true,
          offerLetterUrl: true,
          isApproved: true,
          college: true,
          year: true,
          department: true,
          dob: true,
          graduationYear: true,
          interestedArea: true,
          profileImage: true,
          batch: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
