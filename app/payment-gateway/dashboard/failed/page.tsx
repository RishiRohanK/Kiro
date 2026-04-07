"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import TransactionTable from "../components/TransactionTable";

export default function FailedTransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment-gateway/stats");
      const json = await res.json();
      if (json.success) {
        
        const failed = json.data.filter((t: any) => 
          t.status.toLowerCase() === "failed" || 
          t.status.toLowerCase() === "rejected"
        );
        setData(failed);
      } else {
        setError(json.message || "Failed to load data");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statusColor = (status: string) => {
    return "text-red-600 bg-red-50 border-red-100";
  };

  return (
    <>
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 mb-2 text-red-600">
             <AlertCircle className="h-5 w-5" />
             <span className="text-[12px] font-bold uppercase tracking-widest italic">Action Required</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">Failed Transactions</h1>
          <p className="mt-2 text-[14px] text-zinc-500 font-medium">Critical focus on unsuccessful payment attempts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="flex h-11 items-center gap-2 border border-zinc-100 bg-white px-5 text-[13px] font-bold uppercase tracking-widest text-red-600 hover:bg-zinc-50 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Failures
          </button>
        </div>
      </div>

      <TransactionTable data={data} loading={loading} statusColor={statusColor} />
    </>
  );
}
