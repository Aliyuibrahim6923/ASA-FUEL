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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl font-bold text-amber-700">
            🚚
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Trip #{transport.id.slice(0, 8)}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{transport.truck?.truckNameId || 'Unknown Truck'} • {transport.destination}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${transport.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {transport.status}
          </span>
          <Link href="/fleet" className="btn-secondary">
            ← Back to Fleet
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Base Earnings</h3>
          <p className="text-2xl font-bold text-gray-900">₦{baseRateEarnings.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">₦{transport.ratePerLiter.toLocaleString()} x {transport.litersCarried.toLocaleString()}L</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Extra Drops</h3>
          <p className="text-2xl font-bold text-gray-900">₦{extraEarnings.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">{subsequentLocs.length} Location(s)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Total Deductions</h3>
          <p className="text-2xl font-bold text-red-700">- ₦{(transport.totalDeduction || 0).toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-1">Losses & Maintenance</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Net Payout</h3>
          <p className="text-3xl font-bold text-emerald-900">₦{netEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logistics & Delivery Log */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Delivery Log</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Initial Destination</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-900 font-bold">{transport.destination}</p>
                    <p className="text-sm text-gray-500">Rate: ₦{transport.ratePerLiter}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Delivered</p>
                    <p className="text-lg font-bold text-gray-900">{transport.litersDelivered ? `${transport.litersDelivered.toLocaleString()}L` : 'Pending'}</p>
                  </div>
                </div>
              </div>

              {subsequentLocs.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Subsequent Drops</p>
                  <div className="space-y-3">
                    {subsequentLocs.map((loc: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 font-bold">{loc.location}</p>
                          <p className="text-sm text-gray-500">{loc.clientName ? `Client: ${loc.clientName}` : 'No Client Specified'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-600">₦{parseFloat(loc.rate || 0).toLocaleString()}/L</p>
                          <p className="text-sm text-gray-600">{parseFloat(loc.litersDelivered || 0).toLocaleString()}L</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Incidents & Deductions */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Incidents & Deductions</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Liters Lost</p>
                <p className="text-xl font-bold text-red-900">{transport.litersLost ? `${transport.litersLost.toLocaleString()}L` : '0L'}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">Maintenance Cost</p>
                <p className="text-xl font-bold text-red-900">₦{(transport.maintenanceCost || 0).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Deposits Paid (Advances)</p>
                <p className="text-gray-900 font-medium">₦{(transport.depositsMade || 0).toLocaleString()}</p>
              </div>
              {transport.order && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Associated Order</p>
                  <Link href={`/orders/${transport.orderId}`} className="text-indigo-600 hover:underline font-medium">
                    Order #{transport.orderId.slice(0, 8)}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
