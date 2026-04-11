import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    const status = await prisma.examStatus.findUnique({
      where: { id: "global_exam_state" },
    });

    if (!status) {
        return NextResponse.json({ success: false, error: "Global status node not found." }, { status: 404 });
    }

    if (status.exitKey !== key) {
        return NextResponse.json({ success: false, error: "Invalid exit key." }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify key" }, { status: 500 });
  }
}
