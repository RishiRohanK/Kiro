import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, college, branch, year, phone, email, whyJoin, transactionId } = body;

    if (!name || !college || !branch || !year || !phone || !email || !transactionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const registration = await prisma.bootcampRegistration.create({
      data: {
        name,
        college,
        branch,
        year,
        phone,
        email,
        whyJoin: whyJoin || null,
        transactionId,
        paymentStatus: "paid"
      },
    });

    return NextResponse.json(
      { message: "Registration successful", registration },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bootcamp Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
