import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecordDetailsView from "@/components/RecordDetailsView";

export default async function FleetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: transport, error } = await supabase
    .from("Transport")
    .select("*, Transporter(*)")
    .eq("id", id)
    .single();

  if (error || !transport) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transport Details</h1>
          <p className="text-gray-500">ID: {transport.id}</p>
        </div>
        <Link href="/fleet" className="btn-secondary flex items-center gap-2">
          ← Back to Fleet Management
        </Link>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <RecordDetailsView record={transport} />
      </div>
    </div>
  );
}
