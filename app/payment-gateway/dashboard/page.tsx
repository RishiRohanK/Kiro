"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import TransactionTable from "./components/TransactionTable";

export default function AllTransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment-gateway/stats");
      const json = await res.json();
      if (json.success) {
        
        
        setData(json.data);
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
    switch (status.toLowerCase()) {
      case "captured":
      case "verified":
      case "success":
        return "text-green-600 bg-green-50 border-green-100";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "rejected":
      case "failed":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-zinc-500 bg-zinc-50 border-zinc-100";
    }
  };

  const handleExport = (type: 'csv' | 'excel') => {
    if (data.length === 0) return;
    const headers = ["#", "Status", "Amount", "Order Count", "Order ID/Ref", "Timestamp", "Product Details"];
    const rows = data.map((row, idx) => [
      `Order ${idx + 1}`,
      row.status,
      row.amount,
      row.orderCount,
      row.orderId,
      new Date(row.timestamp).toLocaleString(),
      row.products
    ]);
    const csvContent = [headers, ...rows]
      .map(e => e.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: type === 'csv' ? 'text/csv;charset=utf-8;' : 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `all_transactions_${new Date().toISOString().slice(0, 10)}.${type === 'csv' ? 'csv' : 'xls'}`;
    link.click();
  };

  return (
    <>
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">All Transactions</h1>
          <p className="mt-2 text-[14px] text-zinc-500 font-medium">Monitoring all enrollment records across the system.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex h-11 items-center border border-zinc-100 bg-white px-5 text-[11px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50"
          >
            Export CSV
          </button>
          <button
            onClick={fetchStats}
            className="flex h-11 items-center gap-2 border border-zinc-100 bg-white px-5 text-[13px] font-bold uppercase tracking-widest text-[#0055FF] hover:bg-zinc-50 active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </div>

      <TransactionTable data={data} loading={loading} statusColor={statusColor} />
    </>
  );
}
