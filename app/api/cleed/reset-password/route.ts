import { NextResponse } from "next/server";
import { tokenStore } from "@/lib/cleed-tokens";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Security token required" }, { status: 400 });
    }

    const resetData = tokenStore.get(token);

    if (!resetData) {
      return NextResponse.json({ error: "Security token invalid or expired" }, { status: 401 });
    }

    if (Date.now() > resetData.expires) {
      tokenStore.delete(token);
      return NextResponse.json({ error: "Security token expired" }, { status: 401 });
    }

    // In a real application, you would update the database here.
    // For this prototype using .env, we simulate success.
    // To make this permanent, we would need to write to the database.
    console.log(`Password reset successful for ${resetData.email}. New password: ${password}`);

    // Revoke the token
    tokenStore.delete(token);

    return NextResponse.json({ success: true, message: "Administrative access synchronized" });
  } catch (error) {
    return NextResponse.json({ error: "System failure during synchronization" }, { status: 500 });
  }
}
