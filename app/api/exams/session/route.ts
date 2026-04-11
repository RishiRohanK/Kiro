import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CORRECT_ANSWERS } from "@/lib/exam-questions";

export async function GET() {
  try {
    const sessions = await prisma.examSession.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            id: true
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch exam sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const session = await prisma.examSession.upsert({
      where: { userId },
      update: { 
        status: "STARTED",
        startedAt: new Date(),
        score: null,
        violations: 0
      },
      create: { 
        userId,
        status: "STARTED",
        startedAt: new Date()
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Failed to start exam session" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId, status, score: clientScore, violations, answers, questionMapping } = await req.json();

    let finalScore = clientScore;

    // Server-side scoring logic to prevent cheating
    if (status === "SUBMITTED" && answers && questionMapping) {
      let calcScore = 0;
      // Object.entries(answers) where key is currentIdx and value is optionIdx
      Object.entries(answers).forEach(([idxStr, chosenOpt]: [string, any]) => {
        const idx = parseInt(idxStr);
        const originalQuestion = questionMapping[idx]; 
        if (originalQuestion && chosenOpt !== undefined) {
          const correctOpt = (CORRECT_ANSWERS as any)[originalQuestion.id];
          if (chosenOpt === correctOpt) {
            calcScore += 3;
          } else {
            calcScore -= 1;
          }
        }
      });
      finalScore = calcScore;
    }

    const session = await prisma.examSession.update({
      where: { userId },
      data: { 
        status, 
        score: finalScore, 
        violations,
        updatedAt: new Date()
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update exam session" }, { status: 500 });
  }
}
