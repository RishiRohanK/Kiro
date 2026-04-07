import { start } from "workflow/api";
import { handleUserSignup } from "@/workflows"; 
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    
    await start(handleUserSignup, [email]);

    return NextResponse.json({
      message: "User signup workflow started",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
