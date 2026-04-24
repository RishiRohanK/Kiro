import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateCleedPassword } from "@/lib/cleed-auth";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Security token required" }, { status: 400 });
    }

    // Verify token from database for stateless recovery
    const resetData = await prisma.resetToken.findUnique({
      where: { token }
    });

    if (!resetData) {
      return NextResponse.json({ error: "Security token invalid or expired" }, { status: 401 });
    }

    if (new Date() > resetData.expires) {
      await prisma.resetToken.delete({ where: { token } }).catch(() => {});
      return NextResponse.json({ error: "Security token expired" }, { status: 401 });
    }

    // Persist the new password
    await updateCleedPassword(password);
    console.log(`Password reset successful for ${resetData.email}.`);

    // Revoke the token from database
    await prisma.resetToken.delete({ where: { token } }).catch(() => {});

    return NextResponse.json({ success: true, message: "Administrative access synchronized" });
  } catch (error) {
    return NextResponse.json({ error: "System failure during synchronization" }, { status: 500 });
  }
}
