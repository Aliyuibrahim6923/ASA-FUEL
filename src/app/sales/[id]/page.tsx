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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center text-2xl font-bold text-fuchsia-700">
            {sale.client?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Sale #{sale.id.slice(0, 8)}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Client: {sale.client?.name || 'Unknown'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${sale.litersReceived ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {sale.litersReceived ? 'DELIVERED' : 'IN TRANSIT'}
          </span>
          <Link href="/sales" className="btn-secondary">
            ← Back to Sales
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Billed</h3>
          <p className="text-3xl font-bold text-gray-900">₦{sale.totalExpectedAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount Received</h3>
          <p className="text-3xl font-bold text-emerald-600">₦{sale.paymentReceived.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-center ${outstanding > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${outstanding > 0 ? 'text-red-700' : 'text-emerald-700'}`}>Outstanding Balance</h3>
          <p className={`text-3xl font-bold ${outstanding > 0 ? 'text-red-700' : 'text-emerald-900'}`}>₦{outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Delivery Specs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Delivery Specifications</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Liters Despatched</p>
                <p className="text-xl font-bold text-gray-900">{sale.litersDespatched?.toLocaleString()}L</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Liters Received (Client)</p>
                <p className="text-xl font-bold text-gray-900">{sale.litersReceived ? `${sale.litersReceived.toLocaleString()}L` : 'Pending'}</p>
              </div>
              {sale.litersReceived && (
                <div className={`p-3 rounded-lg border ${deliveryLoss > 0 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${deliveryLoss > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Delivery Loss/Shortage</p>
                  <p className={`text-lg font-bold ${deliveryLoss > 0 ? 'text-red-900' : 'text-emerald-900'}`}>{deliveryLoss.toLocaleString()}L</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Sale Metadata</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-gray-900 font-medium">{new Date(sale.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Payment History for Sale</h2>
              <span className="badge badge-success">{transactions.length} Payments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Txn Ref</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((txn: any) => (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-600">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        <Link href={`/financials/${txn.id}`} className="text-indigo-600 hover:underline">
                          #{txn.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="p-4 text-sm font-bold text-emerald-600 text-right">₦{txn.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">No payments have been logged against this sale yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
