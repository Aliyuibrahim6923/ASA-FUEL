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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${isInflow ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {isInflow ? '↓' : '↑'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Transaction #{transaction.id.slice(0, 8)}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{transaction.category?.replace('_', ' ') || 'Financial Record'} • {new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${isInflow ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {transaction.type}
          </span>
          <Link href="/financials" className="btn-secondary">
            ← Back to Ledger
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Amount Card */}
        <div className={`lg:col-span-3 rounded-2xl p-10 border shadow-sm flex flex-col items-center justify-center ${isInflow ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <h2 className={`text-sm font-bold uppercase tracking-widest mb-4 ${isInflow ? 'text-emerald-700' : 'text-red-700'}`}>Transaction Amount</h2>
          <p className={`text-6xl font-black tracking-tight ${isInflow ? 'text-emerald-900' : 'text-red-900'}`}>
            {isInflow ? '+' : '-'} ₦{transaction.amount.toLocaleString()}
          </p>
          <p className={`mt-6 text-lg font-medium ${isInflow ? 'text-emerald-800' : 'text-red-800'}`}>
            {transaction.paymentPurpose?.replace('_', ' ') || transaction.category?.replace('_', ' ')}
          </p>
        </div>

        {/* References & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Related Entities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {transaction.client && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Associated Client</p>
                  <p className="text-gray-900 font-bold mb-2">{transaction.client.name}</p>
                  <Link href={`/clients/${transaction.clientId}`} className="text-sm text-indigo-600 hover:underline font-medium">View Client Dashboard →</Link>
                </div>
              )}
              
              {transaction.transporter && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Associated Transporter</p>
                  <p className="text-gray-900 font-bold mb-2">{transaction.transporter.name}</p>
                  <Link href={`/fleet/transporter/${transaction.transporterId}`} className="text-sm text-orange-600 hover:underline font-medium">View Transporter Profile →</Link>
                </div>
              )}

              {transaction.sale && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-fuchsia-600 uppercase tracking-wider mb-1">Associated Sale</p>
                  <p className="text-gray-900 font-bold mb-2">Sale #{transaction.saleId.slice(0,8)}</p>
                  <Link href={`/sales/${transaction.saleId}`} className="text-sm text-fuchsia-600 hover:underline font-medium">View Sale Invoice →</Link>
                </div>
              )}

              {transaction.order && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Associated Order</p>
                  <p className="text-gray-900 font-bold mb-2">Order #{transaction.orderId.slice(0,8)}</p>
                  <Link href={`/orders/${transaction.orderId}`} className="text-sm text-blue-600 hover:underline font-medium">View Order Details →</Link>
                </div>
              )}

              {(!transaction.client && !transaction.transporter && !transaction.sale && !transaction.order) && (
                <div className="col-span-2 text-center py-6 text-gray-500">
                  No linked entities for this transaction.
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Audit Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Transaction Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reference / Note</p>
                <p className="text-gray-900 font-medium">{transaction.reference || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Logged</p>
                <p className="text-gray-900 font-medium">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded break-all">{transaction.id}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
