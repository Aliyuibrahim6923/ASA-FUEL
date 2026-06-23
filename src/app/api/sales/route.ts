import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: sales, error } = await supabase
    .from('Sale')
    .select('*, client:Client(*), truck:Truck(*), transactions:Transaction(*)');

  if (error) return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  return NextResponse.json(sales || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  
  const { data: sale, error } = await supabase
    .from('Sale')
    .insert([{
      clientId: data.clientId,
      truckId: data.truckId,
      litersDespatched: parseFloat(data.litersDespatched),
      litersReceived: parseFloat(data.litersReceived),
      amountPerLiter: parseFloat(data.amountPerLiter),
      paymentReceived: parseFloat(data.paymentReceived || 0),
      totalExpectedAmount: parseFloat(data.litersReceived) * parseFloat(data.amountPerLiter),
      status: 'UNPAID',
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
  return NextResponse.json(sale, { status: 201 });
}
