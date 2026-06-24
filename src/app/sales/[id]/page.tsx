import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: sale, error } = await supabase
    .from("Sale")
    .select("*, client:Client(*), Transaction(*)")
    .eq("id", id)
    .single();

  if (error || !sale) {
    notFound();
  }

  const transactions = sale.Transaction || [];
  const outstanding = Math.max(0, sale.totalExpectedAmount - sale.paymentReceived);
  const deliveryLoss = sale.litersReceived ? (sale.litersDespatched - sale.litersReceived) : 0;

  return (
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-fuchsia-50 via-white to-pink-50 -z-10 animate-gradient-x opacity-80" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute top-32 -left-32 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-float delay-500" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-fuchsia-200">
                {sale.client?.name?.charAt(0) || 'S'}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Sale #{sale.id.slice(0, 8)}</h1>
                <span className={`premium-badge ring-1 ${sale.litersReceived ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' : 'bg-amber-50 text-amber-700 ring-amber-200/50'}`}>
                  {sale.litersReceived ? 'DELIVERED' : 'IN TRANSIT'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono tracking-widest">Client: {sale.client?.name || 'Unknown'}</p>
            </div>
          </div>
          <Link href="/sales" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Sales
          </Link>
        </div>

        {/* Financial Overview Cards - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-75 group border-t-4 border-t-gray-900">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Total Billed</h3>
            <p className="text-5xl font-black text-gray-900 tracking-tighter group-hover:scale-105 origin-left transition-transform">₦{sale.totalExpectedAmount.toLocaleString()}</p>
          </div>
          
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-150 group border-t-4 border-t-emerald-500 bg-gradient-to-b from-emerald-50/30 to-transparent">
            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">Amount Received</h3>
            <p className="text-5xl font-black text-emerald-600 tracking-tighter group-hover:scale-105 origin-left transition-transform">₦{sale.paymentReceived.toLocaleString()}</p>
          </div>
          
          <div className={`glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-300 group border-t-4 ${outstanding > 0 ? 'border-t-red-500 bg-gradient-to-b from-red-50/50 to-transparent' : 'border-t-emerald-200 bg-gradient-to-b from-emerald-50/20 to-transparent'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${outstanding > 0 ? 'text-red-700' : 'text-emerald-700'}`}>Outstanding Balance</h3>
            <p className={`text-5xl font-black tracking-tighter group-hover:scale-105 origin-left transition-transform ${outstanding > 0 ? 'text-red-700' : 'text-emerald-800'}`}>₦{outstanding.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Delivery Specs */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Delivery Specs
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Liters Despatched</p>
                  <p className="text-gray-900 font-extrabold text-2xl tracking-tight">{sale.litersDespatched?.toLocaleString()}L</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Liters Received (Client)</p>
                  <p className="text-gray-900 font-extrabold text-2xl tracking-tight">{sale.litersReceived ? `${sale.litersReceived.toLocaleString()}L` : 'Pending'}</p>
                </div>
                
                {sale.litersReceived && (
                  <div className={`mt-6 p-4 rounded-2xl border ${deliveryLoss > 0 ? 'bg-red-50/80 border-red-200' : 'bg-emerald-50/80 border-emerald-200'}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${deliveryLoss > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Delivery Loss/Shortage</p>
                    <p className={`text-2xl font-black tracking-tight ${deliveryLoss > 0 ? 'text-red-800' : 'text-emerald-800'}`}>{deliveryLoss.toLocaleString()}L</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Sale Metadata</h2>
              <div className="space-y-4">
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Created At</p>
                  <p className="text-gray-900 font-semibold text-lg">{new Date(sale.createdAt).toLocaleString()}</p>
                </div>
                {sale.client && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href={`/clients/${sale.clientId}`} className="flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition-colors group">
                      View Client Dashboard
                      <svg className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Payment History */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-700">
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-white/40 flex justify-between items-center backdrop-blur-md">
                <h2 className="text-xl font-extrabold text-gray-900">Payment History for Sale</h2>
                <span className="premium-badge bg-emerald-100/50 text-emerald-700 ring-1 ring-emerald-200">{transactions.length} Payments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Date</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Txn Ref</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn: any) => (
                      <tr key={txn.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="p-5 text-sm text-gray-500 font-medium">{new Date(txn.date).toLocaleDateString()}</td>
                        <td className="p-5 text-sm">
                          <Link href={`/financials/${txn.id}`} className="font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                            #{txn.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-5 text-sm font-black text-emerald-600 text-right tracking-tight">₦{txn.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-12 text-center text-gray-400 font-medium">No payments have been logged against this sale yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
