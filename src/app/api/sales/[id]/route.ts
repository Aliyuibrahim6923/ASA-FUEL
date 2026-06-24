import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const data = await request.json();

  const { data: existing, error: fetchErr } = await supabase.from('SalesRecord').select('*').eq('id', resolvedParams.id).single();
  if (fetchErr || !existing) return NextResponse.json({ error: "Sale not found" }, { status: 404 });

  const payload: any = {};
  
  if (data.litersReceived !== undefined) {
    const litersReceived = parseFloat(data.litersReceived);
    payload.litersReceived = litersReceived;
    payload.totalExpectedAmount = litersReceived * existing.amountPerLiter;
  }

  const { data: sale, error } = await supabase
    .from('SalesRecord')
    .update(payload)
    .eq('id', resolvedParams.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update sale:", error);
    return NextResponse.json({ error: "Failed to update sale" }, { status: 500 });
  }

  return NextResponse.json(sale);
}
