"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";
import { Component as LoginPage } from "@/components/ui/animated-characters-login-page";

export default function InternSigninPage() {
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
        if (error) setError(error.message);
    };

    const handleSignin = async (emailInput: string, passwordInput: string) => {
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        if (!captchaToken && !isLocal) {
            setError("Please complete security verification.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signin", {
                method: "POST",
                body: JSON.stringify({ email: emailInput, password: passwordInput, captcha_token: captchaToken }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Login failed.");
                setCaptchaToken(null);
                recaptchaRef.current?.reset();
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginPage
            onSubmit={handleSignin}
            onGoogleLogin={signInWithGoogle}
            showReCAPTCHA={true}
            recaptchaRef={recaptchaRef}
            setCaptchaToken={setCaptchaToken}
            error={error}
            setError={setError}
            isLoading={loading}
            setIsLoading={setLoading}
        />
    );
}