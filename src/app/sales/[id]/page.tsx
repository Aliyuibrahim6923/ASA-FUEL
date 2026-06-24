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
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-700 border border-gray-200">
              {sale.client?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Sale #{sale.id.slice(0, 8)}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-widest ${sale.litersReceived ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {sale.litersReceived ? 'DELIVERED' : 'IN TRANSIT'}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">Client: {sale.client?.name || 'Unknown'}</p>
            </div>
          </div>
          <Link href="/sales" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            ← Back to Sales
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {/* Strict 12-Column Grid for Metrics */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Billed</h3>
            <p className="text-4xl font-bold text-gray-900 font-mono tracking-tight">₦{sale.totalExpectedAmount.toLocaleString()}</p>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Amount Received</h3>
            <p className="text-4xl font-bold text-emerald-600 font-mono tracking-tight">₦{sale.paymentReceived.toLocaleString()}</p>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            {outstanding > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Outstanding Balance</h3>
            <p className={`text-4xl font-bold font-mono tracking-tight ${outstanding > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              ₦{outstanding.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Layout: 4 cols for Delivery Specs, 8 cols for Ledger */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* 4-Column Sidebar: Delivery Specs & Metadata */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Delivery Specs</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Liters Despatched</p>
                  <p className="text-gray-900 font-medium font-mono text-xl tracking-tight">{sale.litersDespatched?.toLocaleString()}L</p>
                </div>
                <div className="h-px bg-gray-200 w-full" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Liters Received (Client)</p>
                  <p className="text-gray-900 font-medium font-mono text-xl tracking-tight">{sale.litersReceived ? `${sale.litersReceived.toLocaleString()}L` : 'Pending'}</p>
                </div>
                
                {sale.litersReceived && (
                  <div className={`mt-4 p-4 rounded-lg border ${deliveryLoss > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${deliveryLoss > 0 ? 'text-red-600' : 'text-gray-500'}`}>Delivery Loss/Shortage</p>
                    <p className={`text-xl font-bold font-mono tracking-tight ${deliveryLoss > 0 ? 'text-red-600' : 'text-gray-900'}`}>{deliveryLoss.toLocaleString()}L</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Sale Metadata</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Created At</p>
                  <p className="text-gray-900 font-medium">{new Date(sale.createdAt).toLocaleString()}</p>
                </div>
                {sale.client && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link href={`/clients/${sale.clientId}`} className="text-indigo-600 hover:text-indigo-900 font-bold flex items-center gap-1 group">
                      View Client Dashboard
                      <span className="text-sm ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 8-Column Data Section: Payment Ledger */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Payment History for Sale</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {transactions.length} Records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Txn Ref</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn: any) => (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{new Date(txn.date).toLocaleDateString()}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                          <Link href={`/financials/${txn.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                            #{txn.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-emerald-600 text-right font-mono font-bold">₦{txn.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">No payments have been logged against this sale yet.</td>
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
