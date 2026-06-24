import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: clients, error } = await supabase
    .from('Client')
    .select('*, sales:Sale(*), payments:Transaction(*)');

  if (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
  return NextResponse.json(clients || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  const { data: client, error } = await supabase
    .from('Client')
    .insert([data])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message || "Failed to create client" }, { status: 500 });
  }
  return NextResponse.json(client, { status: 201 });
}
