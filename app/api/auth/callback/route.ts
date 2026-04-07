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
              
            }
          },
        },
      }
    );
    
    
    const { data: { user: sbUser }, error: sbError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sbUser && !sbError) {
      
      const existingUser = await prisma.user.findUnique({
        where: { email: sbUser.email! }
      });

      if (!existingUser) {
        
        const newUser = await prisma.user.create({
          data: {
            name: sbUser.user_metadata.full_name || sbUser.email!.split('@')[0],
            email: sbUser.email!,
            password: "OAUTH_LOGIN", 
            role: Role.INTERN,
            batch: "Batch 2",
            college: "Google Registered Intern",
            isApproved: false 
          }
        });
        
        
        const response = NextResponse.redirect(new URL("/intern/dashboard", request.url));
        
        return response;
      }
    }
  }

  
  return NextResponse.redirect(new URL("/intern/dashboard", request.url));
}
