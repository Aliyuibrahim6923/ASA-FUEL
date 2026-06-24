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
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-700 border border-gray-200">
              {client.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{client.name}</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 uppercase tracking-widest">
                  {client.clientType?.replace('_', ' ') || 'Client'}
                </span>
                {client.isActive && <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-widest">Active</span>}
              </div>
              <p className="text-sm text-gray-500 font-mono">ID: {client.id.slice(0, 12)}</p>
            </div>
          </div>
          <Link href="/clients" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            ← Back to Directory
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {/* Strict 12-Column Grid for Metrics */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Billed Revenue</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight">₦{totalExpected.toLocaleString()}</p>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Paid</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight">₦{totalPaid.toLocaleString()}</p>
          </div>
          
          {/* Focal Emphasis without blowing out the whole card background */}
          <div className="col-span-12 md:col-span-4 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            {outstanding > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Outstanding Debt</h3>
            <p className={`text-3xl font-bold font-mono tracking-tight ${outstanding > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              ₦{outstanding.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Layout: 4 cols for Metadata, 8 cols for Data Tables */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* 4-Column Metadata Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contact Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Contact Person</p>
                  <p className="text-gray-900 font-medium">{client.contactPerson || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">{client.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-gray-900 font-medium">{client.email || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 8-Column Data Section */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* Sales Ledger */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Sales Ledger</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {sales.length} Records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume (L)</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Billed Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sales.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((sale: any) => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                          <Link href={`/sales/${sale.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                            #{sale.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 text-right font-mono">{sale.litersDespatched?.toLocaleString()}</td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-medium">₦{sale.totalExpectedAmount?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No sales history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Payment History</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {transactions.length} Records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Purpose</th>
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
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                          {txn.paymentPurpose?.replace('_', ' ') || 'Deposit'}
                        </td>
                        {/* Focal highlight for payment amount */}
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-emerald-600 text-right font-mono font-bold">₦{txn.amount?.toLocaleString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No payment history found.</td>
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
