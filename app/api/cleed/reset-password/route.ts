import { NextResponse } from "next/server";
import { tokenStore } from "@/lib/cleed-tokens";
import { updateCleedPassword } from "@/lib/cleed-auth";

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

    // Persist the new password
    updateCleedPassword(password);
    console.log(`Password reset successful for ${resetData.email}.`);

    // Revoke the token
    tokenStore.delete(token);

    return NextResponse.json({ success: true, message: "Administrative access synchronized" });
  } catch (error) {
    return NextResponse.json({ error: "System failure during synchronization" }, { status: 500 });
  }
}
