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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
            {order.petroleumType.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{order.petroleumType} • {order.litersOrdered.toLocaleString()} Liters</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : (order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')}`}>
            {order.status}
          </span>
          <Link href="/orders" className="btn-secondary">
            ← Back to Orders
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fuel Cost</h3>
          <p className="text-2xl font-bold text-gray-900">₦{fuelCost.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">₦{order.orderCost.toLocaleString()}/L</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Transport Cost</h3>
          <p className="text-2xl font-bold text-gray-900">₦{deliveryCost.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-1">₦{order.transportCost.toLocaleString()}/L</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Loading/Other</h3>
          <p className="text-2xl font-bold text-gray-900">₦{order.loadingCost.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Total Landed Cost</h3>
          <p className="text-3xl font-bold text-blue-900">₦{totalCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Logistics Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Logistics & Supply</h2>
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
            <div className="relative">
              <div className="absolute -left-[31px] bg-white border-2 border-indigo-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Source Depot</p>
                <p className="text-gray-900 font-bold">{order.sourceDepot || 'Not Specified'}</p>
                <p className="text-sm text-gray-500 mt-1">Ticket: {order.depotTicketNumber || 'N/A'}</p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] bg-white border-2 border-emerald-500 w-4 h-4 rounded-full mt-1"></div>
              <div>
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">Delivery Destination</p>
                <p className="text-gray-900 font-bold">Terminal / Storage</p>
                <p className="text-sm text-gray-500 mt-1">Expected: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Pending'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Audit & Additional Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">System Audit</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Order ID</p>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">{order.id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created At</p>
              <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
              <p className="text-gray-900 font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
