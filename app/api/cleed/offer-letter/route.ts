import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { emailQueue } from "@/queues/emailQueue";

export async function POST(req: Request) {
  try {
    const { internId, offerLetterUrl, customMessage, email, name } = await req.json();

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
    const recipientName = name || user?.name || "Intern";

    if (customMessage) {
      await emailQueue.add("custom-offer-letter", {
        type: "custom-offer-letter",
        data: { email: recipientEmail, name: recipientName, offerLetterUrl, customMessage }
      });
    } else if (user) {
      await emailQueue.add("offer-letter", {
        type: "offer-letter",
        data: { email: user.email, name: user.name }
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error sending offer letter:", error);
    return NextResponse.json({ error: "Failed to send internship offer letter" }, { status: 500 });
  }
}
