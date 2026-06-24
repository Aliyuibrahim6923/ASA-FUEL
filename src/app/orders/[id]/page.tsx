import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("Order")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  const fuelCost = order.orderCost * order.litersOrdered;
  const deliveryCost = order.transportCost * order.litersOrdered;
  const totalCost = fuelCost + deliveryCost + order.loadingCost;

  return (
    <div className="relative min-h-screen pb-12 bg-gray-50/30 overflow-hidden">
      {/* Decorative Animated Gradients Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-blue-50 via-white to-emerald-50 -z-10 animate-gradient-x opacity-80" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" />
      <div className="absolute top-32 -left-32 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-float delay-500" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Level 10 Glass Header */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-200">
                {order.petroleumType.charAt(0)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                <span className={`premium-badge ring-1 ${order.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' : (order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 ring-red-200/50' : 'bg-amber-50 text-amber-700 ring-amber-200/50')}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 font-mono tracking-widest">{order.petroleumType} • {order.litersOrdered.toLocaleString()} LITERS</p>
            </div>
          </div>
          <Link href="/orders" className="px-6 py-3 bg-white/50 hover:bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 backdrop-blur-md transition-all hover:shadow-md hover:-translate-y-0.5">
            ← Back to Orders
          </Link>
        </div>

        {/* Financial Overview Cards - Staggered */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-75 group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fuel Cost</h3>
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">⛽</span>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{fuelCost.toLocaleString()}</p>
            <p className="text-xs font-semibold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-md">₦{order.orderCost.toLocaleString()}/L</p>
          </div>

          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-150 group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Transport Cost</h3>
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">🚚</span>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{deliveryCost.toLocaleString()}</p>
            <p className="text-xs font-semibold text-orange-600 bg-orange-50 w-fit px-2 py-0.5 rounded-md">₦{order.transportCost.toLocaleString()}/L</p>
          </div>

          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-300 group">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Fees</h3>
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">🏗️</span>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tighter mb-1">₦{order.loadingCost.toLocaleString()}</p>
            <p className="text-xs font-semibold text-gray-400 bg-gray-100 w-fit px-2 py-0.5 rounded-md">Fixed Rate</p>
          </div>

          <div className="glass-card bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-3xl p-6 flex flex-col justify-center animate-fade-in-up delay-500 group border-none shadow-[0_8px_30px_rgba(37,99,235,0.2)]">
            <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2">Total Landed Cost</h3>
            <p className="text-4xl font-black text-white tracking-tighter mb-1">₦{totalCost.toLocaleString()}</p>
            <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mt-auto opacity-80 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Final Cost <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logistics Information */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-500">
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50" />
              <h2 className="text-xl font-extrabold text-gray-900 mb-8">Logistics Timeline</h2>
              
              <div className="relative pl-8 space-y-10 before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:to-emerald-500">
                <div className="relative group">
                  <div className="absolute -left-[39px] w-8 h-8 bg-indigo-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  </div>
                  <div>
                    <span className="premium-badge bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/50 mb-2">Source Depot</span>
                    <p className="text-gray-900 font-extrabold text-xl mt-1">{order.sourceDepot || 'Not Specified'}</p>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                      Ticket: {order.depotTicketNumber || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute -left-[39px] w-8 h-8 bg-emerald-100 rounded-full border-4 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  </div>
                  <div>
                    <span className="premium-badge bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50 mb-2">Delivery Destination</span>
                    <p className="text-gray-900 font-extrabold text-xl mt-1">Terminal / Storage</p>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Expected: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit & Additional Info */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up delay-700">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                System Audit Log
              </h2>
              <div className="space-y-6">
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Full Order ID</p>
                  <p className="text-gray-900 font-mono text-sm bg-gray-100/50 p-3 rounded-xl border border-gray-200/50 break-all">{order.id}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Record Created At</p>
                  <p className="text-gray-900 font-semibold text-lg">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="group">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Last Updated At</p>
                  <p className="text-gray-900 font-semibold text-lg">{new Date(order.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
