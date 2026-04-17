import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";
import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-2">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Terms of Service</h1>
            <p className="text-zinc-500 font-bold text-[11px] uppercase tracking-widest">Simplifying your internship agreement</p>
          </div>

          <div className="space-y-12 text-[14px] leading-relaxed text-zinc-600">
            
            <section className="space-y-3">
              <h2 className="text-[12px] font-black text-black uppercase tracking-widest">01. Eligibility (MOU Colleges)</h2>
              <p>
                This internship program is exclusively available to students from colleges that have a signed <span className="text-black font-bold">Memorandum of Understanding (MOU)</span> with Student Forge. If your college is not an authorized MOU partner, your application will not be processed.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[12px] font-black text-black uppercase tracking-widest">02. Data & Privacy</h2>
              <p>
                We collect your name, email, phone number, and college details to manage your internship profile. Your data is shared with your respective college coordinators for attendance and performance tracking. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[12px] font-black text-black uppercase tracking-widest">03. Professional Conduct</h2>
              <p>
                Interns must maintain a high standard of professional ethics. Plagiarism or copying code from others without proper authorization will lead to immediate disqualification from the Batch 3 program.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[12px] font-black text-black uppercase tracking-widest">04. Ownership of Work</h2>
              <p>
                All projects and code created during the internship remain the property of Student Forge Technologies. You are free to showcase your work in your portfolio with official attribution to the Forge.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-[12px] font-black text-black uppercase tracking-widest">05. Certification</h2>
              <p>
                Certificates are issued only upon successful completion of all assigned tasks and maintaining a minimum of 80% attendance/submission rate.
              </p>
            </section>

          </div>

          <div className="pt-10 border-t border-zinc-100 flex flex-col items-center gap-6">
            <p className="text-[12px] text-zinc-400 font-medium text-center italic">
              By proceeding with registration, you agree to these simple terms.
            </p>
            <Link href="/intern/signup" className="w-full bg-black text-white py-4 text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-none text-center rounded-none">
              Accept and Go Back to Registration
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
