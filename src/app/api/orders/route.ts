import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: orders, error } = await supabase
    .from('Order')
    .select('*');

  if (error) return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  return NextResponse.json(orders || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  const { data: order, error } = await supabase
    .from('Order')
    .insert([{
        locationId: data.locationId || null,
        petroleumType: data.petroleumType,
        litersOrdered: parseFloat(data.litersOrdered),
        orderCost: parseFloat(data.orderCost),
        loadingCost: parseFloat(data.loadingCost),
        transportCost: parseFloat(data.transportCost),
        status: 'PENDING',
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  return NextResponse.json(order, { status: 201 });
}
