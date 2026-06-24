import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TransportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: transport, error } = await supabase
    .from("Transport")
    .select("*, order:Order(*), truck:Truck(*)")
    .eq("id", id)
    .single();

  if (error || !transport) {
    notFound();
  }

  const baseRateEarnings = transport.ratePerLiter * transport.litersCarried;
  
  // Calculate subsequent location earnings
  let extraEarnings = 0;
  const subsequentLocs = transport.subsequentLocs || [];
  if (Array.isArray(subsequentLocs)) {
    subsequentLocs.forEach((loc: any) => {
      extraEarnings += (parseFloat(loc.rate || 0) * parseFloat(loc.litersDelivered || 0));
    });
  }

  const totalGrossEarnings = baseRateEarnings + extraEarnings;
  const netEarnings = transport.netTransportFeePaid || (totalGrossEarnings - (transport.totalDeduction || 0));

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl border border-gray-200">
              🚚
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trip #{transport.id.slice(0, 8)}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-widest ${transport.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {transport.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono tracking-widest uppercase">
                {transport.truck?.truckNameId || 'Unknown Truck'} • {transport.destination}
              </p>
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Base Earnings</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{baseRateEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium font-mono">₦{transport.ratePerLiter.toLocaleString()} x {transport.litersCarried.toLocaleString()}L</p>
          </div>
          
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Extra Drops</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{extraEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">{subsequentLocs.length} Location(s)</p>
          </div>
          
          {/* Focal Emphasis for Deductions */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            {(transport.totalDeduction || 0) > 0 && <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Deductions</h3>
            <p className={`text-3xl font-bold font-mono tracking-tight mb-2 ${(transport.totalDeduction || 0) > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              - ₦{(transport.totalDeduction || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium">Losses & Maintenance</p>
          </div>
          
          {/* Focal Emphasis for Payout */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Net Payout</h3>
            <p className="text-3xl font-bold font-mono tracking-tight text-emerald-600 mb-2">₦{netEarnings.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">Final Amount</p>
          </div>
        </div>

        {/* Layout: 4 cols for Metadata, 8 cols for Data Tables */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* 4-Column Sidebar: Incidents & Metadata */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="text-red-500">⚠️</span> Incidents & Deductions
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Liters Lost</p>
                  <p className="text-gray-900 font-medium font-mono text-lg">{transport.litersLost ? `${transport.litersLost.toLocaleString()}L` : '0L'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Maintenance Cost</p>
                  <p className="text-gray-900 font-medium font-mono text-lg">₦{(transport.maintenanceCost || 0).toLocaleString()}</p>
                </div>
                <div className="h-px bg-gray-200 w-full" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Deposits Paid (Advances)</p>
                  <p className="text-gray-900 font-medium font-mono text-lg">₦{(transport.depositsMade || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            {transport.order && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Associated Order</h2>
                </div>
                <div className="p-6">
                  <Link href={`/orders/${transport.orderId}`} className="text-indigo-600 hover:text-indigo-900 font-bold text-lg flex items-center gap-1 group">
                    Order #{transport.orderId.slice(0, 8)}
                    <span className="text-sm ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 8-Column Data Section: Delivery Log */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Delivery Log</h2>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Initial Destination block structured strictly */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Initial Destination</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Location</p>
                      <p className="text-lg font-bold text-gray-900">{transport.destination}</p>
                      <p className="text-sm text-gray-500 mt-1 font-mono">Rate: ₦{transport.ratePerLiter}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900 font-mono">{transport.litersDelivered ? `${transport.litersDelivered.toLocaleString()}L` : 'Pending'}</p>
                    </div>
                  </div>
                </div>

                {subsequentLocs.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Subsequent Drops</h3>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate/L</th>
                            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivered</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subsequentLocs.map((loc: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900">{loc.location}</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{loc.clientName || 'N/A'}</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-medium">₦{parseFloat(loc.rate || 0).toLocaleString()}</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 text-right font-mono font-bold">{parseFloat(loc.litersDelivered || 0).toLocaleString()}L</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
