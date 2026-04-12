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

    const et = "UI_UX"; // Default track for new sessions
    const session = await prisma.examSession.upsert({
      where: { 
        userId_examType: { userId, examType: et } 
      },
      update: { 
        status: "STARTED",
        startedAt: new Date(),
        score: null,
        violations: 0,
        answers: null,
        questionMapping: null
      },
      create: { 
        userId,
        examType: et,
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
    const payload = await req.json();
    const { 
      userId, 
      status, 
      score: clientScore, 
      violations, 
      answers, 
      questionMapping, 
      typedExitKey,
      allowSystemOverride, // New flag for auto-submissions
      examType
    } = payload;
    
    console.log(`[API] Syncing session for User: ${userId}, Status: ${status}, Override: ${allowSystemOverride}`);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const globalSecurity = await prisma.examSecurity.findUnique({
      where: { id: "global_exam_security" }
    });

    if (!globalSecurity) {
      return NextResponse.json({ error: "Global Security Node not found." }, { status: 404 });
    }

    // Security Exit Key Check for Submission
    // Bypass if allowSystemOverride is true (e.g. timeout or forced exit)
    if (status === "SUBMITTED" && !allowSystemOverride) {
        if (!typedExitKey || typedExitKey !== globalSecurity.exitKey) {
            console.error(`[API] Submission blocked: Invalid key for user ${userId}`);
            return NextResponse.json({ error: "Invalid Security Exit Key" }, { status: 403 });
        }
    }

    let finalScore = clientScore;

    // Server-side scoring logic to prevent cheating
    if (status === "SUBMITTED" && answers && questionMapping) {
      let calcScore = 0;
      Object.entries(answers).forEach(([idxStr, chosenOpt]: [string, any]) => {
        const idx = parseInt(idxStr);
        const originalQuestion = (questionMapping as any)[idx]; 
        if (originalQuestion && originalQuestion.type === 'mcq' && chosenOpt !== undefined && chosenOpt !== null) {
          const correctOpt = (CORRECT_ANSWERS as any)[originalQuestion.id];
          if (correctOpt !== undefined && chosenOpt === correctOpt) {
            calcScore += 2;
          }
        }
      });
      finalScore = calcScore;
    }

    // Ensure violations is a number
    const finalViolations = typeof violations === 'number' ? violations : 0;

    try {
      const et = examType || "FULLSTACK";
      const session = await prisma.examSession.upsert({
        where: { 
          userId_examType: { userId, examType: et } 
        },
        create: {
          userId,
          examType: et,
          status, 
          score: finalScore, 
          violations: finalViolations,
          answers: answers || null,
          questionMapping: questionMapping || null,
        },
        update: { 
          status, 
          score: finalScore, 
          violations: finalViolations,
          answers: answers || null,
          questionMapping: questionMapping || null,
          updatedAt: new Date()
        },
      });

      console.log(`[API] Session updated: ${userId} -> ${status}`);
      return NextResponse.json(session);
    } catch (dbError: any) {
      console.error(`[API] Database Update Error for ${userId}:`, dbError.message);
      return NextResponse.json({ 
        error: "Database update failed", 
        details: dbError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("PATCH /api/exams/session Global Error:", error.message);
    return NextResponse.json({ 
      error: "Internal Server Error", 
      details: error.message 
    }, { status: 500 });
  }
}
