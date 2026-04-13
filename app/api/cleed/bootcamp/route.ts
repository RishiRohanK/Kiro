import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const registrations = await prisma.bootcampRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, registrations }, { status: 200 });
  } catch (error) {
    console.error("Cleed Bootcamp Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const registration = await prisma.bootcampRegistration.update({
      where: { id },
      data: { paymentStatus: status },
    });
    return NextResponse.json({ success: true, registration }, { status: 200 });
  } catch (error) {
    console.error("Cleed Bootcamp Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await prisma.bootcampRegistration.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Cleed Bootcamp Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
