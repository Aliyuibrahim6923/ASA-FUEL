import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: transporters, error } = await supabase
    .from('Transporter')
    .select('*, trucks:Truck(*)');

  if (error) return NextResponse.json({ error: "Failed to fetch transporters" }, { status: 500 });
  return NextResponse.json(transporters || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  
  const { data: transporter, error: tError } = await supabase
    .from('Transporter')
    .insert([{
      name: data.name,
      kycDocuments: data.kycDocuments || []
    }])
    .select()
    .single();

  if (tError || !transporter) {
    console.error("Failed to create transporter:", tError);
    return NextResponse.json({ error: "Failed to create transporter" }, { status: 500 });
  }

  const { error: truckError } = await supabase
    .from('Truck')
    .insert([{
      transporterId: transporter.id,
      truckNameId: data.truckNameId,
      capacityLiters: parseFloat(data.capacityLiters),
      driverName: data.driverName,
      driverPhone: data.driverPhone,
    }]);

  if (truckError) {
    console.error("Failed to create truck:", truckError);
    return NextResponse.json({ error: "Failed to create initial truck" }, { status: 500 });
  }

  return NextResponse.json(transporter, { status: 201 });
}
