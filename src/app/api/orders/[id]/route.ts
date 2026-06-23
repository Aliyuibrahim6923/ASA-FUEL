import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const data = await request.json();
  
  const { data: order, error } = await supabase
    .from('Order')
    .update({ status: data.status })
    .eq('id', resolvedParams.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  return NextResponse.json(order);
}
