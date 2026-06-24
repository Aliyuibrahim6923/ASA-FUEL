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
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-amber-50 via-white to-orange-50 -z-10 animate-gradient-x opacity-80" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute top-32 -left-32 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-float delay-500" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-amber-200">
                🚚
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Trip #{transport.id.slice(0, 8)}</h1>
                <span className={`premium-badge ring-1 ${transport.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' : 'bg-amber-50 text-amber-700 ring-amber-200/50'}`}>
                  {transport.status}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono tracking-widest">{transport.truck?.truckNameId || 'Unknown Truck'} • {transport.destination}</p>
            </div>
          </div>
          <Link href="/fleet" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Fleet
          </Link>
        </div>

        {/* Financial Overview Cards - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-75 group">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Base Earnings</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{baseRateEarnings.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-400 bg-gray-100/80 w-fit px-2 py-0.5 rounded-md">₦{transport.ratePerLiter.toLocaleString()} x {transport.litersCarried.toLocaleString()}L</p>
          </div>
          
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-150 group">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Extra Drops</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{extraEarnings.toLocaleString()}</p>
            <p className="text-xs font-semibold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-md">{subsequentLocs.length} Location(s)</p>
          </div>
          
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-300 group bg-gradient-to-br from-red-50/50 to-white border-red-100">
            <h3 className="text-xs font-bold text-red-700/70 uppercase tracking-widest mb-2">Total Deductions</h3>
            <p className="text-3xl font-black text-red-700 tracking-tighter mb-1">- ₦{(transport.totalDeduction || 0).toLocaleString()}</p>
            <p className="text-xs font-semibold text-red-500 bg-red-100/50 w-fit px-2 py-0.5 rounded-md">Losses & Maintenance</p>
          </div>
          
          <div className="glass-card bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-500 group border-none shadow-[0_8px_30px_rgba(16,185,129,0.25)]">
            <h3 className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-2">Net Payout</h3>
            <p className="text-4xl font-black text-white tracking-tighter mb-1">₦{netEarnings.toLocaleString()}</p>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mt-auto opacity-80 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Final Amount <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logistics & Delivery Log */}
          <div className="space-y-8 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">📍</div>
                Delivery Log
              </h2>
              
              <div className="space-y-6">
                <div className="relative p-6 bg-gradient-to-br from-indigo-50/50 to-white rounded-2xl border border-indigo-100/50 hover:shadow-md transition-all group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-110" />
                  <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-3">Initial Destination</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gray-900 font-black text-2xl">{transport.destination}</p>
                      <p className="text-sm font-semibold text-gray-500 mt-1">Rate: ₦{transport.ratePerLiter}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Delivered</p>
                      <p className="text-2xl font-black text-indigo-600">{transport.litersDelivered ? `${transport.litersDelivered.toLocaleString()}L` : 'Pending'}</p>
                    </div>
                  </div>
                </div>

                {subsequentLocs.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Subsequent Drops</p>
                    <div className="space-y-4">
                      {subsequentLocs.map((loc: any, idx: number) => (
                        <div key={idx} className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors flex justify-between items-center group">
                          <div>
                            <p className="text-gray-900 font-bold text-lg">{loc.location}</p>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">{loc.clientName ? `Client: ${loc.clientName}` : 'No Client Specified'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-emerald-600 tracking-tight">₦{parseFloat(loc.rate || 0).toLocaleString()}/L</p>
                            <p className="text-sm font-bold text-gray-600">{parseFloat(loc.litersDelivered || 0).toLocaleString()}L</p>
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
          <div className="space-y-8 animate-fade-in-up delay-700">
            <div className="glass-card rounded-3xl p-8 border-t-4 border-t-red-400">
              <h2 className="text-xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">⚠️</div>
                Incidents & Deductions
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 hover:shadow-sm transition-shadow group">
                  <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Liters Lost</p>
                  <p className="text-3xl font-black text-red-600 tracking-tighter group-hover:scale-105 transition-transform origin-left">{transport.litersLost ? `${transport.litersLost.toLocaleString()}L` : '0L'}</p>
                </div>
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 hover:shadow-sm transition-shadow group">
                  <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Maintenance Cost</p>
                  <p className="text-3xl font-black text-red-600 tracking-tighter group-hover:scale-105 transition-transform origin-left">₦{(transport.maintenanceCost || 0).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Deposits Paid (Advances)</p>
                  <p className="text-gray-900 font-bold text-xl">₦{(transport.depositsMade || 0).toLocaleString()}</p>
                </div>
                {transport.order && (
                  <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Associated Order</p>
                    <Link href={`/orders/${transport.orderId}`} className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold text-lg flex items-center gap-1 group">
                      Order #{transport.orderId.slice(0, 8)}
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
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
