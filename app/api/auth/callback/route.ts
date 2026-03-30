import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );
    
    // Exchange code for session
    const { data: { user: sbUser }, error: sbError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sbUser && !sbError) {
      // Sync user with Prisma database
      const existingUser = await prisma.user.findUnique({
        where: { email: sbUser.email! }
      });

      if (!existingUser) {
        // Create new user record for first-time Google signups
        const newUser = await prisma.user.create({
          data: {
            name: sbUser.user_metadata.full_name || sbUser.email!.split('@')[0],
            email: sbUser.email!,
            password: "OAUTH_LOGIN", // Placeholder for OAuth users
            role: Role.INTERN,
            batch: "Batch 2",
            college: "Google Registered Intern",
            isApproved: false // Manual approval still required
          }
        });
        
        // Pass user info to client local storage via redirect (optional but helpful for dashboard sync)
        const response = NextResponse.redirect(new URL("/intern/dashboard", request.url));
        // We'll let the dashboard handle the local storage sync if the session exists
        return response;
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/intern/dashboard", request.url));
}
