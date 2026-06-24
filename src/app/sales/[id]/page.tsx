import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecordDetailsView from "@/components/RecordDetailsView";

export default async function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: sale, error } = await supabase
    .from("Sale")
    .select("*, Client(*)")
    .eq("id", id)
    .single();

  if (error || !sale) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sale Details</h1>
          <p className="text-gray-500">ID: {sale.id}</p>
        </div>
        <Link href="/sales" className="btn-secondary flex items-center gap-2">
          ← Back to Sales
        </Link>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <RecordDetailsView record={sale} />
      </div>
    </div>
  );
}
