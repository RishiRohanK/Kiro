import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { 
      userId, 
      name, 
      college, 
      examExperience, 
      upgradeSuggestions, 
      learningGoals 
    } = await req.json();

    if (!userId || !name || !college) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create feedback record
    await prisma.feedback.create({
      data: {
        userId,
        name,
        college,
        examExperience,
        upgradeSuggestions,
        learningGoals
      }
    });

    // Update user status
    await prisma.user.update({
      where: { id: userId },
      data: { hasSubmittedFeedback: true }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
