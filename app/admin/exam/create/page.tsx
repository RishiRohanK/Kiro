"use client";

import { useState } from "react";
import { 
    Shield, 
    Plus, 
    Trash2, 
    Globe,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

const PREDEFINED_GUIDELINES = [
    "Switching tabs will lead to immediate disqualification.",
    "Multiple faces detection will trigger a security violation.",
    "Calculators and external resources are strictly prohibited.",
    "Ensure a stable internet connection throughout the duration.",
    "The exam will automatically submit when the timer hits zero."
];

export default function ExamCreationPortal() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [examData, setExamData] = useState({
        title: "",
        syllabus: "",
        date: "",
        time: "",
        duration: "",
        guidelines: [...PREDEFINED_GUIDELINES],
        questions: [] as any[]
    });

    const [newGuideline, setNewGuideline] = useState("");

    const addGuideline = () => {
        if (newGuideline.trim()) {
            setExamData({ ...examData, guidelines: [...examData.guidelines, newGuideline.trim()] });
            setNewGuideline("");
        }
    };

    const removeGuideline = (index: number) => {
        setExamData({ ...examData, guidelines: examData.guidelines.filter((_, i) => i !== index) });
    };

    const addQuestion = (type: string) => {
        const newQuestion = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            question: "",
            options: type === "MCQ" ? ["", "", "", ""] : [],
            correctAnswer: "",
            imageUrl: "",
            points: 1
        };
        setExamData({ ...examData, questions: [...examData.questions, newQuestion] });
    };

    const updateQuestion = (id: string, updates: any) => {
        setExamData({
            ...examData,
            questions: examData.questions.map(q => q.id === id ? { ...q, ...updates } : q)
        });
    };

    const removeQuestion = (id: string) => {
        setExamData({ ...examData, questions: examData.questions.filter(q => q.id !== id) });
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/exam", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(examData)
            });
            if (res.ok) router.push("/cleed/dashboard");
        } catch (err) { console.error("Publish fail"); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-violet-50 flex flex-col">
            {/* Simple Header */}
            <header className="border-b border-zinc-100 px-6 h-16 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-violet-600 rounded flex items-center justify-center text-white">
                        <Shield size={18} />
                    </div>
                    <h1 className="text-sm font-bold uppercase tracking-tight">Exam Creator</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 w-6 ${step >= s ? 'bg-violet-600' : 'bg-slate-100'}`} />
                        ))}
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto w-full py-12 px-6 flex-1">
                {step === 1 && (
                    <div className="space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Exam Details</h2>
                            <p className="text-sm text-slate-500">Provide the basic parameters for the exam.</p>
                        </div>

                        <div className="space-y-6">
                            <InputBox label="Exam Title" value={examData.title} onChange={(v: string) => setExamData({...examData, title: v})} placeholder="e.g. Backend Development Quiz" />
                            <div className="grid grid-cols-2 gap-4">
                                <InputBox label="Date" type="date" value={examData.date} onChange={(v: string) => setExamData({...examData, date: v})} />
                                <InputBox label="Time" type="time" value={examData.time} onChange={(v: string) => setExamData({...examData, time: v})} />
                            </div>
                            <InputBox label="Duration (Minutes)" type="number" value={examData.duration} onChange={(v: string) => setExamData({...examData, duration: v})} placeholder="60" />
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none block ml-1">Syllabus</label>
                                <textarea 
                                    value={examData.syllabus}
                                    onChange={e => setExamData({...examData, syllabus: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 text-sm font-medium outline-none focus:border-violet-600 min-h-[120px]"
                                    placeholder="Summary of topics..."
                                />
                            </div>
                        </div>

                        <button onClick={() => setStep(2)} className="w-full h-12 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-200">
                            Next: Guidelines
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Guidelines</h2>
                            <p className="text-sm text-slate-500">Review and add rules for the exam.</p>
                        </div>

                        <div className="space-y-3">
                            {examData.guidelines.map((g, idx) => (
                                <div key={idx} className="flex justify-between items-start p-4 bg-slate-50 border border-slate-100">
                                    <span className="text-sm font-medium pr-4 text-slate-600">{g}</span>
                                    <button onClick={() => removeGuideline(idx)} className="text-slate-300 hover:text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input 
                                value={newGuideline} onChange={e => setNewGuideline(e.target.value)}
                                className="flex-1 h-12 bg-slate-50 border border-slate-200 px-4 text-sm outline-none focus:border-violet-600"
                                placeholder="New rule..."
                            />
                            <button onClick={addGuideline} className="px-6 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-violet-100">Add</button>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button onClick={() => setStep(1)} className="flex-1 h-12 border border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Back</button>
                            <button onClick={() => setStep(3)} className="flex-1 h-12 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-violet-100">Next: Questions</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Question Paper</h2>
                            <p className="text-sm text-slate-500">Create the set of questions.</p>
                        </div>

                        <div className="space-y-8">
                            {examData.questions.map((q, idx) => (
                                <div key={q.id} className="p-6 border border-slate-200 bg-white space-y-4 shadow-sm">
                                    <div className="flex justify-between border-b border-slate-100 pb-3">
                                        <span className="text-[11px] font-bold text-violet-600 uppercase tracking-widest">Question {idx + 1} // {q.type}</span>
                                        <button onClick={() => removeQuestion(q.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                    <textarea 
                                        value={q.question} onChange={e => updateQuestion(q.id, {question: e.target.value})}
                                        className="w-full text-sm font-bold bg-slate-50 p-4 border border-slate-100 min-h-[80px] outline-none focus:border-violet-600"
                                        placeholder="Statement..."
                                    />
                                    {q.type === "MCQ" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {q.options.map((opt: string, optIdx: number) => (
                                                <input key={optIdx} value={opt} onChange={e => {
                                                    const newOpts = [...q.options]; newOpts[optIdx] = e.target.value;
                                                    updateQuestion(q.id, {options: newOpts});
                                                }} className="h-10 border border-slate-100 px-3 text-xs outline-none focus:border-violet-600 bg-slate-50 font-medium" placeholder={`Option ${String.fromCharCode(65+optIdx)}`} />
                                            ))}
                                        </div>
                                    )}
                                    <input 
                                        value={q.correctAnswer} onChange={e => updateQuestion(q.id, {correctAnswer: e.target.value})}
                                        className="w-full h-10 border border-slate-100 px-3 text-xs outline-none focus:border-violet-600 bg-slate-50 font-medium"
                                        placeholder="Correct Answer..."
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <TypeBtn label="MCQ" onClick={() => addQuestion("MCQ")} />
                            <TypeBtn label="Text" onClick={() => addQuestion("TEXT")} />
                            <TypeBtn label="Blanks" onClick={() => addQuestion("FILL_IN_BLANK")} />
                            <TypeBtn label="Image" onClick={() => addQuestion("IMAGE_BASED")} />
                        </div>

                        <div className="flex gap-2 pt-6">
                            <button onClick={() => setStep(2)} className="flex-1 h-12 border border-slate-200 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Back</button>
                            <button onClick={handlePublish} disabled={loading || examData.questions.length === 0} className="flex-1 h-12 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-violet-700 disabled:opacity-50 shadow-lg shadow-violet-100">
                                {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Finish and Publish"}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function InputBox({ label, value, onChange, type = "text", placeholder = "" }: { 
    label: string, 
    value: string | number, 
    onChange: (v: string) => void, 
    type?: string, 
    placeholder?: string 
}) {
    return (
        <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none block ml-1">{label}</label>
            <input 
                type={type} value={value} onChange={e => onChange(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-slate-200 px-4 text-sm font-medium outline-none focus:border-violet-600 transition-all rounded-none"
                placeholder={placeholder}
            />
        </div>
    );
}

function TypeBtn({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="h-10 border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:bg-violet-600 hover:border-violet-600 hover:text-white transition-all text-slate-500 rounded-none bg-white font-medium">
            + {label}
        </button>
    );
}
