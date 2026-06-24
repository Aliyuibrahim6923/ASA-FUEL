import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecordDetailsView from "@/components/RecordDetailsView";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: transaction, error } = await supabase
    .from("Transaction")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !transaction) {
    notFound();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Details</h1>
          <p className="text-gray-500">ID: {transaction.id}</p>
        </div>
        <Link href="/financials" className="btn-secondary flex items-center gap-2">
          ← Back to Financials
        </Link>
      </div>
      
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <RecordDetailsView record={transaction} />
      </div>
    </div>
  );
}
