import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendBulkCustomEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { internIds, letterUrl } = await req.json();

    if (!internIds || !Array.isArray(internIds) || internIds.length === 0 || !letterUrl) {
      return NextResponse.json({ error: "Active intern array and Certificate URL are required" }, { status: 400 });
    }

    console.log(`Protocol Initiation: Bulk Project Certificate Issuance for ${internIds.length} interns.`);

    // 1. Update many records in database in a single operation
    await prisma.user.updateMany({
      where: { id: { in: internIds } },
      data: { letterUrl },
    });

    // 2. Fetch updated users to dispatch personalized notification emails
    const updatedUsers = await prisma.user.findMany({
      where: { id: { in: internIds } },
      select: { email: true, name: true },
    });

    // 3. Dispatch emails asynchronously (non-blocking in response wait)
    // Run in background so we respond quickly
    Promise.allSettled(
      updatedUsers.map((user) =>
        sendBulkCustomEmail(
          user.email,
          user.name,
          `Project Certificate Issued: ${user.name}`,
          "Project Completion Certificate Ready",
          `Dear ${user.name},<br/><br/>Congratulations! Your official <b>Project Completion Certificate</b> has been successfully issued by Student Forge Technologies.<br/><br/>You can now view, access, and download your certificate directly from your intern dashboard under the Certification section.<br/><br/>Thank you for your valuable technical contributions to our developer ecosystem.`
        )
      )
    ).then((results) => {
      const fulfilled = results.filter((r) => r.status === "fulfilled").length;
      console.log(`Bulk notification emails dispatched successfully for ${fulfilled}/${updatedUsers.length} interns.`);
    });

    return NextResponse.json({ success: true, count: updatedUsers.length });
  } catch (error) {
    console.error("Error sending bulk certificates:", error);
    return NextResponse.json({ error: "Failed to issue bulk project certificates" }, { status: 500 });
  }
}
