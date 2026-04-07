import { getRazorpayInstance } from "@/lib/razorpay";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
    const { amount, courseId, name } = body;
    console.log("Creating Razorpay Order for amount:", amount, "Course:", courseId);
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay API Keys are missing in Environment Variables");
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        courseId,
        studentName: name
      },
    });

    console.log("Order created successfully:", order.id);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);

    try {
      await prisma.failedTransaction.create({
        data: {
          courseId: body.courseId,
          name: body.name,
          email: body.email,
          phone: body.phone,
          amount: body.amount?.toString(),
          paymentMethod: "RAZORPAY",
          reason: `Order Creation Failed: ${error.message}`,
          errorDetails: { stack: error.stack }
        }
      });
    } catch (logError) {
      console.error("Failed to log failed transaction:", logError);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
