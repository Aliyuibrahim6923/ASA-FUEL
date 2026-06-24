import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const data = await request.json();
  
  const payload: any = {};
  if (data.status) payload.status = data.status;
  if (data.petroleumType) payload.petroleumType = data.petroleumType;
  if (data.cashEquivalentReturned !== undefined) payload.cashEquivalentReturned = parseFloat(data.cashEquivalentReturned);

  const { data: order, error } = await supabase
    .from('Order')
    .update(payload)
    .eq('id', resolvedParams.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  return NextResponse.json(order);
}
