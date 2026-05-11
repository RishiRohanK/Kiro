"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Linkedin, Instagram, School, Bell, Search } from "lucide-react";

const COLLEGES = [
  {"name": "Indian Institute of Technology (IIT), Hyderabad", "code": "IITH"},
  {"name": "National Institute of Technology (NIT), Warangal", "code": "NITW"},
  {"name": "International Institute of Information Technology (IIIT), Hyderabad", "code": "IIITH"},
  {"name": "JNTUH College of Engineering, Hyderabad", "code": "JNTH"},
  {"name": "University College of Engineering, Osmania University", "code": "OUCE"},
  {"name": "Chaitanya Bharathi Institute of Technology (CBIT)", "code": "CBIT"},
  {"name": "VNR Vignana Jyothi Institute of Engineering and Technology", "code": "VNRV"},
  {"name": "Vasavi College of Engineering", "code": "VCEH"},
  {"name": "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)", "code": "GRRR"},
  {"name": "Mahatma Gandhi Institute of Technology (MGIT)", "code": "MGIT"},
  {"name": "CVR College of Engineering", "code": "CVRH"},
  {"name": "B.V. Raju Institute of Technology (BVRIT), Narsapur", "code": "BVRI"},
  {"name": "Vardhaman College of Engineering", "code": "VARD"},
  {"name": "Sreenidhi Institute of Science and Technology (SNIST)", "code": "SNIS"},
  {"name": "Institute of Aeronautical Engineering (IARE)", "code": "IARE"},
  {"name": "Maturi Venkata Subba Rao Engineering College (MVSR)", "code": "MVSR"},
  {"name": "Anurag University", "code": "ANRG"},
  {"name": "CMR College of Engineering and Technology", "code": "CMRC"},
  {"name": "Keshav Memorial Institute of Technology (KMIT)", "code": "KMIT"},
  {"name": "Kakatiya Institute of Technology and Science (KITS), Warangal", "code": "KITS"},
  {"name": "Malla Reddy College of Engineering and Technology (MRCET)", "code": "MRCE"},
  {"name": "Guru Nanak Institutions Technical Campus", "code": "GNIT"},
  {"name": "Vidya Jyothi Institute of Technology (VJIT)", "code": "VJIT"},
  {"name": "JB Institute of Engineering and Technology", "code": "JBIET"},
  {"name": "G. Narayanamma Institute of Technology and Science (GNITS)", "code": "GNTS"},
  {"name": "Stanley College of Engineering and Technology for Women", "code": "STAN"},
  {"name": "Muffakham Jah College of Engineering and Technology", "code": "MJCET"},
  {"name": "Methodist College of Engineering and Technology", "code": "METH"},
  {"name": "Deccan College of Engineering and Technology", "code": "DECC"},
  {"name": "Lords Institute of Engineering and Technology", "code": "LORD"},
  {"name": "TKR College of Engineering and Technology", "code": "TKRC"},
  {"name": "Sphoorthy Engineering College", "code": "SPHY"},
  {"name": "CMR Technical Campus", "code": "CMRK"},
  {"name": "Malla Reddy Institute of Technology and Science", "code": "MRIT"},
  {"name": "Geethanjali College of Engineering and Technology", "code": "GCTC"},
  {"name": "Bharat Institute of Engineering and Technology", "code": "BIET"},
  {"name": "Scient Institute of Technology", "code": "SNTI"},
  {"name": "Srinivas Reddy Memorial College of Engineering", "code": "SRMC"},
  {"name": "Sumathi Reddy Institute of Technology for Women", "code": "SRIW"},
  {"name": "Bhoj Reddy Engineering College for Women", "code": "BREW"},
  {"name": "ACE Engineering College", "code": "ACEH"},
  {"name": "Holy Mary Institute of Technology and Science", "code": "HITS"},
  {"name": "Jayamukhi Institute of Technological Sciences", "code": "JITS"},
  {"name": "Vaagdevi College of Engineering", "code": "VAGD"},
  {"name": "Balaji Institute of Technology and Science", "code": "BITS"},
  {"name": "SVS Group of Institutions", "code": "SVSI"},
  {"name": "Kamala Institute of Technology and Science", "code": "KITS"},
  {"name": "CMR Institute of Technology", "code": "CMRM"},
  {"name": "Vignan's Institute of Management and Technology for Women", "code": "VIGN"},
  {"name": "Marri Laxman Reddy Institute of Technology", "code": "MLRS"},
  {"name": "MLR Institute of Technology", "code": "MLID"},
  {"name": "St. Martin's Engineering College", "code": "SMEC"},
  {"name": "Nalla Malla Reddy Engineering College", "code": "NMREC"},
  {"name": "K.G. Reddy College of Engineering and Technology", "code": "KGRH"},
  {"name": "Nalla Narasimha Reddy Group of Institutions", "code": "NNRG"},
  {"name": "Bharat Institute of Technology and Science", "code": "BITS"},
  {"name": "AVN Institute of Engineering and Technology", "code": "AVNI"},
  {"name": "Abhinav Hi-Tech College of Engineering", "code": "ABHV"},
  {"name": "Arjun College of Technology and Sciences", "code": "ARJN"},
  {"name": "Aryabhata Institute of Technology and Science", "code": "ARYA"},
  {"name": "Aurora's Engineering College", "code": "AURC"},
  {"name": "Aurora's Scientific and Technological Institute", "code": "AURS"},
  {"name": "Aurora's Technological and Research Institute", "code": "AURR"},
  {"name": "Azad College of Engineering and Technology", "code": "AZAD"},
  {"name": "Bandari Srinivas Institute of Technology", "code": "BSIT"},
  {"name": "Bhaskar Engineering College", "code": "BASK"},
  {"name": "Bomma Institute of Technology and Science", "code": "BOMA"},
  {"name": "Christu Jyothi Institute of Technology and Science", "code": "CJIT"},
  {"name": "CMR Engineering College", "code": "CMRE"},
  {"name": "CVSR College of Engineering", "code": "CVSR"},
  {"name": "Daripally Anantha Ramulu College of Engineering and Technology", "code": "DARC"},
  {"name": "DRK College of Engineering and Technology", "code": "DRKC"},
  {"name": "DRK Institute of Science and Technology", "code": "DRKI"},
  {"name": "Ellenki College of Engineering and Technology", "code": "ELNK"},
  {"name": "Ellenki Institute of Engineering and Technology", "code": "ELNI"},
  {"name": "Gandhi Academy of Technical Education", "code": "GATE"},
  {"name": "Global Institute of Engineering and Technology", "code": "GLOB"},
  {"name": "Gopal Reddy College of Engineering and Technology", "code": "GOPL"},
  {"name": "Gouthami Institute of Technology and Management for Women", "code": "GOUT"},
  {"name": "Hasvita Institute of Engineering and Technology", "code": "HASV"},
  {"name": "Hi-Tech Institute of Engineering and Technology", "code": "HITE"},
  {"name": "Hyderabad Institute of Technology and Management", "code": "HITM"},
  {"name": "Indur Institute of Engineering and Technology", "code": "INDU"},
  {"name": "Jagruti Institute of Engineering and Technology", "code": "JAGR"},
  {"name": "Jawaharlal Nehru Institute of Technology", "code": "JNIT"},
  {"name": "Jawaharlal Nehru Technological University College of Engineering, Jagtial", "code": "JNTJ"},
  {"name": "Jawaharlal Nehru Technological University College of Engineering, Manthani", "code": "JNTM"},
  {"name": "Jawaharlal Nehru Technological University College of Engineering, Sultanpur", "code": "JNTS"},
  {"name": "Joginpally B.R. Engineering College", "code": "JBRE"},
  {"name": "Jyothishmathi Institute of Technological Sciences", "code": "JYOT"},
  {"name": "Jyothishmathi Institute of Technology and Science", "code": "JYTS"},
  {"name": "Khammam Institute of Technology and Sciences", "code": "KITS"},
  {"name": "Kodada Institute of Technology and Science for Women", "code": "KODW"},
  {"name": "Kommuri Pratap Reddy Institute of Technology", "code": "KPRT"},
  {"name": "Kshatriya College of Engineering", "code": "KSHR"},
  {"name": "Kunda College of Technology and Management", "code": "KUND"},
  {"name": "Lingaiah Institute of Management and Technology", "code": "LING"},
  {"name": "Madira Institute of Technology and Sciences", "code": "MADI"},
  {"name": "Mahaveer Institute of Science and Technology", "code": "MAHA"},
  {"name": "Malla Reddy College of Engineering", "code": "MRCE"},
  {"name": "Malla Reddy Engineering College", "code": "MREC"},
  {"name": "Malla Reddy Engineering College for Women", "code": "MRW"},
  {"name": "Malla Reddy Institute of Engineering and Technology", "code": "MRIE"},
  {"name": "Malla Reddy Institute of Technology", "code": "MRIT"},
  {"name": "Manair College of Engineering and Technology", "code": "MANA"},
  {"name": "Medak College of Engineering and Technology", "code": "MEDK"},
  {"name": "Mina Institute of Engineering and Technology for Women", "code": "MINA"},
  {"name": "Mother Teresa Institute of Science and Technology", "code": "MOTH"},
  {"name": "Nagole Institute of Technology and Science", "code": "NGLI"},
  {"name": "Nalanda Institute of Engineering and Technology", "code": "NALA"},
  {"name": "Narsimha Reddy Engineering College", "code": "NRCM"},
  {"name": "Nawab Shah Alam Khan College of Engineering and Technology", "code": "NSAK"},
  {"name": "Nigama Engineering College", "code": "NIGA"},
  {"name": "Nishitha College of Engineering and Technology", "code": "NISH"},
  {"name": "Noble College of Engineering and Technology for Women", "code": "NOBL"},
  {"name": "Noorul Islam College of Engineering", "code": "NOOR"},
  {"name": "P. Indra Reddy Memorial Engineering College", "code": "PIND"},
  {"name": "Padmasri Dr. B.V. Raju Institute of Technology", "code": "BVRIT"},
  {"name": "Pallavi Engineering College", "code": "PALV"},
  {"name": "Patnam Mahender Reddy Memorial Engineering College", "code": "PATN"},
  {"name": "Pragathi Engineering College", "code": "PRAG"},
  {"name": "Priyadarshini College of Engineering and Technology", "code": "PRIY"},
  {"name": "Progressive Engineering College", "code": "PROG"},
  {"name": "R.G.R. Siddhanthi College", "code": "RGRS"},
  {"name": "R.R.S. College of Engineering and Technology", "code": "RRSC"},
  {"name": "Radhaswamy Institute of Technology", "code": "RADH"},
  {"name": "Raja Mahendra College of Engineering", "code": "RAJA"},
  {"name": "Rajiv Gandhi University of Knowledge Technologies", "code": "RGUKT"},
  {"name": "Ramappa Engineering College", "code": "RAMP"},
  {"name": "Royal Institute of Technology and Science", "code": "ROYL"},
  {"name": "S R Engineering College", "code": "SREC"},
  {"name": "S.S.J. Engineering College", "code": "SSJC"},
  {"name": "Sagar Institute of Technology", "code": "SAGR"},
  {"name": "Sai Spurthi Institute of Technology", "code": "SSIT"},
  {"name": "Samskruti College of Engineering and Technology", "code": "SAMS"},
  {"name": "Sanskriti School of Engineering", "code": "SANS"},
  {"name": "Sant Samarth Engineering College", "code": "SANT"},
  {"name": "Santhi Ram Engineering College", "code": "SANR"},
  {"name": "Shadan College of Engineering and Technology", "code": "SHAD"},
  {"name": "Shadan Women's College of Engineering and Technology", "code": "SHDW"},
  {"name": "Sree Chaitanya College of Engineering", "code": "SCCC"},
  {"name": "Sree Chaitanya Institute of Technological Sciences", "code": "SCIS"},
  {"name": "Sree Dattha Group of Institutions", "code": "SDGI"},
  {"name": "Sree Dattha Institute of Engineering and Science", "code": "SDES"},
  {"name": "Sree Visvesvaraya Institute of Technology and Science", "code": "SVTS"},
  {"name": "Sridevi Women's Engineering College", "code": "SWEC"},
  {"name": "Sri Indu College of Engineering and Technology", "code": "SIND"},
  {"name": "Sri Indu Institute of Engineering and Technology", "code": "SIIE"},
  {"name": "Sri Sai Educational Society's Group of Institutions", "code": "SSES"},
  {"name": "St. Mary's Engineering College", "code": "STME"},
  {"name": "St. Mary's Group of Institutions Hyderabad", "code": "STMY"},
  {"name": "St. Peter's Engineering College", "code": "SPEC"},
  {"name": "St. Theressa Institute of Engineering and Technology", "code": "STTH"},
  {"name": "Sudharsan Engineering College", "code": "SUDH"},
  {"name": "Sujala Bharati Institute of Technology", "code": "SUJB"},
  {"name": "Sushrutha Institute of Technology", "code": "SUSH"},
  {"name": "Swarna Bharathi Institute of Science and Technology", "code": "SBIT"},
  {"name": "Syed Hashim College of Science and Technology", "code": "SYED"},
  {"name": "Teegala Krishna Reddy Engineering College", "code": "TKRE"},
  {"name": "Trinity College of Engineering and Technology", "code": "TRIN"},
  {"name": "Unity College of Engineering", "code": "UNTY"},
  {"name": "Vagdevi Engineering College", "code": "VAGD"},
  {"name": "Vardhaman College of Engineering", "code": "VARD"},
  {"name": "Vashista Institute of Science and Technology", "code": "VASH"},
  {"name": "Vathsalya Institute of Science and Technology", "code": "VATH"},
  {"name": "Venkateshwara Institute of Technology", "code": "VENK"},
  {"name": "Vidya Vikas Institute of Technology", "code": "VVIT"},
  {"name": "Vignan Institute of Technology and Science", "code": "VGNT"},
  {"name": "Vignan's Foundation for Science, Technology and Research", "code": "VFST"},
  {"name": "Vijay Rural Engineering College", "code": "VIJY"},
  {"name": "Visvesvaraya College of Engineering and Technology", "code": "VCET"},
  {"name": "Vivekananda Institute of Science and Information Technology", "code": "VISI"},
  {"name": "Vivekananda Institute of Technology and Science", "code": "VITS"}
];

export default function InternSignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [collegeSearch, setCollegeSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const filteredColleges = COLLEGES.filter(c => 
        c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
        c.code.toLowerCase().includes(collegeSearch.toLowerCase())
    );

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!college) {
            setError("Please select your college.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signup", {
                method: "POST",
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email,
                    phone,
                    college,
                    password
                }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Registration failed.");
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans overflow-x-hidden">

            {/* Left Side: Minimalist Panel with Animation */}
            <div className="md:w-[60%] bg-[#E0E7FF] relative hidden md:flex flex-col items-center justify-between overflow-hidden pt-12 pb-10 px-12">
                {/* Top Left Info */}
                <div className="w-full flex flex-col items-start gap-6 relative z-20">
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
                            alt="Student Forge Platform" 
                            className="h-8 w-auto"
                        />
                        <div className="h-6 w-px bg-[#003366]/20"></div>
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" 
                            alt="Student Forge" 
                            className="h-7 w-auto"
                        />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-[#003366] text-xl font-bold">Platform Workspace</h2>
                        <p className="text-[#003366]/60 text-[14px] font-medium">An official Student Forge Initiative</p>
                    </div>
                </div>

                {/* Bottom Animation */}
                <div className="relative z-10 w-full max-w-[750px] translate-y-32">
                    <iframe 
                        src="https://lottie.host/embed/521c9b48-ae0c-49ba-a951-9c0d31728f01/2oOdwYfKHI.lottie" 
                        className="w-full aspect-square border-none scale-125"
                    ></iframe>
                </div>

                {/* Decorative BG elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#003366]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full md:w-[40%] p-8 md:p-16 flex flex-col justify-center relative bg-white">
                <div className="max-w-[480px] w-full mx-auto space-y-8">

                    <div className="space-y-6">
                        <div className="p-4 bg-emerald-50 rounded-none flex items-center gap-4">
                            <div className="h-10 w-10 bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Bell size={20} />
                            </div>
                            <div>
                                <p className="text-[14px] font-bold text-emerald-900 leading-none mb-1">Welcome to bootcamp interns</p>
                                <p className="text-[11px] text-emerald-700 font-medium leading-none">Register your account to access your industrial workspace.</p>
                            </div>
                        </div>
                        <h1 className="text-[#003366] text-2xl font-bold tracking-tight">Register account</h1>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    required
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    required
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <Phone size={16} />
                            </span>
                            <input
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                placeholder="Enter Phone Number"
                            />
                        </div>

                        <div className="relative group z-30">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <School size={16} />
                            </span>
                            <input
                                required
                                type="text"
                                autoComplete="off"
                                value={college || collegeSearch}
                                onFocus={() => { setShowDropdown(true); if(college) setCollegeSearch(college); }}
                                onChange={(e) => { setCollegeSearch(e.target.value); setCollege(""); }}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                placeholder="Search & Select College"
                            />
                            
                            {showDropdown && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-zinc-200 border-t-0 shadow-2xl max-h-60 overflow-y-auto z-40">
                                    {filteredColleges.length > 0 ? (
                                        filteredColleges.map((c, index) => (
                                            <div 
                                                key={`${c.code}-${index}`}
                                                onClick={() => {
                                                    setCollege(c.name);
                                                    setCollegeSearch(c.name);
                                                    setShowDropdown(false);
                                                }}
                                                className="px-4 py-3 text-[13px] text-zinc-600 hover:bg-[#E0E7FF] hover:text-[#003366] cursor-pointer transition-colors border-b border-zinc-50 last:border-0 font-medium flex items-center gap-3"
                                            >
                                                <div className={`h-8 w-8 rounded-none flex items-center justify-center text-white text-[10px] font-black shrink-0 ${
                                                    (() => {
                                                        const colors = ["bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600", "bg-indigo-600", "bg-violet-600", "bg-cyan-600"];
                                                        let hash = 0;
                                                        for (let i = 0; i < c.code.length; i++) {
                                                            hash = c.code.charCodeAt(i) + ((hash << 5) - hash);
                                                        }
                                                        return colors[Math.abs(hash) % colors.length];
                                                    })()
                                                }`}>
                                                    {c.code.substring(0, 2)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="leading-tight">{c.name}</span>
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{c.code}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-11 py-3 text-[13px] text-zinc-400 italic">No colleges found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <Mail size={16} />
                                </span>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="Enter Email Address"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <Lock size={16} />
                                </span>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-12 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="Set password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" required className="mt-1 w-3.5 h-3.5 border-zinc-300 rounded-none text-[#003366] focus:ring-0" />
                            <p className="text-[12px] text-zinc-500 font-medium">
                                By registering you agree to the Student Forge <Link href="/terms" className="text-[#003366] font-bold hover:underline">Terms of Use</Link>
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                                <ShieldAlert size={14} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full h-12 bg-[#003366] text-white text-[14px] font-bold transition-all hover:bg-[#002244] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 rounded-none"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                        </button>
                    </form>

                    <div className="space-y-6 pt-2">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-[12px] text-zinc-400 font-bold tracking-widest">Connect with us</p>
                            <div className="flex gap-3">
                                <Link href="https://discord.gg/9ZAnhkXD" target="_blank" className="w-10 h-10 bg-[#5865F2] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.03-.005-.059.012-.072.0371-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495-.013-.025-.042-.042-.072-.037a19.7363 19.7363 0 00-4.8852 1.515c-.012.002-.023.011-.032.0277C.5334 9.0458-.319 13.5799.0992 18.0578c.002.019.013.04.0312.0561 2.0528 1.5076 4.0413 2.4228 5.9929 3.0294.032.01.0660-.003.0842-.0276.4616-.6304.8731-1.2952 1.226-1.9942.018-.033.004-.074-.0416-.1057-.6528-.2476-1.2743-.5495-1.8722-.8923-.048-.028-.051-.097-.0076-.1277.1258-.0943.2517-.1923.3718-.2914.025-.019.059-.026.0776-.0105 3.9278 1.7933 8.18 1.7933 12.0614 0 .018-.008.052-.001.0775.0095.1201.099.246.1981.3728.2924.044.03.041.099-.0066.1276a12.2986 12.2986 0 01-1.873.8914c-.045.016-.06.073-.0407.1067.3604.698.7719 1.3628 1.225 1.9932.018.024.049.038.0842.0286 1.961-.6067 3.9495-1.5219 6.0023-3.0294.018-.013.03-.034.0313-.0552.5004-5.177-.8382-9.6739-3.5485-13.6604a.0683.0683 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                </Link>
                                <Link href="https://www.linkedin.com/company/student-forge/" target="_blank" className="w-10 h-10 bg-[#0077B5] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <Linkedin size={18} />
                                </Link>
                                <Link href="https://www.instagram.com/studentforge/" target="_blank" className="w-10 h-10 bg-[#E1306C] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <Instagram size={18} />
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-[13px] text-zinc-500 font-medium">
                            Already have an account ? <Link href="/intern/signin" className="text-[#003366] font-bold hover:underline">Login</Link>
                        </p>
                    </div>

                    <div className="pt-8 border-t border-zinc-100">
                        <p className="text-center text-[11px] text-zinc-400 font-medium">
                            Copyright Student Forge Technologies Pvt. Ltd © 2025-2026. <br />
                            All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
