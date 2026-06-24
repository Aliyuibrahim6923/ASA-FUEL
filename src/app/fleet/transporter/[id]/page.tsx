import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TransporterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: transporter, error } = await supabase
    .from("Transporter")
    .select("*, Truck(*), Transport(*, order:Order(*))")
    .eq("id", id)
    .single();

  if (error || !transporter) {
    notFound();
  }

  const trucks = transporter.Truck || [];
  const trips = transporter.Transport || [];

  const totalBaseEarnings = trips.reduce((sum: number, t: any) => sum + ((t.ratePerLiter || 0) * (t.litersCarried || 0)), 0);
  
  let totalExtraEarnings = 0;
  trips.forEach((t: any) => {
    if (Array.isArray(t.subsequentLocs)) {
      t.subsequentLocs.forEach((loc: any) => {
        totalExtraEarnings += (parseFloat(loc.rate || 0) * parseFloat(loc.litersDelivered || 0));
      });
    }
  });

  const totalGrossEarnings = totalBaseEarnings + totalExtraEarnings;
  const totalDeductions = trips.reduce((sum: number, t: any) => sum + (t.totalDeduction || 0), 0);
  const totalNetPayout = trips.reduce((sum: number, t: any) => sum + (t.netTransportFeePaid || ((t.ratePerLiter * t.litersCarried) - (t.totalDeduction || 0))), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-2xl font-bold text-orange-700">
            {transporter.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{transporter.name}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Partner Transporter • ID: {transporter.id.slice(0, 8)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${transporter.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
            {transporter.status}
          </span>
          <Link href="/fleet" className="btn-secondary">
            ← Back to Fleet
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Gross Earnings</h3>
          <p className="text-2xl font-bold text-gray-900">₦{totalGrossEarnings.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">From {trips.length} Trips</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Total Deductions</h3>
          <p className="text-2xl font-bold text-red-700">- ₦{totalDeductions.toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-1">Losses & Maint. Withheld</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-center md:col-span-2">
          <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Total Net Payout</h3>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold text-emerald-900">₦{totalNetPayout.toLocaleString()}</p>
            <p className="text-sm font-semibold text-emerald-700">Account Balance: <span className="font-bold text-emerald-900">₦{(transporter.accountBalance || 0).toLocaleString()}</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Fleet */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-gray-900 font-medium">{transporter.contactPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{transporter.contactEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Physical Address</p>
                <p className="text-gray-900 font-medium">{transporter.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">Fleet Overview ({trucks.length})</h2>
            <div className="space-y-3">
              {trucks.map((truck: any) => (
                <div key={truck.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900">{truck.truckNameId}</p>
                    <p className="text-xs text-gray-500">Cap: {truck.capacityLiters?.toLocaleString()}L</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${truck.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                    {truck.status}
                  </span>
                </div>
              ))}
              {trucks.length === 0 && <p className="text-sm text-gray-500">No trucks assigned.</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Trip History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Earnings Ledger (Trip History)</h2>
              <span className="badge badge-info">{trips.length} Trips</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white">
                  <tr>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Date</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Trip Ref</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Destination</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">Deductions</th>
                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 text-right">Net Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trips.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((trip: any) => {
                    const netPaid = trip.netTransportFeePaid || ((trip.ratePerLiter * trip.litersCarried) - (trip.totalDeduction || 0));
                    return (
                      <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-600">{new Date(trip.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-sm font-medium text-gray-900">
                          <Link href={`/fleet/${trip.id}`} className="text-indigo-600 hover:underline">
                            #{trip.id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{trip.destination}</td>
                        <td className="p-4 text-sm font-medium text-red-600">
                          {trip.totalDeduction > 0 ? `- ₦${trip.totalDeduction.toLocaleString()}` : 'None'}
                        </td>
                        <td className="p-4 text-sm font-bold text-emerald-600 text-right">₦{netPaid.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {trips.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400">No transport history found.</td>
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
