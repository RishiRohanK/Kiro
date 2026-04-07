"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Lock,
    UserPlus,
    Send,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    HelpCircle,
    Loader2,
    Calendar,
    ArrowRight,
    Home,
    Mail,
    ArrowLeft,
    Users
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/home/Footer";

export default function MailerPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [loginError, setLoginError] = useState(false);

    const handleProtectedLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded Credentials
        if (loginForm.email === "admin@studentforge.com" && loginForm.password === "Forge2026!") {
            setIsLoggedIn(true);
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    const [step, setStep] = useState(1);
    const [senderConfig, setSenderConfig] = useState({
        user: "",
        pass: "",
        host: "smtp.gmail.com",
        port: "465",
        secure: true,
    });

    const [templates, setTemplates] = useState([
        {
            id: 'welcome',
            name: 'Welcome Message',
            subject: 'Welcome to Student Forge, {name}!',
            eventType: 'COMMUNITY',
            description: "You have joined the student forge. We are excited to see what you will build next.",
            link: 'https://student-forge.com/dashboard',
            image: 'https://images.unsplash.com/photo-1517245386807-6466f272dd9e?q=80&w=800&auto=format&fit=crop',
            html: (data: any) => `
                <div style="font-family: sans-serif; padding: 40px; background: #f9fafb; color: #111827;">
                    <img src="${data.image}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 24px;" />
                    <span style="font-weight: bold; color: #92E3A9; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">${data.eventType}</span>
                    <h1 style="margin: 8px 0 24px 0; color: #111827;">Welcome to Student Forge, {name}!</h1>
                    <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">${data.description}</p>
                    <a href="${data.link}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #000000; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 4px;">Get Started</a>
                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #9ca3af;">
                        © 2026 Student Forge
                    </div>
                </div>`
        },
        {
            id: 'hackathon',
            name: 'Hackathon Invite',
            subject: 'New Hackathon Invite for {name}',
            eventType: 'EVENT',
            description: 'Our next hackathon starts this Friday. Join your team and get ready to build something new.',
            link: 'https://student-forge.com/register',
            image: 'https://images.unsplash.com/photo-1504384308090-c894fd901191?q=80&w=800&auto=format&fit=crop',
            html: (data: any) => `
                <div style="font-family: sans-serif; padding: 40px; background: #ffffff; color: #000000;">
                    <img src="${data.image}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 4px;" />
                    <div style="margin-top: 32px;">
                        <div style="background: #000000; color: white; padding: 8px 16px; display: inline-block; font-weight: bold; font-size: 12px; letter-spacing: 1px;">
                            ${data.eventType}
                        </div>
                        <h2 style="margin-top: 24px; font-size: 24px; color: #000000;">Get ready, {name}.</h2>
                        <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">${data.description}</p>
                        <a href="${data.link}" style="display: inline-block; margin-top: 24px; padding: 14px 28px; border: 2px solid #000000; color: #000000; text-decoration: none; font-weight: bold; text-transform: uppercase;">Join Now</a>
                    </div>
                </div>`
        }
    ]);

    const [selectedId, setSelectedId] = useState(templates[0].id);
    const selectedTemplate = templates.find(t => t.id === selectedId) || templates[0];

    const updateTemplateField = (field: string, value: string) => {
        setTemplates(prev => prev.map(t => t.id === selectedId ? { ...t, [field]: value } : t));
    };
    const [status, setStatus] = useState<"idle" | "verifying" | "ready" | "error">("idle");
    const [recipientsText, setRecipientsText] = useState("");
    const [students, setStudents] = useState<any[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [results, setResults] = useState<any>(null);

    const verifyAccount = async () => {
        setStatus("verifying");
        try {
            const res = await fetch("/api/mailer/verify", {
                method: "POST",
                body: JSON.stringify(senderConfig),
            });
            const data = await res.json();
            if (data.success) {
                setStatus("ready");
                setStep(2);
            } else {
                setStatus("error");
                alert("Verification failed. Please check your email and app password.");
            }
        } catch (err) {
            setStatus("error");
        }
    };

    const importStudents = () => {
        try {
            let list = [];
            if (recipientsText.startsWith("[")) {
                list = JSON.parse(recipientsText);
            } else {
                list = recipientsText.split("\n").filter(l => l.includes("@")).map(line => {
                    const parts = line.split(/[ ,]+/);
                    return { name: parts[0] || "Student", email: parts[parts.length - 1] };
                });
            }

            if (list.length > 0) {
                setStudents(list);
                setStep(3); 
            } else {
                alert("No valid email addresses found.");
            }
        } catch (e) {
            alert("Please ensure the format is correct (Name, Email).");
        }
    };

    const startCampaign = async () => {
        setIsSending(true);
        try {
            const processedHtml = typeof selectedTemplate.html === 'function'
                ? selectedTemplate.html(selectedTemplate)
                : selectedTemplate.html;

            const res = await fetch("/api/mailer/send", {
                method: "POST",
                body: JSON.stringify({
                    config: senderConfig,
                    students,
                    template: {
                        subject: selectedTemplate.subject,
                        html: processedHtml
                    }
                }),
            });
            const data = await res.json();
            setResults(data.results);
        } catch (err) {
            alert("Failed to send emails.");
        } finally {
            setIsSending(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-white font-sans overflow-hidden">
                {}
                <nav className="w-full border-b border-zinc-100 px-6 lg:px-10 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                         <Home size={16} />
                         <span className="text-[14px] tracking-tight">Home</span>
                    </Link>
                </nav>

                <div className="flex-1 flex flex-col items-center justify-center pb-20 px-8">
                    <div className="w-full max-w-[400px]">
                        <div className="border border-zinc-100 p-10 sm:p-12">
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold mb-2 text-zinc-900 tracking-tight">Admin Login</h1>
                                <p className="text-zinc-400 text-[13px] font-medium">Please enter your details to use the mailer.</p>
                            </div>

                            <form onSubmit={handleProtectedLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Admin Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={loginForm.email}
                                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                        className="w-full border border-zinc-100 bg-zinc-50 px-5 py-3 text-sm font-medium outline-none focus:border-black transition-all"
                                        placeholder="admin@studentforge.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                                    <input
                                        required
                                        type="password"
                                        value={loginForm.password}
                                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                        className="w-full border border-zinc-100 bg-zinc-50 px-5 py-3 text-sm font-medium outline-none focus:border-black transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {loginError && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Invalid details. Try again.</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white h-12 font-bold text-[12px] uppercase tracking-widest transition-opacity hover:opacity-90 mt-4"
                                >
                                    Login to Mailer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-white text-zinc-900 font-sans selection:bg-zinc-100">
             <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
                        <Home size={16} />
                        <span className="text-[14px] tracking-tight">Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 bg-[#92E3A9]" />
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Mailer Tool</span>
                    </div>
                </div>
            </nav>

            <main className="w-full">
                {}
                <div className="bg-black py-10">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Academy", href: "/" }, { label: "Mailer" }]} />
                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                            Bulk Email Tool
                        </h1>
                        <p className="text-zinc-400 text-[14px]">Send updates and invitations to multiple students at once.</p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {}
                        <div className="lg:col-span-3 space-y-8">
                             {[
                                { id: 1, label: "Link Email", icon: Mail },
                                { id: 2, label: "Add Students", icon: UserPlus },
                                { id: 3, label: "Edit Email", icon: Calendar },
                                { id: 4, label: "Review & Send", icon: Send }
                            ].map((s) => (
                                <div key={s.id} className={`flex items-center gap-4 transition-all ${step === s.id ? "opacity-100" : "opacity-30"}`}>
                                    <div className={`h-10 w-10 border ${step === s.id ? "border-black bg-black text-white" : "border-zinc-100 text-zinc-300" } flex items-center justify-center`}>
                                        <s.icon size={16} strokeWidth={2} />
                                    </div>
                                    <span className="text-[12px] font-bold uppercase tracking-widest">{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {}
                        <div className="lg:col-span-9">
                             {step === 1 && (
                                <div className="border border-zinc-100 p-10 space-y-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold">Link Your Account</h2>
                                        <p className="text-zinc-500 text-[13px]">Enter your Gmail details to start sending emails.</p>
                                    </div>

                                    <div className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Your Email</label>
                                            <input
                                                type="email"
                                                placeholder="e.g. hello@gmail.com"
                                                value={senderConfig.user}
                                                onChange={(e) => setSenderConfig({ ...senderConfig, user: e.target.value })}
                                                className="w-full border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">App Password</label>
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="•••• •••• •••• ••••"
                                                value={senderConfig.pass}
                                                onChange={(e) => setSenderConfig({ ...senderConfig, pass: e.target.value })}
                                                className="w-full border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm focus:border-black outline-none transition-all"
                                            />
                                        </div>

                                        <button
                                            onClick={verifyAccount}
                                            disabled={status === "verifying"}
                                            className="w-full bg-black text-white h-12 flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
                                        >
                                            {status === "verifying" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="border border-zinc-100 p-10 space-y-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold">Add Students</h2>
                                        <p className="text-zinc-500 text-[13px]">Paste names and emails below (Format: Name, Email).</p>
                                    </div>

                                    <textarea
                                        placeholder="Rahul, rahul@gmail.com&#10;Ananya, ananya@gmail.com"
                                        value={recipientsText}
                                        onChange={(e) => setRecipientsText(e.target.value)}
                                        className="w-full h-48 border border-zinc-100 bg-zinc-50 p-4 text-sm focus:border-black outline-none resize-none mb-6"
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-8 h-12 border border-zinc-100 text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={importStudents}
                                            className="flex-1 bg-black text-white h-12 text-[12px] font-bold uppercase tracking-widest hover:opacity-90"
                                        >
                                            Confirm List
                                        </button>
                                    </div>
                                </div>
                            )}

                             {step === 3 && (
                                <div className="border border-zinc-100 p-10 space-y-10">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold">Customize Email</h2>
                                        <p className="text-zinc-500 text-[13px]">Select a theme and update the message below.</p>
                                    </div>

                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="flex gap-4">
                                                {templates.map((t) => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setSelectedId(t.id)}
                                                        className={`flex-1 text-center p-4 border transition-all ${selectedId === t.id ? "border-black bg-zinc-50" : "border-zinc-100"}`}
                                                    >
                                                        <h3 className="font-bold text-[10px] uppercase tracking-widest">{t.name}</h3>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="space-y-4 pt-6 border-t border-zinc-100">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Topic</label>
                                                    <input
                                                        type="text"
                                                        value={selectedTemplate.subject}
                                                        onChange={(e) => updateTemplateField('subject', e.target.value)}
                                                        className="w-full border border-zinc-100 bg-zinc-50 px-4 py-2 text-xs font-bold outline-none focus:border-black"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Main Message</label>
                                                    <textarea
                                                        value={selectedTemplate.description}
                                                        onChange={(e) => updateTemplateField('description', e.target.value)}
                                                        className="w-full h-32 border border-zinc-100 bg-zinc-50 p-4 text-xs outline-none focus:border-black resize-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6 flex gap-4">
                                                <button
                                                    onClick={() => setStep(2)}
                                                    className="px-8 h-12 border border-zinc-100 text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-50"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    onClick={() => setStep(4)}
                                                    className="flex-1 bg-black text-white h-12 text-[12px] font-bold uppercase tracking-widest hover:opacity-90"
                                                >
                                                    Review Email
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border border-zinc-100 overflow-hidden shadow-sm bg-zinc-50">
                                             <div className="bg-white px-4 py-2 border-b border-zinc-100">
                                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Preview Window</span>
                                            </div>
                                            <div className="h-[400px] overflow-y-auto scale-[0.8] origin-top bg-white m-4 border border-zinc-100">
                                                <div dangerouslySetInnerHTML={{ __html: typeof selectedTemplate.html === 'function' ? selectedTemplate.html(selectedTemplate).replace('{name}', 'Student') : String(selectedTemplate.html).replace('{name}', 'Student') }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {step === 4 && (
                                <div className="border border-zinc-100 p-10 space-y-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold">Final Review</h2>
                                        <p className="text-zinc-500 text-[13px]">Check your email details before sending to {students.length} students.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <ReviewRow label="From Email" value={senderConfig.user} />
                                        <ReviewRow label="Count" value={`${students.length} Students`} />
                                        <ReviewRow label="Theme" value={selectedTemplate.name} />
                                    </div>

                                    {results ? (
                                        <div className="p-8 border border-zinc-100 bg-zinc-50 text-center space-y-4">
                                            <CheckCircle className="text-[#92E3A9] w-8 h-8 mx-auto" strokeWidth={2.5} />
                                            <div className="space-y-1">
                                                <h4 className="font-bold">Emails Sent Successfully</h4>
                                                <p className="text-[12px] text-zinc-500">{results.success} delivered, {results.failed} failed</p>
                                            </div>
                                            <button onClick={() => { setStep(1); setResults(null); }} className="text-[11px] font-bold uppercase tracking-widest hover:underline">Start New Campaign</button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(3)}
                                                className="px-8 h-14 border border-zinc-100 text-[12px] font-bold uppercase tracking-widest"
                                            >
                                                Edit Again
                                            </button>
                                            <button
                                                onClick={startCampaign}
                                                disabled={isSending}
                                                className="flex-1 bg-black text-white h-14 text-[14px] font-bold uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-3"
                                            >
                                                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send All Emails <Send size={16} /></>}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                 <div className="mt-12 mb-24 text-center">
                    <Link href="/" className="group inline-flex items-center gap-3 text-[11px] font-bold text-zinc-300 hover:text-black transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Go back home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ReviewRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between p-4 border border-zinc-100 bg-zinc-50">
            <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
            <span className="text-[13px] font-bold">{value}</span>
        </div>
    );
}
