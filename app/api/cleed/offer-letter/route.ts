import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendOfferLetterEmail, sendCustomOfferLetterEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { internId, offerLetterUrl, customMessage, email } = await req.json();

    if ((!internId && !email) || !offerLetterUrl) {
      return NextResponse.json({ error: "Intern ID/Email and Offer Letter URL are required" }, { status: 400 });
    }

    console.log("Protocol Initiation: Internship Offer Letter Issuance");
    
    let user;
    if (internId) {
      user = await prisma.user.update({
        where: { id: internId },
        data: { offerLetterUrl } as any,
      });
    }

    const recipientEmail = email || user?.email;
    const recipientName = user?.name || "Intern";

    if (customMessage) {
      await sendCustomOfferLetterEmail(recipientEmail, recipientName, offerLetterUrl, customMessage);
    } else if (user) {
      await sendOfferLetterEmail(user.email, user.name);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error sending offer letter:", error);
    return NextResponse.json({ error: "Failed to send internship offer letter" }, { status: 500 });
  }
}
