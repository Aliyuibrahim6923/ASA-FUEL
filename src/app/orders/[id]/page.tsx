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
    <div className="min-h-screen pb-16 bg-gray-50">
      
      {/* Strict White Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl font-bold text-gray-700 border border-gray-200">
              {order.petroleumType.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order #{order.id.slice(0, 8)}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border uppercase tracking-widest ${order.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : (order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200')}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono">
                <span className="font-semibold text-gray-700">{order.petroleumType}</span> • {order.litersOrdered.toLocaleString()} LITERS
              </p>
            </div>
          </div>
          <Link href="/orders" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            ← Back to Orders
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        
        {/* Strict 12-Column Grid for Metrics */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Fuel Cost</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{fuelCost.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">Rate: ₦{order.orderCost.toLocaleString()}/L</p>
          </div>

          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Transport Cost</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{deliveryCost.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">Rate: ₦{order.transportCost.toLocaleString()}/L</p>
          </div>

          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Loading Fees</h3>
            <p className="text-3xl font-bold text-gray-900 font-mono tracking-tight mb-2">₦{order.loadingCost.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">Fixed Rate</p>
          </div>

          {/* Focal Emphasis without blowing out the whole card background */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Total Landed Cost</h3>
            <p className="text-3xl font-bold font-mono tracking-tight text-blue-700">
              ₦{totalCost.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-2">Final Procurement Cost</p>
          </div>
        </div>

        {/* Layout: 4 cols for Metadata, 8 cols for Data Tables */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* 4-Column Metadata Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">System Audit Log</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Full Order ID</p>
                  <p className="text-gray-900 font-mono text-sm break-all">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Record Created At</p>
                  <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Last Updated At</p>
                  <p className="text-gray-900 font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 8-Column Data Section */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            
            {/* Logistics Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Logistics Timeline</h2>
              </div>
              <div className="p-8">
                <div className="relative pl-8 space-y-10 before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <div className="absolute -left-[39px] w-8 h-8 bg-white rounded-full border border-gray-300 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 mb-2 uppercase tracking-widest">Source Depot</span>
                      <p className="text-gray-900 font-bold text-lg mt-1">{order.sourceDepot || 'Not Specified'}</p>
                      <p className="text-sm text-gray-500 mt-1">Ticket: <span className="font-mono">{order.depotTicketNumber || 'N/A'}</span></p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute -left-[39px] w-8 h-8 bg-white rounded-full border border-gray-300 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2 uppercase tracking-widest">Delivery Destination</span>
                      <p className="text-gray-900 font-bold text-lg mt-1">Terminal / Storage</p>
                      <p className="text-sm text-gray-500 mt-1">Expected: <span className="font-medium">{order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Pending'}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
