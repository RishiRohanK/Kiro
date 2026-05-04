import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, teamNumber, teamMembers, githubLink, liveLink } = await req.json();

    if (!userId || !teamNumber || !teamMembers || !githubLink || !liveLink) {
      return NextResponse.json({ error: "Missing required fields. All fields are mandatory." }, { status: 400 });
    }

    const submission = await prisma.week2Submission.create({
      data: {
        userId,
        teamNumber,
        teamMembers,
        githubLink,
        liveLink
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error: any) {
    console.error("Week 2 submission error:", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const submission = await prisma.week2Submission.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, submission });
    }

    const submissions = await prisma.week2Submission.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    console.error("Week 2 fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
