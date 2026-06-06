"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import ReCAPTCHA from "react-google-recaptcha";

export interface LoginPageProps {
  onSubmit?: (email: string, password: string) => Promise<void> | void;
  onGoogleLogin?: () => Promise<void> | void;
  showReCAPTCHA?: boolean;
  recaptchaRef?: React.RefObject<ReCAPTCHA | null>;
  setCaptchaToken?: (token: string | null) => void;
  error?: string;
  setError?: (err: string) => void;
  isLoading?: boolean;
  setIsLoading?: (val: boolean) => void;
}


interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

const Pupil = ({ 
  size = 12, 
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY
}: PupilProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };

    // If forced look direction is provided, use that instead of mouse tracking
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;

    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};




interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

const EyeBall = ({ 
  size = 48, 
  pupilSize = 16, 
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY
}: EyeBallProps) => {
  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    // If forced look direction is provided, use that instead of mouse tracking
    if (forceLookX !== undefined && forceLookY !== undefined) {
      return { x: forceLookX, y: forceLookY };
    }

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;

    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);

    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};





function LoginPage({
  onSubmit,
  onGoogleLogin,
  showReCAPTCHA = false,
  recaptchaRef,
  setCaptchaToken,
  error: propError,
  setError: propSetError,
  isLoading: propIsLoading,
  setIsLoading: propSetIsLoading,
}: LoginPageProps = {}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [localIsLoading, setLocalIsLoading] = useState(false);

  const error = propError !== undefined ? propError : localError;
  const setError = propSetError !== undefined ? propSetError : setLocalError;
  const isLoading = propIsLoading !== undefined ? propIsLoading : localIsLoading;
  const setIsLoading = propSetIsLoading !== undefined ? propSetIsLoading : setLocalIsLoading;

  const [mouseX, setMouseX] = useState<number>(0);
  const [mouseY, setMouseY] = useState<number>(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Blinking effect for purple character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsPurpleBlinking(true);
        setTimeout(() => {
          setIsPurpleBlinking(false);
          scheduleBlink();
        }, 150); // Blink duration 150ms
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Blinking effect for black character
  useEffect(() => {
    const getRandomBlinkInterval = () => Math.random() * 4000 + 3000; // Random between 3-7 seconds

    const scheduleBlink = () => {
      const blinkTimeout = setTimeout(() => {
        setIsBlackBlinking(true);
        setTimeout(() => {
          setIsBlackBlinking(false);
          scheduleBlink();
        }, 150); // Blink duration 150ms
      }, getRandomBlinkInterval());

      return blinkTimeout;
    };

    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Looking at each other animation when typing starts
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => {
        setIsLookingAtEachOther(false);
      }, 800); // Look at each other for 1.5 seconds, then back to tracking mouse
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Purple sneaky peeking animation when typing password and it's visible
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedulePeek = () => {
        const peekInterval = setTimeout(() => {
          setIsPurplePeeking(true);
          setTimeout(() => {
            setIsPurplePeeking(false);
          }, 800); // Peek for 800ms
        }, Math.random() * 3000 + 2000); // Random peek every 2-5 seconds
        return peekInterval;
      };

      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [password, showPassword, isPurplePeeking]);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodyRotation: 0 };

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3; // Focus on head area

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;

    // Face movement (limited range)
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));

    // Body lean (skew for lean while keeping bottom straight) - negative to lean towards mouse
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (onSubmit) {
      try {
        await onSubmit(email, password);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate API delay (quick)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Support erik@gmail.com / 1234 or auto-simulate login for demo purposes
      if (email === "erik@gmail.com" && password === "1234") {
        console.log("✅ Login successful!");
        localStorage.setItem("forge_user_signed_in", "true");
        router.push("/events");
      } else {
        setError("Invalid email or password. Hint: Use erik@gmail.com and 1234");
        console.log("❌ Login failed");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-blue-100">
      {/* Centered Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        {/* Sign In Card Container (Reduced height to 480px) */}
        <div className="w-full max-w-[960px] md:h-[480px] bg-background border border-zinc-200 flex flex-col md:flex-row overflow-hidden rounded-lg shadow-sm">
          {/* Left Content Section (Charcoal Grey Panel with p-6) */}
          <div className="relative hidden md:flex md:w-[45%] flex-col justify-end bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 p-6 text-white rounded-none">
            <div className="relative z-20 flex items-end justify-center h-[340px] overflow-hidden">
              {/* Cartoon Characters (Scaled down to fit within the reduced 480px container) */}
              <div className="relative" style={{ width: '320px', height: '260px' }}>
                {/* Purple tall rectangle character - Back layer */}
                <div 
                  ref={purpleRef}
                  className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{
                    left: '35px',
                    width: '100px',
                    height: (isTyping || (password.length > 0 && !showPassword)) ? '280px' : '250px',
                    backgroundColor: '#6C3FF5',
                    borderRadius: '0px',
                    zIndex: 1,
                    transform: (password.length > 0 && showPassword)
                      ? `skewX(0deg)`
                      : (isTyping || (password.length > 0 && !showPassword))
                        ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(20px)` 
                        : `skewX(${purplePos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Eyes */}
                  <div 
                    className="absolute flex gap-4 transition-all duration-700 ease-in-out"
                    style={{
                      left: (password.length > 0 && showPassword) ? '12px' : isLookingAtEachOther ? '30px' : `${22 + purplePos.faceX}px`,
                      top: (password.length > 0 && showPassword) ? '25px' : isLookingAtEachOther ? '40px' : `${26 + purplePos.faceY}px`,
                    }}
                  >
                    <EyeBall 
                      size={12} 
                      pupilSize={4} 
                      maxDistance={3} 
                      eyeColor="white" 
                      pupilColor="#2D2D2D" 
                      isBlinking={isPurpleBlinking}
                      forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 3 : -3) : isLookingAtEachOther ? 2 : undefined}
                      forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 3 : -3) : isLookingAtEachOther ? 2 : undefined}
                    />
                    <EyeBall 
                      size={12} 
                      pupilSize={4} 
                      maxDistance={3} 
                      eyeColor="white" 
                      pupilColor="#2D2D2D" 
                      isBlinking={isPurpleBlinking}
                      forceLookX={(password.length > 0 && showPassword) ? (isPurplePeeking ? 3 : -3) : isLookingAtEachOther ? 2 : undefined}
                      forceLookY={(password.length > 0 && showPassword) ? (isPurplePeeking ? 3 : -3) : isLookingAtEachOther ? 2 : undefined}
                    />
                  </div>
                </div>

                {/* Black tall rectangle character - Middle layer */}
                <div 
                  ref={blackRef}
                  className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{
                    left: '145px',
                    width: '75px',
                    height: '200px',
                    backgroundColor: '#2D2D2D',
                    borderRadius: '0px',
                    zIndex: 2,
                    transform: (password.length > 0 && showPassword)
                      ? `skewX(0deg)`
                      : isLookingAtEachOther
                        ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(10px)`
                        : (isTyping || (password.length > 0 && !showPassword))
                          ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` 
                          : `skewX(${blackPos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Eyes */}
                  <div 
                    className="absolute flex gap-3 transition-all duration-700 ease-in-out"
                    style={{
                      left: (password.length > 0 && showPassword) ? '8px' : isLookingAtEachOther ? '20px' : `${15 + blackPos.faceX}px`,
                      top: (password.length > 0 && showPassword) ? '18px' : isLookingAtEachOther ? '10px' : `${22 + blackPos.faceY}px`,
                    }}
                  >
                    <EyeBall 
                      size={10} 
                      pupilSize={4} 
                      maxDistance={2} 
                      eyeColor="white" 
                      pupilColor="#2D2D2D" 
                      isBlinking={isBlackBlinking}
                      forceLookX={(password.length > 0 && showPassword) ? -2 : isLookingAtEachOther ? 0 : undefined}
                      forceLookY={(password.length > 0 && showPassword) ? -2 : isLookingAtEachOther ? -2 : undefined}
                    />
                    <EyeBall 
                      size={10} 
                      pupilSize={4} 
                      maxDistance={2} 
                      eyeColor="white" 
                      pupilColor="#2D2D2D" 
                      isBlinking={isBlackBlinking}
                      forceLookX={(password.length > 0 && showPassword) ? -2 : isLookingAtEachOther ? 0 : undefined}
                      forceLookY={(password.length > 0 && showPassword) ? -2 : isLookingAtEachOther ? -2 : undefined}
                    />
                  </div>
                </div>

                {/* Orange semi-circle character - Front left */}
                <div 
                  ref={orangeRef}
                  className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{
                    left: '0px',
                    width: '140px',
                    height: '120px',
                    zIndex: 3,
                    backgroundColor: '#FF9B6B',
                    borderRadius: '0px',
                    transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${orangePos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Eyes - just pupils, no white */}
                  <div 
                    className="absolute flex gap-4 transition-all duration-200 ease-out"
                    style={{
                      left: (password.length > 0 && showPassword) ? '25px' : `${40 + (orangePos.faceX || 0)}px`,
                      top: (password.length > 0 && showPassword) ? '45px' : `${50 + (orangePos.faceY || 0)}px`,
                    }}
                  >
                    <Pupil size={8} maxDistance={3} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -3 : undefined} forceLookY={(password.length > 0 && showPassword) ? -2 : undefined} />
                    <Pupil size={8} maxDistance={3} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -3 : undefined} forceLookY={(password.length > 0 && showPassword) ? -2 : undefined} />
                  </div>
                </div>

                {/* Yellow tall rectangle character - Front right */}
                <div 
                  ref={yellowRef}
                  className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{
                    left: '190px',
                    width: '85px',
                    height: '140px',
                    backgroundColor: '#E8D754',
                    borderRadius: '0px',
                    zIndex: 4,
                    transform: (password.length > 0 && showPassword) ? `skewX(0deg)` : `skewX(${yellowPos.bodySkew || 0}deg)`,
                    transformOrigin: 'bottom center',
                  }}
                >
                  {/* Eyes - just pupils, no white */}
                  <div 
                    className="absolute flex gap-4 transition-all duration-200 ease-out"
                    style={{
                      left: (password.length > 0 && showPassword) ? '12px' : `${28 + (yellowPos.faceX || 0)}px`,
                      top: (password.length > 0 && showPassword) ? '22px' : `${26 + (yellowPos.faceY || 0)}px`,
                    }}
                  >
                    <Pupil size={8} maxDistance={3} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -3 : undefined} forceLookY={(password.length > 0 && showPassword) ? -2 : undefined} />
                    <Pupil size={8} maxDistance={3} pupilColor="#2D2D2D" forceLookX={(password.length > 0 && showPassword) ? -3 : undefined} forceLookY={(password.length > 0 && showPassword) ? -2 : undefined} />
                  </div>
                  {/* Horizontal line for mouth */}
                  <div 
                    className="absolute bg-[#2D2D2D] transition-all duration-200 ease-out"
                    style={{
                      left: (password.length > 0 && showPassword) ? '6px' : `${18 + (yellowPos.faceX || 0)}px`,
                      top: '55px',
                      width: '40px',
                      height: '3px',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="absolute top-1/4 right-1/4 size-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 size-96 bg-white/5 rounded-full blur-3xl" />
          </div>

          {/* Right Login Section */}
          <div className="w-full md:w-[55%] flex items-center justify-center p-6 bg-background rounded-none">
            <div className="w-full max-w-[340px]">
              {/* Header (Aligned to left) */}
              <div className="text-left mb-6">
                <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back!</h1>
                <p className="text-muted-foreground text-xs">Please enter your details</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[10px] font-semibold text-slate-500">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="erik@gmail.com"
                    value={email}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    required
                    className="h-10 bg-zinc-50/50 border border-zinc-200 focus-visible:ring-zinc-300 focus-visible:border-zinc-400 focus:border-zinc-400 placeholder:text-zinc-400 text-xs rounded-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-[10px] font-semibold text-slate-500">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-[10px] text-zinc-900 hover:underline font-semibold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-10 pr-10 bg-zinc-50/50 border border-zinc-200 focus-visible:ring-zinc-300 focus-visible:border-zinc-400 focus:border-zinc-400 placeholder:text-zinc-400 text-xs rounded-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-1">
                  <Checkbox id="remember" className="rounded-none border-zinc-300" />
                  <Label
                    htmlFor="remember"
                    className="text-xs font-normal text-slate-500 cursor-pointer"
                  >
                    Remember for 30 days
                  </Label>
                </div>

                {showReCAPTCHA && (
                  <div className="py-1">
                    <div className="transform scale-[0.8] origin-left">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LfA4LssAAAAAJjVmCALHZYPY4bwg_XzQ7ZNCMGI"
                        onChange={(token) => setCaptchaToken?.(token)}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-none">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-10 text-xs font-medium bg-zinc-900 hover:bg-black text-white rounded-none" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Log in"}
                </Button>
              </form>

              {/* Social Login with Official Google Color SVG */}
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  className="w-full h-10 bg-background border border-zinc-200 hover:bg-zinc-50 text-xs rounded-none text-slate-600"
                  type="button"
                  onClick={() => {
                    if (onGoogleLogin) {
                      onGoogleLogin();
                    } else {
                      localStorage.setItem("forge_user_signed_in", "true");
                      router.push("/events");
                    }
                  }}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Log in with Google
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-zinc-100">
                Don't have an account?{" "}
                <Link href="/signup" className="text-zinc-900 font-semibold hover:underline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Brand Footer */}
      <footer className="w-full py-3 px-6 flex-none bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Link href="https://kiro.redlix.co.in/lms">
              <img 
                src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-05-14_at_17.46.09-removebg-preview.png?updatedAt=1778760997901" 
                alt="Logo" 
                className="h-8 w-auto opacity-75 hover:opacity-100 transition-all cursor-pointer"
              />
            </Link>
            <div className="h-5 w-px bg-zinc-300 hidden md:block" />
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] text-zinc-500 font-medium">
                © {new Date().getFullYear()} Student Forge Technologies Pvt Ltd.
              </p>
              <p className="text-[9px] text-zinc-400 font-medium">
                Powered by Cheetah Servers • Redlix Systems, Hyderabad
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[9px] text-zinc-400 font-semibold uppercase tracking-wider">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-zinc-900 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const Component = LoginPage;
