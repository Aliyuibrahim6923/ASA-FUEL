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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-700">
            {client.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{client.name}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{client.clientType?.replace('_', ' ') || 'Client'} • ID: {client.id.slice(0, 8)}</p>
          </div>
        </div>
        <Link href="/clients" className="btn-secondary flex items-center gap-2">
          ← Back to Clients
        </Link>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Billed Revenue</h3>
          <p className="text-3xl font-bold text-gray-900">₦{totalExpected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Paid</h3>
          <p className="text-3xl font-bold text-emerald-600">₦{totalPaid.toLocaleString()}</p>
        </div>
        <div className={`rounded-2xl p-6 border shadow-sm flex flex-col justify-center ${outstanding > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${outstanding > 0 ? 'text-red-700' : 'text-gray-500'}`}>Outstanding Debt</h3>
          <p className={`text-3xl font-bold ${outstanding > 0 ? 'text-red-700' : 'text-gray-900'}`}>₦{outstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Client Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Contact Person</p>
                <p className="text-gray-900 font-medium">{client.contactPerson || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-gray-900 font-medium">{client.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{client.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Physical Address</p>
                <p className="text-gray-900 font-medium">{client.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Client Since</p>
                <p className="text-gray-900 font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Data */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Sales Ledger */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Sales Ledger</h2>
              <span className="badge badge-info">{sales.length} Orders</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Sale ID</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Volume</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Total Billed</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sales.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((sale: any) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-600">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-sm font-medium text-gray-900">
                        <Link href={`/sales/${sale.id}`} className="text-indigo-600 hover:underline">
                          #{sale.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{sale.litersDespatched?.toLocaleString()}L</td>
                      <td className="p-4 text-sm font-bold text-gray-900">₦{sale.totalExpectedAmount?.toLocaleString()}</td>
                      <td className="p-4 text-sm">
                        {sale.litersReceived ? (
                           <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">Delivered</span>
                        ) : (
                           <span className="inline-flex px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">In Transit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No sales history found for this client.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
              <span className="badge badge-success">{transactions.length} Payments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Transaction ID</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Amount Paid</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Purpose</th>
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
                      <td className="p-4 text-sm font-bold text-emerald-600">₦{txn.amount?.toLocaleString()}</td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                          {txn.paymentPurpose?.replace('_', ' ') || 'Deposit'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">No payment history found for this client.</td>
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
