import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    
    const enrollments = await prisma.courseEnrollment.findMany({
      include: {
        course: {
          select: {
            title: true,
            level: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    
    const failedTransactions = await prisma.failedTransaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    
    const orderCounts: Record<string, number> = {};
    enrollments.forEach((e: any) => {
      const orderId = e.razorpayOrderId || e.referenceId || "none";
      if (orderId !== "none") {
        orderCounts[orderId] = (orderCounts[orderId] || 0) + 1;
      }
    });

    
    const enrollmentData = enrollments.map(e => ({
      status: e.status,
      amount: e.amount,
      orderId: e.razorpayOrderId || e.referenceId || "N/A",
      orderCount: orderCounts[e.razorpayOrderId || e.referenceId || "none"] || 1,
      timestamp: e.createdAt,
      products: `${e.course?.title} (${e.course?.level})`,
      type: "enrollment"
    }));

    
    const failedData = failedTransactions.map((f: any) => ({
      status: "failed",
      amount: f.amount || "0",
      orderId: f.razorpayOrderId || "N/A",
      orderCount: 1,
      timestamp: f.createdAt,
      products: `Payment Error: ${f.reason || "Unknown reason"}`,
      type: "failed"
    }));

    
    const data = [...enrollmentData, ...failedData].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Payment Gateway API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  } finally {
    
  }
}
