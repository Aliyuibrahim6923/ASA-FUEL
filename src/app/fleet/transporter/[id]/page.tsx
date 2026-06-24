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
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-orange-50 via-white to-amber-50 -z-10 animate-gradient-x opacity-80" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute top-32 -left-32 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-float delay-500" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-orange-200">
                {transporter.name.charAt(0)}
              </div>
              {transporter.status === 'ACTIVE' && <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-400 border-4 border-white rounded-full shadow-sm" />}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{transporter.name}</h1>
                <span className={`premium-badge ring-1 ${transporter.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' : 'bg-red-50 text-red-700 ring-red-200/50'}`}>
                  {transporter.status}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono tracking-widest">Partner Transporter • ID: {transporter.id.slice(0, 8)}</p>
            </div>
          </div>
          <Link href="/fleet" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Fleet
          </Link>
        </div>

        {/* Financial Overview Cards - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-75 group">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Gross Earnings</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{totalGrossEarnings.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-400 bg-gray-100/80 w-fit px-2 py-0.5 rounded-md">From {trips.length} Trips</p>
          </div>
          
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-150 group bg-gradient-to-br from-red-50/50 to-white border-red-100">
            <h3 className="text-xs font-bold text-red-700/70 uppercase tracking-widest mb-2">Total Deductions</h3>
            <p className="text-3xl font-black text-red-700 tracking-tighter mb-1">- ₦{totalDeductions.toLocaleString()}</p>
            <p className="text-xs font-semibold text-red-500 bg-red-100/50 w-fit px-2 py-0.5 rounded-md">Losses & Maint.</p>
          </div>
          
          <div className="md:col-span-2 glass-card bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-3xl p-8 flex flex-col justify-center animate-fade-in-up delay-300 group border-none shadow-[0_8px_30px_rgba(16,185,129,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform duration-700" />
            <h3 className="text-xs font-bold text-emerald-200 uppercase tracking-widest mb-3">Total Net Payout</h3>
            <div className="flex justify-between items-end">
              <p className="text-5xl font-black text-white tracking-tighter">₦{totalNetPayout.toLocaleString()}</p>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">Account Balance</p>
                <p className="text-2xl font-black text-emerald-50 tracking-tight">₦{(transporter.accountBalance || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Contact & Fleet */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform">{transporter.contactPhone || 'N/A'}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Address
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform">{transporter.contactEmail || 'N/A'}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Physical Address
                  </p>
                  <p className="text-gray-900 font-semibold text-lg group-hover:translate-x-1 transition-transform leading-tight">{transporter.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center justify-between">
                Fleet Overview
                <span className="premium-badge bg-orange-100/50 text-orange-700 ring-1 ring-orange-200">{trucks.length} Trucks</span>
              </h2>
              <div className="space-y-4">
                {trucks.map((truck: any) => (
                  <div key={truck.id} className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-orange-200 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">{truck.truckNameId}</p>
                      <p className="text-xs font-semibold text-gray-500 mt-1">Cap: {truck.capacityLiters?.toLocaleString()}L</p>
                    </div>
                    <span className={`px-3 py-1 text-[10px] font-black tracking-widest rounded-full uppercase ${truck.status === 'AVAILABLE' ? 'bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100/80 text-gray-600 ring-1 ring-gray-200'}`}>
                      {truck.status}
                    </span>
                  </div>
                ))}
                {trucks.length === 0 && <p className="text-sm font-medium text-gray-400 p-4 text-center">No trucks assigned.</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Trip History */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-700">
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-white/40 flex justify-between items-center backdrop-blur-md">
                <h2 className="text-xl font-extrabold text-gray-900">Earnings Ledger (Trip History)</h2>
                <span className="premium-badge bg-blue-100/50 text-blue-700 ring-1 ring-blue-200">{trips.length} Trips</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Date</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Trip Ref</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Destination</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50">Deductions</th>
                      <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 text-right">Net Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {trips.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((trip: any) => {
                      const netPaid = trip.netTransportFeePaid || ((trip.ratePerLiter * trip.litersCarried) - (trip.totalDeduction || 0));
                      return (
                        <tr key={trip.id} className="hover:bg-white/60 transition-colors group">
                          <td className="p-5 text-sm text-gray-500 font-medium">{new Date(trip.createdAt).toLocaleDateString()}</td>
                          <td className="p-5 text-sm">
                            <Link href={`/fleet/${trip.id}`} className="font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">
                              #{trip.id.slice(0, 8)}
                            </Link>
                          </td>
                          <td className="p-5 text-sm text-gray-700 font-semibold">{trip.destination}</td>
                          <td className="p-5 text-sm">
                            {trip.totalDeduction > 0 ? (
                              <span className="inline-flex px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs font-bold tracking-tight">
                                - ₦{trip.totalDeduction.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-gray-400 font-medium text-xs">None</span>
                            )}
                          </td>
                          <td className="p-5 text-sm font-black text-emerald-600 text-right tracking-tight">₦{netPaid.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                    {trips.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">No transport history found.</td>
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
