"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    ChevronRight, 
    ArrowLeft, 
    CheckCircle, 
    Loader2, 
    ShieldCheck, 
    Home,
    Send,
    User,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    Clock,
    Lock,
    Eye,
    Ticket,
    CreditCard,
    ArrowRight,
    QrCode,
    XCircle,
    AlertCircle,
    X
} from "lucide-react";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Footer from "../../../components/home/Footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EnrollmentPage() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    
    // Payment specific states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(false);
    const [finalPrice, setFinalPrice] = useState<number>(1499);
    const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "upi">("razorpay");
    const [isRevealed, setIsRevealed] = useState(false);
    const [failureDetails, setFailureDetails] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        college: "",
        branch: "",
        year: "",
        whyJoin: "",
        referenceId: "",
        transactionId: "",
        bankName: "",
        accountName: "",
        amount: "1499"
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${id}`);
                const data = await res.json();
                if (data.success) {
                    setCourse(data.course);
                    const basePrice = parseInt(data.course.price) || 1499;
                    setFinalPrice(basePrice);
                    setFormData(prev => ({ ...prev, amount: basePrice.toString() }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === "INTERN26") {
            setAppliedCoupon(true);
            setFinalPrice(999);
            setFormData(prev => ({ ...prev, amount: "999" }));
            setError("");
        } else {
            setError("Invalid coupon code.");
            setAppliedCoupon(false);
            setFinalPrice(parseInt(course?.price) || 1499);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone || !formData.college || !formData.branch || !formData.year) {
                setError("Please fill all required fields.");
                return;
            }
        }
        setError("");
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo(0, 0);
    };

    const handleRazorpayPayment = async () => {
        setSubmitting(true);
        setError("");
        try {
            const orderRes = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: finalPrice,
                    courseId: id,
                    name: formData.name
                })
            });
            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error(orderData.error);

            if (!window.Razorpay) {
              throw new Error("Razorpay script not loaded yet. Please wait a moment.");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RQUvSCLKCFnWZH",
                amount: orderData.order.amount,
                currency: "INR",
                name: "HDFC Collect Now via Razorpay",
                description: `Academy Enrollment: ${course?.title}`,
                order_id: orderData.order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            courseId: id,
                            formData: { ...formData, amount: finalPrice }
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setStep(4);
                    } else {
                        setFailureDetails({ description: verifyData.error || "Verification failed" });
                        alert("Transaction Failed: " + (verifyData.error || "Verification failed"));
                        setStep(5);
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#111827" }
            };

            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response: any) {
                setFailureDetails(response.error);
                alert("Transaction Failed: " + (response.error.description || "The payment was not successful."));
                setStep(5);
            });

            rzp.open();
        } catch (err: any) {
             console.error("Payment Step Error:", err);
             setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch("/api/courses/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: id,
                    ...formData,
                    amount: finalPrice.toString()
                })
            });
            const data = await res.json();
            if (data.success) {
                setStep(4);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    const upiId = "6302933597@hdfc";
    const upiName = "HDFC Collect Now via Razorpay";
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${finalPrice}&cu=INR`;
    const qrSource = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

    if (loading) return (
        <div className="h-screen bg-white flex items-center justify-center text-zinc-300">
            <Loader2 className="w-8 h-8 animate-spin" strokeWidth={1.5} />
        </div>
    );

    if (step === 5) {
        return (
            <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 relative">
                {/* Critical Status Banner */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[100]" />
                <div className="fixed top-1 left-0 right-0 bg-red-50 border-b border-red-100 py-3 px-6 z-[100] flex items-center justify-center gap-3">
                    <AlertCircle size={14} className="text-red-600" />
                    <span className="text-[10px] md:text-[12px] font-bold text-red-600 uppercase tracking-widest">Notification: Payment Transaction Failed</span>
                </div>

                <div className="w-full max-w-md border border-zinc-200 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500 mt-12">
                    <div className="bg-red-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                             <XCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight uppercase tracking-widest text-[14px]">Your transaction has failed</h2>
                        <p className="text-red-100 text-[12px] font-medium mt-1">Status: payment not received</p>
                    </div>

                    <div className="p-8 bg-white space-y-6">
                        <div className="space-y-4">
                             <div className="flex justify-between items-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                 <span>Transaction Details</span>
                                 <span className="text-zinc-300">#RAZORPAY_FAILURE</span>
                             </div>
                             <div className="space-y-3 pt-2">
                                 <div className="flex justify-between text-[13px]">
                                     <span className="text-zinc-500">Course</span>
                                     <span className="font-bold text-zinc-900 text-right max-w-[200px]">{course?.title}</span>
                                 </div>
                                 <div className="flex justify-between text-[13px]">
                                     <span className="text-zinc-500">Amount</span>
                                     <span className="font-bold text-zinc-900">₹{finalPrice}</span>
                                 </div>
                                 <div className="flex justify-between text-[13px]">
                                     <span className="text-zinc-500">Payment ID</span>
                                     <span className="font-medium text-zinc-900">{failureDetails?.metadata?.payment_id || "N/A"}</span>
                                 </div>
                                 <div className="flex justify-between text-[13px]">
                                     <span className="text-zinc-500">Timestamp</span>
                                     <span className="font-medium text-zinc-900">{new Date().toLocaleString()}</span>
                                 </div>
                             </div>
                        </div>

                        <div className="bg-zinc-50 p-4 border border-zinc-100 space-y-2">
                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest block">Failure Reason</span>
                            <p className="text-[12px] text-zinc-600 leading-relaxed font-medium italic">
                                "{failureDetails?.description || "The transaction was canceled or interrupted systemically."}"
                            </p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button 
                                onClick={() => { setStep(2); setError(""); }}
                                className="w-full bg-black text-white h-12 text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                            >
                                Try Payment Again
                            </button>
                            <button 
                                onClick={() => setStep(1)}
                                className="w-full bg-zinc-100 text-zinc-900 h-12 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                            >
                                Re-verify Details
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 text-center">
                         <p className="text-[10px] text-zinc-400 font-medium">
                             If money was deducted, it will be refunded within 5-7 business days.
                         </p>
                    </div>
                </div>
                
                <Link href="/courses" className="mt-8 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] hover:text-black transition-colors flex items-center gap-2">
                    <ArrowLeft size={12} /> Back to Academy
                </Link>
            </div>
        );
    }

    if (step === 4) {
        return (
            <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 border border-zinc-900 flex items-center justify-center mb-8">
                    <CheckCircle className="w-10 h-10 text-zinc-900" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl tracking-tight mb-4 font-bold">Registration Received</h1>
                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-10 text-[15px]">
                    Congratulations {formData.name}! Your enrollment in {course?.title} is being processed. 
                    {paymentMethod === "upi" ? " We will verify your UPI transaction soon." : " Payment received successfully."}
                </p>
                <div className="flex gap-4">
                    <Link href="/courses" className="bg-black text-white px-8 py-3 text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
                        View More Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-70">
                            <Home className="w-4 h-4" />
                            <span className="text-[14px] tracking-tight hidden sm:block font-medium">Home</span>
                        </Link>
                        <div className="w-[1px] h-4 bg-zinc-200" />
                        <Link href={`/courses/${id}`} className="flex items-center gap-2 group transition-opacity hover:opacity-70">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[14px] tracking-tight font-medium">Return</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="w-full flex-1">
                <div className="bg-black py-12 lg:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Academy", href: "/courses" }, { label: course?.title || "Course", href: `/courses/${id}` }, { label: "Registration" }]} />
                        <h1 className="text-4xl md:text-5xl tracking-tight text-white mt-8 mb-4">
                            Enrollment Portal
                        </h1>
                        <p className="text-zinc-400 text-[15px] leading-relaxed font-medium">
                            Step {step} of {paymentMethod === "upi" || paymentMethod === "razorpay" ? "3" : "2"}: {step === 1 ? 'Candidate Details' : step === 2 ? 'Payment Method' : 'Verification'}
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        <aside className="lg:col-span-4 h-fit space-y-12">
                             <div className="space-y-6">
                                 <h4 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Enrollment cost</h4>
                                 <div className="p-10 border border-zinc-100 space-y-6 bg-zinc-50/10">
                                     <div className="flex justify-between items-center text-[14px]">
                                         <span className="text-zinc-500 font-medium">Workshop Fee</span>
                                         <span className={`${appliedCoupon ? 'line-through text-zinc-300' : 'text-zinc-900 font-bold'}`}>₹{course?.price || "1499"}</span>
                                     </div>
                                     {appliedCoupon && (
                                         <div className="flex justify-between items-center text-[14px]">
                                             <span className="text-green-600 font-bold uppercase tracking-widest text-[9px]">Coupon Applied</span>
                                             <span className="text-zinc-900 font-bold">-₹{parseInt(course?.price || "1499") - 999}</span>
                                         </div>
                                     )}
                                     <div className="pt-6 border-t border-zinc-100 flex justify-between items-center">
                                         <span className="text-[12px] font-bold uppercase tracking-wider">Amount Due</span>
                                         <span className="text-3xl font-bold tracking-tighter">₹{finalPrice}</span>
                                     </div>
                                 </div>
                             </div>

                             <div className="space-y-8">
                                 <ProgressItem number="01" label="Candidate Info" active={step === 1} completed={step > 1} />
                                 <ProgressItem number="02" label="Payment" active={step === 2} completed={step > 2} />
                                 <ProgressItem number="03" label="Status" active={step === 3} completed={step > 3} />
                             </div>
                        </aside>

                        <div className="lg:col-span-8">
                            {step === 1 && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Required" icon={<User size={16} />} />
                                        <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="Required" type="email" icon={<Mail size={16} />} />
                                        <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" icon={<Phone size={16} />} />
                                        <InputField label="College / Institution" name="college" value={formData.college} onChange={handleChange} placeholder="Required" icon={<Building2 size={16} />} />
                                        <InputField label="Branch of Study" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. CSE" icon={<GraduationCap size={16} />} />
                                        <div className="space-y-4">
                                            <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Academic Year</label>
                                            <div className="relative">
                                                <select 
                                                    name="year" 
                                                    value={formData.year} 
                                                    onChange={handleChange}
                                                    className="w-full bg-white border border-zinc-200 h-14 px-6 text-[14px] outline-none transition-colors focus:border-black appearance-none font-medium"
                                                >
                                                    <option value="">Select Year</option>
                                                    <option value="1">1st Year</option>
                                                    <option value="2">2nd Year</option>
                                                    <option value="3">3rd Year</option>
                                                    <option value="4">4th Year</option>
                                                    <option value="other">Other</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ChevronRight className="w-3 h-3 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Discount Code (Optional)</label>
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <Ticket size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" />
                                                <input 
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    className="w-full border border-zinc-200 h-14 px-12 text-[14px] outline-none transition-colors focus:border-black font-medium"
                                                    placeholder="Enter code"
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                className="bg-zinc-100 px-8 h-14 text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    {error && <p className="text-red-500 text-[12px] font-medium">{error}</p>}
                                    
                                    <button 
                                        onClick={nextStep}
                                        className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 text-[13px] transition-opacity hover:opacity-90 uppercase tracking-widest font-bold"
                                    >
                                        Proceed to Checkout <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 max-w-xl">
                                    {}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div 
                                            onClick={() => setPaymentMethod("razorpay")}
                                            className={`flex-1 p-5 border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "razorpay" ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 opacity-60'}`}
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-100 shadow-sm">
                                                <img src="https://razorpay.com/assets/razorpay-glyph.svg" className="w-5 h-5" alt="R" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="text-[13px] font-bold uppercase tracking-wider leading-none mb-1">HDFC Collect Now via Razorpay</h4>
                                                <p className="text-[10px] text-zinc-400 font-medium">Automatic</p>
                                            </div>
                                        </div>

                                        <div 
                                            onClick={() => setPaymentMethod("upi")}
                                            className={`flex-1 p-5 border cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "upi" ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200 opacity-60'}`}
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center bg-white border border-zinc-100 shadow-sm">
                                                <QrCode size={18} className="text-black" />
                                            </div>
                                            <div className="text-left">
                                                <h4 className="text-[13px] font-bold uppercase tracking-wider leading-none mb-1">Manual UPI</h4>
                                                <p className="text-[10px] text-zinc-400 font-medium">QR Scan</p>
                                            </div>
                                        </div>
                                    </div>

                                    {}
                                    <div className="border border-zinc-100 bg-white relative overflow-hidden shadow-sm">
                                        <div className="p-8 md:p-10 flex flex-col items-center justify-center w-full">
                                            {paymentMethod === "razorpay" ? (
                                                <div className="text-center space-y-6">
                                                    <div className="space-y-4">
                                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 uppercase tracking-widest text-[14px]">HDFC Collect Now via Razorpay</h3>
                                                        <p className="text-[13px] text-zinc-500 max-w-[280px] mx-auto leading-relaxed font-medium">
                                                            Pay securely using your preferred method including Cards, UPI, or Netbanking.
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={handleRazorpayPayment}
                                                        disabled={submitting}
                                                        className="w-full max-w-[280px] bg-black text-white h-12 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 active:scale-[0.98]"
                                                    >
                                                        {submitting ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <>
                                                                Pay Securely <CreditCard size={12} />
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full space-y-8 flex flex-col items-center">
                                                    {!isRevealed ? (
                                                        <div className="text-center space-y-6 flex flex-col items-center">
                                                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                                                                <Lock size={18} />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h3 className="text-xl font-bold tracking-tight uppercase tracking-widest text-[14px]">Manual Transfer</h3>
                                                                <p className="text-[13px] text-zinc-500 max-w-[280px] mx-auto leading-relaxed font-medium">
                                                                   Verification is required after scanning the QR code.
                                                                </p>
                                                            </div>
                                                            <button 
                                                                onClick={() => setIsRevealed(true)}
                                                                className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-50 transition-opacity"
                                                            >
                                                                Reveal Scan Code
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center animate-in zoom-in-95 duration-500 space-y-8 flex flex-col items-center">
                                                            <div className="p-4 bg-zinc-50 border border-zinc-100 shadow-inner">
                                                                <img 
                                                                    src={qrSource}
                                                                    alt="Scan QR"
                                                                    className="w-40 h-40 mix-blend-multiply"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h3 className="text-2xl font-bold tracking-tighter text-zinc-900">₹{finalPrice}</h3>
                                                                <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Total amount to pay</p>
                                                            </div>
                                                            <button 
                                                                onClick={nextStep}
                                                                className="w-full max-w-[280px] bg-black text-white h-12 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
                                                            >
                                                                I have paid <ChevronRight size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <button 
                                            onClick={prevStep}
                                            className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest hover:text-black transition-colors"
                                        >
                                            Change Details
                                        </button>
                                    </div>
                                    
                                    {error && <p className="text-red-500 text-[11px] font-bold text-center tracking-wide">{error}</p>}
                                </div>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleManualSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    <div className="border-l-4 border-black p-8 bg-zinc-50/50 space-y-4">
                                        <h4 className="text-[14px] font-bold uppercase tracking-wider">Verification Required</h4>
                                        <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">
                                            Please provide the Reference ID or UTR number from your UPI transaction for manual verification by our team.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <InputField label="Reference ID / UTR" name="referenceId" value={formData.referenceId} onChange={handleChange} placeholder="Required" icon={<ShieldCheck size={16} />} />
                                        <InputField label="Confirm Amount" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g. 1499" icon={<Ticket size={16} />} />
                                    </div>

                                    {error && <p className="text-red-500 text-[12px] font-medium">{error}</p>}

                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 border border-zinc-100 text-zinc-400 h-14 text-[12px] font-bold transition-all hover:bg-zinc-50 uppercase tracking-widest"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-[2] bg-black text-white h-14 flex items-center justify-center gap-3 text-[13px] font-bold transition-opacity hover:opacity-90 uppercase tracking-widest"
                                        >
                                            {submitting ? <Loader2 size={16} className="animate-spin" /> : (
                                                <>
                                                    Submit for Verification <Send size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function InputField({ label, name, value, onChange, placeholder, type = "text", icon }: any) {
    return (
        <div className="space-y-4">
            <label className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300">
                    {icon}
                </div>
                <input 
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white border border-zinc-200 h-14 px-12 text-[14px] outline-none transition-colors focus:border-black font-medium"
                />
            </div>
        </div>
    );
}

function ProgressItem({ number, label, active, completed }: any) {
    return (
        <div className={`flex items-center gap-8 transition-all duration-500 ${active ? 'opacity-100 translate-x-2' : 'opacity-30'}`}>
            <div className={`h-12 w-12 flex items-center justify-center text-[12px] font-bold border transition-colors ${completed ? 'bg-black text-white border-black' : active ? 'border-black text-black' : 'border-zinc-200 text-zinc-300'}`}>
                {completed ? <CheckCircle size={16} /> : number}
            </div>
            <div>
                <span className="text-[13px] font-bold uppercase tracking-widest block">{label}</span>
            </div>
        </div>
    );
}
