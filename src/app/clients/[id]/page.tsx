import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: client, error } = await supabase
    .from("Client")
    .select("*, Sale(*), Transaction(*)")
    .eq("id", id)
    .single();

  if (error || !client) {
    notFound();
  }

  // Financial Calculations
  const sales = client.Sale || [];
  const transactions = client.Transaction || [];

  const totalExpected = sales.reduce((sum: number, s: any) => sum + (s.totalExpectedAmount || 0), 0);
  const totalPaid = sales.reduce((sum: number, s: any) => sum + (s.paymentReceived || 0), 0);
  const outstanding = Math.max(0, totalExpected - totalPaid);

  return (
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-indigo-50 via-white to-orange-50 -z-10 animate-gradient-x opacity-80" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute top-32 -left-32 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-float delay-500" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-indigo-200">
                {client.name.charAt(0)}
              </div>
              {client.isActive && <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full shadow-sm" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{client.name}</h1>
                <span className="premium-badge bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50">
                  {client.clientType?.replace('_', ' ') || 'Client'}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono">ID: {client.id.slice(0, 12)}</p>
            </div>
          </div>
          <Link href="/clients" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Directory
          </Link>
        </div>

        {/* Financial Overview Cards - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-75 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Billed Revenue</h3>
            <p className="text-4xl font-black text-gray-900 tracking-tighter">₦{totalExpected.toLocaleString()}</p>
          </div>
          
          <div className="glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-150 group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Total Paid</h3>
            <p className="text-4xl font-black text-emerald-600 tracking-tighter">₦{totalPaid.toLocaleString()}</p>
          </div>
          
          <div className={`glass-card rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-300 group ${outstanding > 0 ? 'bg-gradient-to-br from-red-50/80 to-white border-red-100/50' : ''}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm ${outstanding > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${outstanding > 0 ? 'text-red-700/70' : 'text-gray-500'}`}>Outstanding Debt</h3>
            <p className={`text-4xl font-black tracking-tighter ${outstanding > 0 ? 'text-red-700' : 'text-gray-900'}`}>₦{outstanding.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Client Info */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Contact Details</h2>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Contact Person
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform">{client.contactPerson || 'N/A'}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform">{client.phone || 'N/A'}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform">{client.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Historical Data */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-700">
            
            {/* Sales Ledger */}
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-white/40 flex justify-between items-center backdrop-blur-md">
                <h2 className="text-xl font-extrabold text-gray-900">Sales Ledger</h2>
                <span className="premium-badge bg-blue-100/50 text-blue-700 ring-1 ring-blue-200">{sales.length} Orders</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Date</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Sale Ref</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Volume</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Billed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {sales.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((sale: any) => (
                      <tr key={sale.id} className="hover:bg-white/60 transition-colors group cursor-pointer">
                        <td className="p-5 text-sm text-gray-500 font-medium">{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td className="p-5 text-sm">
                          <Link href={`/sales/${sale.id}`} className="font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                            #{sale.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-5 text-sm text-gray-700 font-semibold">{sale.litersDespatched?.toLocaleString()}L</td>
                        <td className="p-5 text-sm font-black text-gray-900 text-right tracking-tight">₦{sale.totalExpectedAmount?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">No sales history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-white/40 flex justify-between items-center backdrop-blur-md">
                <h2 className="text-xl font-extrabold text-gray-900">Payment History</h2>
                <span className="premium-badge bg-emerald-100/50 text-emerald-700 ring-1 ring-emerald-200">{transactions.length} Payments</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Date</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Txn Ref</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Purpose</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn: any) => (
                      <tr key={txn.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="p-5 text-sm text-gray-500 font-medium">{new Date(txn.date).toLocaleDateString()}</td>
                        <td className="p-5 text-sm font-medium text-gray-900">
                          <Link href={`/financials/${txn.id}`} className="font-bold text-emerald-600 group-hover:text-emerald-500 transition-colors">
                            #{txn.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-5">
                          <span className="premium-badge bg-gray-100/80 text-gray-600 ring-1 ring-gray-200">
                            {txn.paymentPurpose?.replace('_', ' ') || 'Deposit'}
                          </span>
                        </td>
                        <td className="p-5 text-sm font-black text-emerald-600 text-right tracking-tight">₦{txn.amount?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-gray-400 font-medium">No payment history found.</td>
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
