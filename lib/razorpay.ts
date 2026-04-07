import Razorpay from "razorpay";

export const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_id.startsWith("rzp_")) {
        throw new Error("Razorpay Key ID is missing or invalid in environment variables.");
    }

    if (!key_secret) {
        throw new Error("Razorpay Key Secret is missing in environment variables.");
    }

    return new Razorpay({
        key_id,
        key_secret,
    });
};


export const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder").trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || "razor_secret_placeholder").trim(),
});

