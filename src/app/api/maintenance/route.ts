import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: logs, error } = await supabase
    .from('MaintenanceLog')
    .select('*, truck:Truck(*)');

  if (error) return NextResponse.json({ error: "Failed to fetch maintenance logs" }, { status: 500 });
  return NextResponse.json(logs || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  const { data: log, error } = await supabase
    .from('MaintenanceLog')
    .insert([{
      truckId: data.truckId,
      date: new Date(data.date || Date.now()).toISOString(),
      mechanicName: data.mechanicName || null,
      description: data.description,
      cost: parseFloat(data.cost),
      status: data.status || 'COMPLETED',
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to create maintenance log" }, { status: 500 });
  return NextResponse.json(log, { status: 201 });
}
