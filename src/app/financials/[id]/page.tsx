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
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold border ${isInflow ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
              {isInflow ? '↓' : '↑'}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transaction</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-widest ${isInflow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {transaction.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">{transaction.category?.replace('_', ' ') || 'Financial Record'} • {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>
          <Link href="/financials" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            ← Back to Ledger
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-10">
        
        {/* Main Amount Card - Focused Focal Point */}
        <div className="bg-white rounded-xl border border-gray-200 p-12 shadow-sm text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${isInflow ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Transaction Amount</h2>
          <p className={`text-6xl md:text-8xl font-bold font-mono tracking-tighter mb-6 ${isInflow ? 'text-emerald-600' : 'text-red-600'}`}>
            {isInflow ? '+' : '-'}₦{transaction.amount.toLocaleString()}
          </p>
          <span className="inline-flex items-center px-4 py-1.5 rounded-md text-sm font-bold bg-gray-100 text-gray-800 border border-gray-200 uppercase tracking-widest">
            {transaction.paymentPurpose?.replace('_', ' ') || transaction.category?.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Related Entities Column */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest px-2">Related Entities</h2>
            
            {transaction.client && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Associated Client</p>
                <p className="text-gray-900 font-bold text-lg mb-3">{transaction.client.name}</p>
                <Link href={`/clients/${transaction.clientId}`} className="text-sm text-indigo-600 font-bold hover:text-indigo-900">
                  View Client Profile →
                </Link>
              </div>
            )}
            
            {transaction.transporter && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Associated Transporter</p>
                <p className="text-gray-900 font-bold text-lg mb-3">{transaction.transporter.name}</p>
                <Link href={`/fleet/transporter/${transaction.transporterId}`} className="text-sm text-indigo-600 font-bold hover:text-indigo-900">
                  View Transporter Profile →
                </Link>
              </div>
            )}

            {transaction.sale && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Associated Sale</p>
                <p className="text-gray-900 font-bold text-lg mb-3">Sale #{transaction.saleId.slice(0,8)}</p>
                <Link href={`/sales/${transaction.saleId}`} className="text-sm text-indigo-600 font-bold hover:text-indigo-900">
                  View Sale Invoice →
                </Link>
              </div>
            )}

            {transaction.order && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Associated Order</p>
                <p className="text-gray-900 font-bold text-lg mb-3">Order #{transaction.orderId.slice(0,8)}</p>
                <Link href={`/orders/${transaction.orderId}`} className="text-sm text-indigo-600 font-bold hover:text-indigo-900">
                  View Order Details →
                </Link>
              </div>
            )}

            {(!transaction.client && !transaction.transporter && !transaction.sale && !transaction.order) && (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
                <p className="text-sm text-gray-500 font-medium">No linked entities for this transaction.</p>
              </div>
            )}
          </div>

          {/* Audit Details Column */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest px-2">Audit Log</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Reference / Note</p>
                <p className="text-gray-900 font-medium">{transaction.reference || 'N/A'}</p>
              </div>
              <div className="h-px bg-gray-200 w-full" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Date Logged</p>
                <p className="text-gray-900 font-medium">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div className="h-px bg-gray-200 w-full" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">System TXN ID</p>
                <p className="text-gray-900 font-mono text-sm break-all">{transaction.id}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
