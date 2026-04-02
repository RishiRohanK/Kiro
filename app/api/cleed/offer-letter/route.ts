import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOfferLetterEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { internId, offerLetterUrl } = await req.json();

    if (!internId || !offerLetterUrl) {
      return NextResponse.json({ error: "Intern ID and Offer Letter URL are required" }, { status: 400 });
    }

    console.log("Protocol Initiation: Internship Offer Letter Issuance for intern:", internId);
    
    // Update Database
    const user = await prisma.user.update({
      where: { id: internId },
      data: { offerLetterUrl } as any,
    });

    // Send Notification Email
    await sendOfferLetterEmail(user.email, user.name);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error sending offer letter:", error);
    return NextResponse.json({ error: "Failed to send internship offer letter" }, { status: 500 });
  }
}
