import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendBulkCustomEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { internId, letterUrl } = await req.json();

    if (!internId || !letterUrl) {
      return NextResponse.json({ error: "Intern ID and Letter URL are required" }, { status: 400 });
    }

    console.log("Protocol Initiation: Internship Letter Issuance for intern:", internId);
    const user = await prisma.user.update({
      where: { id: internId },
      data: { letterUrl },
    });

    // Send email notification
    try {
      await sendBulkCustomEmail(
        user.email,
        user.name,
        `Project Certificate Issued: ${user.name}`,
        "Project Completion Certificate Ready",
        `Dear ${user.name},<br/><br/>Congratulations! Your official <b>Project Completion Certificate</b> has been successfully issued by Student Forge Technologies.<br/><br/>You can now view, access, and download your certificate directly from your intern dashboard under the Certification section.<br/><br/>Thank you for your valuable technical contributions to our developer ecosystem.`
      );
    } catch (mailErr) {
      console.error("Failed to send certificate notification email:", mailErr);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error sending letter:", error);
    return NextResponse.json({ error: "Failed to send internship letter" }, { status: 500 });
  }
}

