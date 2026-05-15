"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Linkedin, Instagram, School, ChevronRight, Info, Github } from "lucide-react";
import { StickyBanner } from "@/components/ui/sticky-banner";

const COLLEGES = [
    { "name": "Indian Institute of Technology (IIT), Hyderabad", "code": "IITH" },
    { "name": "National Institute of Technology (NIT), Warangal", "code": "NITW" },
    { "name": "International Institute of Information Technology (IIIT), Hyderabad", "code": "IIITH" },
    { "name": "JNTUH College of Engineering, Hyderabad", "code": "JNTH" },
    { "name": "University College of Engineering, Osmania University", "code": "OUCE" },
    { "name": "Chaitanya Bharathi Institute of Technology (CBIT)", "code": "CBIT" },
    { "name": "VNR Vignana Jyothi Institute of Engineering and Technology", "code": "VNRV" },
    { "name": "Vasavi College of Engineering", "code": "VCEH" },
    { "name": "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)", "code": "GRRR" },
    { "name": "Mahatma Gandhi Institute of Technology (MGIT)", "code": "MGIT" },
    { "name": "CVR College of Engineering", "code": "CVRH" },
    { "name": "B.V. Raju Institute of Technology (BVRIT), Narsapur", "code": "BVRI" },
    { "name": "Vardhaman College of Engineering", "code": "VARD" },
    { "name": "Sreenidhi Institute of Science and Technology (SNIST)", "code": "SNIS" },
    { "name": "Institute of Aeronautical Engineering (IARE)", "code": "IARE" },
    { "name": "Maturi Venkata Subba Rao Engineering College (MVSR)", "code": "MVSR" },
    { "name": "Anurag University", "code": "ANRG" },
    { "name": "Malla Reddy University", "code": "MRUN" },
    { "name": "CMR College of Engineering and Technology", "code": "CMRC" },
    { "name": "Keshav Memorial Institute of Technology (KMIT)", "code": "KMIT" },
    { "name": "Kakatiya Institute of Technology and Science (KITS), Warangal", "code": "KITS" },
    { "name": "Malla Reddy College of Engineering and Technology (MRCET)", "code": "MRCE" },
    { "name": "Guru Nanak Institutions Technical Campus", "code": "GNIT" },
    { "name": "Vidya Jyothi Institute of Technology (VJIT)", "code": "VJIT" },
    { "name": "JB Institute of Engineering and Technology", "code": "JBIET" },
    { "name": "G. Narayanamma Institute of Technology and Science (GNITS)", "code": "GNTS" },
    { "name": "Stanley College of Engineering and Technology for Women", "code": "STAN" },
    { "name": "Muffakham Jah College of Engineering and Technology", "code": "MJCET" },
    { "name": "Methodist College of Engineering and Technology", "code": "METH" },
    { "name": "Deccan College of Engineering and Technology", "code": "DECC" },
    { "name": "Lords Institute of Engineering and Technology", "code": "LORD" },
    { "name": "TKR College of Engineering and Technology", "code": "TKRC" },
    { "name": "Sphoorthy Engineering College", "code": "SPHY" },
    { "name": "CMR Technical Campus", "code": "CMRK" },
    { "name": "Malla Reddy Institute of Technology and Science", "code": "MRIT" },
    { "name": "Geethanjali College of Engineering and Technology", "code": "GCTC" },
    { "name": "Bharat Institute of Engineering and Technology", "code": "BIET" },
    { "name": "Scient Institute of Technology", "code": "SNTI" },
    { "name": "Srinivas Reddy Memorial College of Engineering", "code": "SRMC" },
    { "name": "Sumathi Reddy Institute of Technology for Women", "code": "SRIW" },
    { "name": "Bhoj Reddy Engineering College for Women", "code": "BREW" },
    { "name": "ACE Engineering College", "code": "ACEH" },
    { "name": "Holy Mary Institute of Technology and Science", "code": "HITS" },
    { "name": "Jayamukhi Institute of Technological Sciences", "code": "JITS" },
    { "name": "Vaagdevi College of Engineering", "code": "VAGD" },
    { "name": "Vaageswari College of Engineering", "code": "VAGW" },
    { "name": "Balaji Institute of Technology and Science", "code": "BITS" },
    { "name": "SVS Group of Institutions", "code": "SVSI" },
    { "name": "Kamala Institute of Technology and Science", "code": "KITS" },
    { "name": "CMR Institute of Technology", "code": "CMRM" },
    { "name": "Vignan's Institute of Management and Technology for Women", "code": "VIGN" },
    { "name": "Marri Laxman Reddy Institute of Technology", "code": "MLRS" },
    { "name": "MLR Institute of Technology", "code": "MLID" },
    { "name": "St. Martin's Engineering College", "code": "SMEC" },
    { "name": "Nalla Malla Reddy Engineering College", "code": "NMREC" },
    { "name": "K.G. Reddy College of Engineering and Technology", "code": "KGRH" },
    { "name": "Nalla Narasimha Reddy Group of Institutions", "code": "NNRG" },
    { "name": "Bharat Institute of Technology and Science", "code": "BITS" },
    { "name": "AVN Institute of Engineering and Technology", "code": "AVNI" },
    { "name": "Abhinav Hi-Tech College of Engineering", "code": "ABHV" },
    { "name": "Arjun College of Technology and Sciences", "code": "ARJN" },
    { "name": "Aryabhata Institute of Technology and Science", "code": "ARYA" },
    { "name": "Aurora's Engineering College", "code": "AURC" },
    { "name": "Aurora's Scientific and Technological Institute", "code": "AURS" },
    { "name": "Aurora's Technological and Research Institute", "code": "AURR" },
    { "name": "Azad College of Engineering and Technology", "code": "AZAD" },
    { "name": "Bandari Srinivas Institute of Technology", "code": "BSIT" },
    { "name": "Bhaskar Engineering College", "code": "BASK" },
    { "name": "Bomma Institute of Technology and Science", "code": "BOMA" },
    { "name": "Christu Jyothi Institute of Technology and Science", "code": "CJIT" },
    { "name": "CMR Engineering College", "code": "CMRE" },
    { "name": "CVSR College of Engineering", "code": "CVSR" },
    { "name": "Daripally Anantha Ramulu College of Engineering and Technology", "code": "DARC" },
    { "name": "DRK College of Engineering and Technology", "code": "DRKC" },
    { "name": "DRK Institute of Science and Technology", "code": "DRKI" },
    { "name": "Ellenki College of Engineering and Technology", "code": "ELNK" },
    { "name": "Ellenki Institute of Engineering and Technology", "code": "ELNI" },
    { "name": "Gandhi Academy of Technical Education", "code": "GATE" },
    { "name": "Global Institute of Engineering and Technology", "code": "GLOB" },
    { "name": "Gopal Reddy College of Engineering and Technology", "code": "GOPL" },
    { "name": "Gouthami Institute of Technology and Management for Women", "code": "GOUT" },
    { "name": "Hasvita Institute of Engineering and Technology", "code": "HASV" },
    { "name": "Hi-Tech Institute of Engineering and Technology", "code": "HITE" },
    { "name": "Hyderabad Institute of Technology and Management", "code": "HITM" },
    { "name": "Indur Institute of Engineering and Technology", "code": "INDU" },
    { "name": "Jagruti Institute of Engineering and Technology", "code": "JAGR" },
    { "name": "Jawaharlal Nehru Institute of Technology", "code": "JNIT" },
    { "name": "Jawaharlal Nehru Technological University College of Engineering, Jagtial", "code": "JNTJ" },
    { "name": "Jawaharlal Nehru Technological University College of Engineering, Manthani", "code": "JNTM" },
    { "name": "Jawaharlal Nehru Technological University College of Engineering, Sultanpur", "code": "JNTS" },
    { "name": "Joginpally B.R. Engineering College", "code": "JBRE" },
    { "name": "Jyothishmathi Institute of Technological Sciences", "code": "JYOT" },
    { "name": "Jyothishmathi Institute of Technology and Science", "code": "JYTS" },
    { "name": "Khammam Institute of Technology and Sciences", "code": "KITS" },
    { "name": "Kodada Institute of Technology and Science for Women", "code": "KODW" },
    { "name": "Kommuri Pratap Reddy Institute of Technology", "code": "KPRT" },
    { "name": "Kshatriya College of Engineering", "code": "KSHR" },
    { "name": "Kunda College of Technology and Management", "code": "KUND" },
    { "name": "Lingaiah Institute of Management and Technology", "code": "LING" },
    { "name": "Madira Institute of Technology and Sciences", "code": "MADI" },
    { "name": "Mahaveer Institute of Science and Technology", "code": "MAHA" },
    { "name": "Malla Reddy College of Engineering", "code": "MRCE" },
    { "name": "Malla Reddy Engineering College", "code": "MREC" },
    { "name": "Malla Reddy Engineering College for Women", "code": "MRW" },
    { "name": "Malla Reddy Institute of Engineering and Technology", "code": "MRIE" },
    { "name": "Malla Reddy Institute of Technology", "code": "MRIT" },
    { "name": "Manair College of Engineering and Technology", "code": "MANA" },
    { "name": "Medak College of Engineering and Technology", "code": "MEDK" },
    { "name": "Mina Institute of Engineering and Technology for Women", "code": "MINA" },
    { "name": "Mother Teresa Institute of Science and Technology", "code": "MOTH" },
    { "name": "Nagole Institute of Technology and Science", "code": "NGLI" },
    { "name": "Nalanda Institute of Engineering and Technology", "code": "NALA" },
    { "name": "Narsimha Reddy Engineering College", "code": "NRCM" },
    { "name": "Nawab Shah Alam Khan College of Engineering and Technology", "code": "NSAK" },
    { "name": "Nigama Engineering College", "code": "NIGA" },
    { "name": "Nishitha College of Engineering and Technology", "code": "NISH" },
    { "name": "Noble College of Engineering and Technology for Women", "code": "NOBL" },
    { "name": "Noorul Islam College of Engineering", "code": "NOOR" },
    { "name": "P. Indra Reddy Memorial Engineering College", "code": "PIND" },
    { "name": "Padmasri Dr. B.V. Raju Institute of Technology", "code": "BVRIT" },
    { "name": "Pallavi Engineering College", "code": "PALV" },
    { "name": "Patnam Mahender Reddy Memorial Engineering College", "code": "PATN" },
    { "name": "Pragathi Engineering College", "code": "PRAG" },
    { "name": "Priyadarshini College of Engineering and Technology", "code": "PRIY" },
    { "name": "Progressive Engineering College", "code": "PROG" },
    { "name": "R.G.R. Siddhanthi College", "code": "RGRS" },
    { "name": "R.R.S. College of Engineering and Technology", "code": "RRSC" },
    { "name": "Radhaswamy Institute of Technology", "code": "RADH" },
    { "name": "Raja Mahendra College of Engineering", "code": "RAJA" },
    { "name": "Rajiv Gandhi University of Knowledge Technologies", "code": "RGUKT" },
    { "name": "Ramappa Engineering College", "code": "RAMP" },
    { "name": "Royal Institute of Technology and Science", "code": "ROYL" },
    { "name": "S R Engineering College", "code": "SREC" },
    { "name": "S.S.J. Engineering College", "code": "SSJC" },
    { "name": "Sagar Institute of Technology", "code": "SAGR" },
    { "name": "Sai Spurthi Institute of Technology", "code": "SSIT" },
    { "name": "Samskruti College of Engineering and Technology", "code": "SAMS" },
    { "name": "Samskruti College of Engineering and Technology (Diploma)", "code": "SAMD" },
    { "name": "Sanskriti School of Engineering", "code": "SANS" },
    { "name": "Sant Samarth Engineering College", "code": "SANT" },
    { "name": "Santhi Ram Engineering College", "code": "SANR" },
    { "name": "Shadan College of Engineering and Technology", "code": "SHAD" },
    { "name": "Shadan Women's College of Engineering and Technology", "code": "SHDW" },
    { "name": "Sree Chaitanya College of Engineering", "code": "SCCC" },
    { "name": "Sree Chaitanya Institute of Technological Sciences", "code": "SCIS" },
    { "name": "Sree Dattha Group of Institutions", "code": "SDGI" },
    { "name": "Sree Dattha Institute of Engineering and Science", "code": "SDES" },
    { "name": "Sree Visvesvaraya Institute of Technology and Science", "code": "SVTS" },
    { "name": "Sridevi Women's Engineering College", "code": "SWEC" },
    { "name": "Sri Indu College of Engineering and Technology", "code": "SIND" },
    { "name": "Sri Indu Institute of Engineering and Technology", "code": "SIIE" },
    { "name": "Sri Sai Educational Society's Group of Institutions", "code": "SSES" },
    { "name": "St. Mary's Engineering College", "code": "STME" },
    { "name": "St. Mary's Group of Institutions Hyderabad", "code": "STMY" },
    { "name": "St. Peter's Engineering College", "code": "SPEC" },
    { "name": "St. Theressa Institute of Engineering and Technology", "code": "STTH" },
    { "name": "Sudharsan Engineering College", "code": "SUDH" },
    { "name": "Sujala Bharati Institute of Technology", "code": "SUJB" },
    { "name": "Sushrutha Institute of Technology", "code": "SUSH" },
    { "name": "Swarna Bharathi Institute of Science and Technology", "code": "SBIT" },
    { "name": "Syed Hashim College of Science and Technology", "code": "SYED" },
    { "name": "Teegala Krishna Reddy Engineering College", "code": "TKRE" },
    { "name": "Trinity College of Engineering and Technology", "code": "TRIN" },
    { "name": "Unity College of Engineering", "code": "UNTY" },
    { "name": "Vagdevi Engineering College", "code": "VAGD" },
    { "name": "Vardhaman College of Engineering", "code": "VARD" },
    { "name": "Vashista Institute of Science and Technology", "code": "VASH" },
    { "name": "Vathsalya Institute of Science and Technology", "code": "VATH" },
    { "name": "Venkateshwara Institute of Technology", "code": "VENK" },
    { "name": "Vidya Vikas Institute of Technology", "code": "VVIT" },
    { "name": "Vignan Institute of Technology and Science", "code": "VGNT" },
    { "name": "Vignan's Foundation for Science, Technology and Research", "code": "VFST" },
    { "name": "Vijay Rural Engineering College", "code": "VIJY" },
    { "name": "Visvesvaraya College of Engineering and Technology", "code": "VCET" },
    { "name": "Vivekananda Institute of Science and Information Technology", "code": "VISI" },
    { "name": "Vivekananda Institute of Technology and Science", "code": "VITS" },
    { "name": "Other / Not Listed", "code": "OTHER" }
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

    const otherOption = COLLEGES.find(c => c.code === "OTHER");
    const filteredColleges = [
        ...COLLEGES.filter(c =>
            c.code !== "OTHER" && (
                c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                c.code.toLowerCase().includes(collegeSearch.toLowerCase())
            )
        ),
        ...(otherOption ? [otherOption] : [])
    ];

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

    const REGISTRATIONS_CLOSED = true;

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] text-[#1A1C1E] font-sans flex flex-col selection:bg-blue-100">
            <StickyBanner className="bg-gradient-to-b from-rose-600 to-rose-700">
                <p className="mx-0 max-w-[90%] text-white drop-shadow-md text-[12px] md:text-[13px] font-medium leading-tight text-center md:text-left">
                    Enrollment for the Summer Bootcamp 2026 is now officially closed. If you have already registered, please sign in to access your dashboard.{" "}
                    <Link href="/intern/signin" className="transition duration-200 hover:underline font-bold whitespace-nowrap">
                        Sign in here
                    </Link>
                </p>
            </StickyBanner>

            {/* Minimal Header */}
            <header className="px-10 pt-6 flex-none">
                <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Portal</Link>
                    <ChevronRight size={10} className="text-slate-300" />
                    <span className="text-slate-600">Intern Enrollment</span>
                </nav>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 md:p-10">
                <div className="w-full max-w-[1050px] min-h-[600px] md:h-[700px] bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden rounded-xl">

                    {/* Left Branding Panel */}
                    <div className="hidden md:flex md:w-[35%] bg-slate-50 border-r border-slate-100 p-10 flex-col justify-between relative">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-10">
                                <img src="https://ik.imagekit.io/dypkhqxip/platform" alt="Platform" className="h-5 opacity-90" />
                                <div className="h-4 w-px bg-slate-200"></div>
                                <img src="https://ik.imagekit.io/dypkhqxip/sflogo" alt="SF" className="h-4 opacity-80" />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-lg font-semibold text-[#003366] tracking-tight">Industrial Workspace</h1>
                                <p className="text-slate-500 text-[13px] leading-relaxed">
                                    Join the professional ecosystem designed for the next generation of engineers and creators.
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-center">
                            <iframe
                                src="https://lottie.host/embed/521c9b48-ae0c-49ba-a951-9c0d31728f01/2oOdwYfKHI.lottie"
                                className="w-48 h-48 border-none opacity-80 grayscale-[20%]"
                            ></iframe>
                        </div>

                        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-40"></div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="flex-1 flex flex-col p-6 md:p-10 lg:px-16 overflow-y-auto custom-scrollbar">
                        <div className="max-w-[520px] w-full mx-auto">

                            {/* Enrollment Status Bar */}
                            <div className="mb-8">
                                {REGISTRATIONS_CLOSED ? (
                                    <div className="flex items-center gap-3 p-3.5 bg-rose-50 border border-rose-100 rounded-lg">
                                        <div className="h-8 w-8 bg-rose-600 text-white flex items-center justify-center rounded-md shrink-0">
                                            <ShieldAlert size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-rose-900 leading-tight">Enrollment Period Ended</p>
                                            <p className="text-[11px] text-rose-700 font-medium">Summer Bootcamp 2026 intake is now closed.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                                        <div className="h-8 w-8 bg-emerald-600 text-white flex items-center justify-center rounded-md shrink-0">
                                            <Info size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-emerald-900 leading-tight">Registration Open</p>
                                            <p className="text-[11px] text-emerald-700 font-medium">Enter your details to create your industrial profile.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`space-y-6 ${REGISTRATIONS_CLOSED ? "opacity-80 grayscale pointer-events-none select-none" : ""}`}>
                                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Register Intern Account</h2>

                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-slate-500 ml-1">First Name</label>
                                            <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="signup-input" placeholder="Ex: John" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-slate-500 ml-1">Last Name</label>
                                            <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="signup-input" placeholder="Ex: Doe" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-slate-500 ml-1">Contact Phone</label>
                                            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="signup-input" placeholder="+91 00000 00000" />
                                        </div>
                                        <div className="space-y-1.5 relative group">
                                            <label className="text-[10px] font-semibold text-slate-500 ml-1">College/University</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    autoComplete="off"
                                                    value={college || collegeSearch}
                                                    onFocus={() => setShowDropdown(true)}
                                                    onChange={(e) => { setCollegeSearch(e.target.value); setCollege(""); }}
                                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                                    className="signup-input pr-8"
                                                    placeholder="Search College..."
                                                />
                                                <School size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>

                                            {showDropdown && (
                                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-lg mt-1 max-h-48 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                                                    {filteredColleges.map((c, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => { setCollege(c.name); setCollegeSearch(c.name); }}
                                                            className="px-4 py-2.5 text-[12px] hover:bg-slate-50 cursor-pointer flex justify-between items-center group/item border-b border-slate-50 last:border-0"
                                                        >
                                                            <span className="text-slate-600 group-hover/item:text-[#003366] font-medium">{c.name}</span>
                                                            <span className="text-[9px] font-semibold bg-slate-100 text-slate-400 px-1.5 rounded uppercase">{c.code}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500 ml-1">Work Email</label>
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" placeholder="name@college.edu" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-semibold text-slate-500 ml-1">Password</label>
                                        <div className="relative">
                                            <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" placeholder="Min. 8 characters" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5 py-1">
                                        <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-[#003366] focus:ring-[#003366]" />
                                        <span className="text-[11px] text-slate-500 leading-normal">
                                            I agree to the <Link href="/terms" className="text-[#003366] font-semibold hover:underline">Terms of Service</Link> and data processing protocols.
                                        </span>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 text-[11px] font-medium border border-red-100 rounded-lg flex items-center gap-2">
                                            <ShieldAlert size={14} /> {error}
                                        </div>
                                    )}

                                    <button disabled={loading} type="submit" className="w-full h-10 bg-[#003366] text-white text-[13px] font-semibold rounded-lg hover:bg-[#002244] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Intern Account"}
                                    </button>
                                </form>
                            </div>

                            {/* Socials & Login Link */}
                            <div className="mt-8 flex flex-col items-center gap-6">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                    <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-widest">Connect</span>
                                    <div className="h-px bg-slate-100 flex-1"></div>
                                </div>

                                <div className="flex gap-3">
                                    <Link href="https://github.com/studentforge" target="_blank" className="social-icon"><Github size={18} /></Link>
                                    <Link href="https://www.linkedin.com/company/student-forge/" target="_blank" className="social-icon"><Linkedin size={18} /></Link>
                                    <Link href="https://www.instagram.com/studentforge/" target="_blank" className="social-icon"><Instagram size={18} /></Link>
                                    <Link href="https://discord.gg/9ZAnhkXD" target="_blank" className="social-icon">
                                        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.03-.005-.059.012-.072.0371-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495-.013-.025-.042-.042-.072-.037a19.7363 19.7363 0 00-4.8852 1.515c-.012.002-.023.011-.032.0277C.5334 9.0458-.319 13.5799.0992 18.0578c.002.019.013.04.0312.0561 2.0528 1.5076 4.0413 2.4228 5.9929 3.0294.032.01.0660-.003.0842-.0276.4616-.6304.8731-1.2952 1.226-1.9942.018-.033.004-.074-.0416-.1057-.6528-.2476-1.2743-.5495-1.8722-.8923-.048-.028-.051-.097-.0076-.1277.1258-.0943.2517-.1923.3718-.2914.025-.019.059-.026.0776-.0105 3.9278 1.7933 8.18 1.7933 12.0614 0 .018-.008.052-.001.0775.0095.1201.099.246.1981.3728.2924.044.03.041.099-.0066.1276a12.2986 12.2986 0 01-1.873.8914c-.045.016-.06.073-.0407.1067.3604.698.7719 1.3628 1.225 1.9932.018.024.049.038.0842.0286 1.961-.6067 3.9495-1.5219 6.0023-3.0294.018-.013.03-.034.0313-.0552.5004-5.177-.8382-9.6739-3.5485-13.6604a.0683.0683 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                    </Link>
                                </div>

                                <p className="text-[13px] text-slate-500 font-medium">
                                    Already registered? <Link href="/intern/signin" className="text-[#003366] font-semibold hover:underline decoration-1 underline-offset-4">Sign in here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="w-full py-6 px-10 flex-none bg-slate-100 border-t border-slate-200 mt-auto">
                <div className="max-w-[1050px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Link href="https://kiro.redlix.co.in/lms">
                            <img 
                                src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-05-14_at_17.46.09-removebg-preview.png?updatedAt=1778760997901" 
                                alt="Logo" 
                                className="h-14 w-auto opacity-80 hover:opacity-100 transition-all cursor-pointer"
                            />
                        </Link>
                        <div className="h-6 w-px bg-slate-300 hidden md:block" />
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                © {new Date().getFullYear()} Student Forge Technologies Pvt Ltd.
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
                                Powered by Cheetah Servers • Redlix Systems, Hyderabad
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-slate-400 font-semibold">
                        <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Security</span>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .signup-input {
                    @apply w-full h-11 bg-white border border-slate-300 px-4 text-[14px] text-slate-900 rounded-lg outline-none transition-all focus:border-[#003366] focus:ring-4 focus:ring-blue-50/50 placeholder:text-slate-400;
                }
                .social-icon {
                    @apply w-10 h-10 bg-white border border-slate-200 text-slate-400 flex items-center justify-center rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-[#003366] transition-all shadow-sm;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}