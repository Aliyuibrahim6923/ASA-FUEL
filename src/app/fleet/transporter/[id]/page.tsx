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
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-700 border border-gray-200">
              {transporter.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{transporter.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-widest ${transporter.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {transporter.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono">Partner Transporter • ID: {transporter.id.slice(0, 8)}</p>
            </div>
          </div>
          <Link href="/fleet" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            ← Back to Fleet
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {/* Strict 12-Column Grid for Metrics */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Gross Earnings</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{totalGrossEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium font-mono">From {trips.length} Trips</p>
          </div>
          
          {/* Focal Emphasis without blowing out the whole card background */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            {totalDeductions > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Deductions</h3>
            <p className={`text-3xl font-bold font-mono tracking-tight mb-2 ${totalDeductions > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              - ₦{totalDeductions.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium">Losses & Maintenance</p>
          </div>
          
          {/* Main Focal Point: Net Payout & Account Balance */}
          <div className="col-span-12 md:col-span-6 bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col md:flex-row items-start md:items-end justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Net Payout</h3>
              <p className="text-4xl font-bold text-emerald-600 font-mono tracking-tight">₦{totalNetPayout.toLocaleString()}</p>
            </div>
            <div className="mt-6 md:mt-0 md:text-right border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6 w-full md:w-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Account Balance</h3>
              <p className="text-2xl font-bold text-gray-900 font-mono tracking-tight">₦{(transporter.accountBalance || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Layout: 4 cols for Contact/Fleet, 8 cols for Ledger */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* 4-Column Sidebar: Contact & Fleet */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Contact Information</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-gray-900 font-medium">{transporter.contactPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-gray-900 font-medium">{transporter.contactEmail || 'N/A'}</p>
                </div>
                <div className="h-px bg-gray-200 w-full" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Physical Address</p>
                  <p className="text-gray-900 font-medium leading-tight">{transporter.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Fleet Overview</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {trucks.length} Trucks
                </span>
              </div>
              <div className="p-6 space-y-4">
                {trucks.map((truck: any) => (
                  <div key={truck.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{truck.truckNameId}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">Cap: {truck.capacityLiters?.toLocaleString()}L</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${truck.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                      {truck.status}
                    </span>
                  </div>
                ))}
                {trucks.length === 0 && <p className="text-sm text-gray-500 text-center">No trucks assigned.</p>}
              </div>
            </div>
          </div>

          {/* 8-Column Data Section: Trip History Ledger */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Earnings Ledger (Trip History)</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  {trips.length} Records
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trip Ref</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Deductions</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Paid</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trips.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((trip: any) => {
                      const netPaid = trip.netTransportFeePaid || ((trip.ratePerLiter * trip.litersCarried) - (trip.totalDeduction || 0));
                      return (
                        <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{new Date(trip.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                            <Link href={`/fleet/${trip.id}`} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                              #{trip.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">{trip.destination}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-right font-mono">
                            {trip.totalDeduction > 0 ? (
                              <span className="text-red-600 font-bold">- ₦{trip.totalDeduction.toLocaleString()}</span>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-emerald-600 text-right font-mono font-bold">₦{netPaid.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                    {trips.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">No transport history found.</td>
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
