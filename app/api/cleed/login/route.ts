import { NextResponse } from "next/server";
import { getCleedPassword } from "@/lib/cleed-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cleedEmail = process.env.CLEED_EMAIL;
    const cleedPassword = getCleedPassword();

    if (email === cleedEmail && password === cleedPassword) {
       const response = NextResponse.json({ success: true, user: { email, role: "CLEED" } });
       
       
       response.cookies.set("cleed_session", "authenticated_admin", {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "strict",
         maxAge: 60 * 60 * 12, 
         path: "/",
       });
       
       return response;
    }

    return NextResponse.json({ error: "Invalid administrative credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
