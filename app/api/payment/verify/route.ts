import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      formData
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!secret) {
      throw new Error("Missing RAZORPAY_KEY_SECRET. Security check aborted.");
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      
      const enrollment = await prisma.courseEnrollment.create({
        data: {
          courseId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          college: formData.college,
          branch: formData.branch,
          year: formData.year,
          whyJoin: formData.whyJoin,
          
          paymentMethod: "RAZORPAY",
          amount: formData.amount.toString(),
          
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          
          status: "captured"
        }
      });

      return NextResponse.json({ success: true, enrollment });
    } else {
      console.warn("Razorpay Signature Mismatch");
      
      
      await prisma.failedTransaction.create({
        data: {
          courseId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount.toString(),
          paymentMethod: "RAZORPAY",
          reason: "Signature verification failed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          errorDetails: { generated: generatedSignature, provided: razorpay_signature }
        }
      });

      return NextResponse.json(
        { success: false, error: "Signature verification failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    
    try {
      const body = await req.json().catch(() => ({}));
      await prisma.failedTransaction.create({
        data: {
          courseId: body.courseId,
          name: body.formData?.name,
          email: body.formData?.email,
          phone: body.formData?.phone,
          amount: body.formData?.amount?.toString(),
          reason: error.message || "Unknown error during verification",
          razorpayOrderId: body.razorpay_order_id,
          razorpayPaymentId: body.razorpay_payment_id,
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
