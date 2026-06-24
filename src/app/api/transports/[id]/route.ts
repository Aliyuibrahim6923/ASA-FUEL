import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const data = await request.json();
  
  const { data: existing, error: fetchErr } = await supabase.from('Transport').select('*').eq('id', resolvedParams.id).single();
  if (fetchErr || !existing) return NextResponse.json({ error: "Transport not found" }, { status: 404 });

  const payload: any = {};

  if (data.status) payload.status = data.status;
  if (data.litersDelivered !== undefined) payload.litersDelivered = parseFloat(data.litersDelivered);
  if (data.subsequentLocs !== undefined) payload.subsequentLocs = data.subsequentLocs;

  let currentDeposits = existing.depositsMade || 0;
  let currentMaintenance = existing.maintenanceCost || 0;
  let currentLitersLost = existing.litersLost || 0;

  if (data.addDeposit !== undefined) {
    currentDeposits += parseFloat(data.addDeposit);
    payload.depositsMade = currentDeposits;
  }
  
  if (data.addMaintenanceCost !== undefined) {
    currentMaintenance += parseFloat(data.addMaintenanceCost);
    payload.maintenanceCost = currentMaintenance;
  }
  
  if (data.addLitersLost !== undefined) {
    currentLitersLost += parseFloat(data.addLitersLost);
    payload.litersLost = currentLitersLost;
  }

  const baseRate = (existing.ratePerLiter * existing.litersCarried);
  const deductionFromLitersLost = currentLitersLost * existing.ratePerLiter;
  const totalDeduction = deductionFromLitersLost + currentMaintenance;
  
  payload.totalDeduction = totalDeduction;
  payload.expensesDeductions = totalDeduction;
  payload.netTransportFeePaid = baseRate - totalDeduction;
  payload.volumeEquivalent = currentMaintenance / existing.ratePerLiter;

  const { data: transport, error } = await supabase
    .from('Transport')
    .update(payload)
    .eq('id', resolvedParams.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to complete transport:", error);
    return NextResponse.json({ error: "Failed to complete transport" }, { status: 500 });
  }

  return NextResponse.json(transport);
}
