import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: transaction, error } = await supabase
    .from("Transaction")
    .select("*, client:Client(*), transporter:Transporter(*), sale:Sale(*), order:Order(*)")
    .eq("id", id)
    .single();

  if (error || !transaction) {
    notFound();
  }

  const isInflow = transaction.type === 'INFLOW';

  return (
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className={`absolute top-0 inset-x-0 h-[500px] -z-10 animate-gradient-x opacity-80 ${isInflow ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white' : 'bg-gradient-to-br from-red-50 via-rose-50 to-white'}`} />
      <div className={`absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-3xl animate-float ${isInflow ? 'bg-emerald-200/30' : 'bg-red-200/30'}`} />
      <div className={`absolute top-32 -left-32 w-80 h-80 rounded-full blur-3xl animate-float delay-500 ${isInflow ? 'bg-teal-200/20' : 'bg-orange-200/20'}`} />

      <div className="p-8 max-w-5xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl ${isInflow ? 'bg-gradient-to-br from-emerald-500 to-teal-400 shadow-emerald-200/50' : 'bg-gradient-to-br from-red-500 to-rose-400 shadow-red-200/50'}`}>
                <span className="text-white drop-shadow-md">{isInflow ? '↓' : '↑'}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Transaction</h1>
                <span className={`premium-badge ring-1 ${isInflow ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' : 'bg-red-50 text-red-700 ring-red-200/50'}`}>
                  {transaction.type}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono tracking-widest uppercase">{transaction.category?.replace('_', ' ') || 'Financial Record'} • {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
          <Link href="/financials" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Ledger
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Amount Card - Full Width Focus */}
          <div className={`lg:col-span-3 glass-card rounded-[2rem] p-16 flex flex-col items-center justify-center animate-fade-in-up delay-150 border-t-8 ${isInflow ? 'border-t-emerald-500 bg-emerald-50/20' : 'border-t-red-500 bg-red-50/20'}`}>
            <h2 className={`text-sm font-black uppercase tracking-widest mb-6 ${isInflow ? 'text-emerald-600/80' : 'text-red-600/80'}`}>Transaction Amount</h2>
            <div className="relative group">
              <p className={`text-8xl font-black tracking-tighter ${isInflow ? 'text-emerald-600' : 'text-red-600'}`}>
                {isInflow ? '+' : '-'}₦{transaction.amount.toLocaleString()}
              </p>
              {/* Subtle glowing effect behind text */}
              <div className={`absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10 ${isInflow ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            </div>
            <p className={`mt-8 px-6 py-2 rounded-full text-lg font-bold border ${isInflow ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
              {transaction.paymentPurpose?.replace('_', ' ') || transaction.category?.replace('_', ' ')}
            </p>
          </div>

          {/* References & Metadata */}
          <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-300">
            <div className="glass-card rounded-3xl p-8 h-full">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Related Entities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transaction.client && (
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 group hover:bg-indigo-50 transition-colors">
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1.5">Associated Client</p>
                    <p className="text-gray-900 font-extrabold text-xl mb-3">{transaction.client.name}</p>
                    <Link href={`/clients/${transaction.clientId}`} className="text-sm text-indigo-600 font-bold flex items-center gap-1 group-hover:text-indigo-800 transition-colors">
                      Client Dashboard <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                )}
                
                {transaction.transporter && (
                  <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50 group hover:bg-orange-50 transition-colors">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1.5">Associated Transporter</p>
                    <p className="text-gray-900 font-extrabold text-xl mb-3">{transaction.transporter.name}</p>
                    <Link href={`/fleet/transporter/${transaction.transporterId}`} className="text-sm text-orange-600 font-bold flex items-center gap-1 group-hover:text-orange-800 transition-colors">
                      Transporter Profile <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                )}

                {transaction.sale && (
                  <div className="p-5 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100/50 group hover:bg-fuchsia-50 transition-colors">
                    <p className="text-xs font-black text-fuchsia-500 uppercase tracking-widest mb-1.5">Associated Sale</p>
                    <p className="text-gray-900 font-extrabold text-xl mb-3">Sale #{transaction.saleId.slice(0,8)}</p>
                    <Link href={`/sales/${transaction.saleId}`} className="text-sm text-fuchsia-600 font-bold flex items-center gap-1 group-hover:text-fuchsia-800 transition-colors">
                      Sale Invoice <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                )}

                {transaction.order && (
                  <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:bg-blue-50 transition-colors">
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1.5">Associated Order</p>
                    <p className="text-gray-900 font-extrabold text-xl mb-3">Order #{transaction.orderId.slice(0,8)}</p>
                    <Link href={`/orders/${transaction.orderId}`} className="text-sm text-blue-600 font-bold flex items-center gap-1 group-hover:text-blue-800 transition-colors">
                      Order Details <svg className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                )}

                {(!transaction.client && !transaction.transporter && !transaction.sale && !transaction.order) && (
                  <div className="col-span-2 text-center py-10 text-gray-400 font-medium border-2 border-dashed border-gray-200 rounded-2xl">
                    No linked entities for this transaction.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audit Details */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8 h-full">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Audit Log
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Reference / Note</p>
                  <p className="text-gray-900 font-semibold text-lg">{transaction.reference || 'N/A'}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Date Logged</p>
                  <p className="text-gray-900 font-semibold text-lg">{new Date(transaction.createdAt).toLocaleString()}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">System TXN ID</p>
                  <p className="text-gray-900 font-mono text-xs bg-gray-100/50 p-3 rounded-xl border border-gray-200/50 break-all">{transaction.id}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
