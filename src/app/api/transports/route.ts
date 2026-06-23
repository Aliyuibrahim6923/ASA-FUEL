import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: transports, error } = await supabase
    .from('Transport')
    .select('*, order:Order(*), truck:Truck(*), transporter:Transporter(*)');

  if (error) return NextResponse.json({ error: "Failed to fetch transports" }, { status: 500 });
  return NextResponse.json(transports || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  const { data: transport, error } = await supabase
    .from('Transport')
    .insert([{
      orderId: data.orderId,
      truckId: data.truckId,
      transporterId: data.transporterId,
      destination: data.destination,
      transportType: data.transportType,
      ratePerLiter: parseFloat(data.ratePerLiter),
      litersCarried: parseFloat(data.litersCarried),
      status: 'IN_TRANSIT',
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create transport" }, { status: 500 });
  return NextResponse.json(transport, { status: 201 });
}
