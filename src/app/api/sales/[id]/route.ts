import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const resolvedParams = await params;
  const data = await request.json();

  const { data: existing, error: fetchErr } = await supabase.from('Sale').select('*').eq('id', resolvedParams.id).single();
  if (fetchErr || !existing) return NextResponse.json({ error: "Sale not found" }, { status: 404 });

  const payload: any = {};
  let litersReceivedUpdated = false;
  
  if (data.litersReceived !== undefined) {
    const litersReceived = parseFloat(data.litersReceived);
    payload.litersReceived = litersReceived;
    payload.totalExpectedAmount = litersReceived * existing.amountPerLiter;
    litersReceivedUpdated = true;
  }

  const { data: sale, error } = await supabase
    .from('Sale')
    .update(payload)
    .eq('id', resolvedParams.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update sale:", error);
    return NextResponse.json({ error: "Failed to update sale" }, { status: 500 });
  }

  // RECONCILIATION ENGINE: If liters received changed, recalculate Transporter deductions
  if (litersReceivedUpdated && sale.transportId) {
    // 1. Fetch parent transport
    const { data: transport } = await supabase.from('Transport').select('*').eq('id', sale.transportId).single();
    
    if (transport) {
       // 2. Fetch all sales linked to this transport
       const { data: allSales } = await supabase.from('Sale').select('litersReceived').eq('transportId', transport.id);
       
       if (allSales) {
          // 3. Sum total liters received by all clients from this truck trip
          const totalReceived = allSales.reduce((sum, s) => sum + (s.litersReceived || 0), 0);
          
          // 4. Calculate liters lost
          const litersLost = Math.max(0, transport.litersCarried - totalReceived);
          
          // 5. Calculate Transporter cash deduction (using Transport rate per liter)
          // Wait, deduction is usually ratePerLiter * litersLost
          const cashDeductionForLoss = litersLost * transport.ratePerLiter;
          
          // 6. Update Transport record
          // We need to preserve any existing totalDeduction logic if there were maintenance costs
          const existingMaintenance = transport.maintenanceCost || 0;
          const newTotalDeduction = existingMaintenance + cashDeductionForLoss;
          
          const newNetTransportFeePaid = transport.depositsMade ? transport.depositsMade : ((transport.ratePerLiter * transport.litersCarried) - newTotalDeduction);

          await supabase.from('Transport').update({
             litersLost: litersLost,
             // The volumeEquivalent is usually used to log cash converted to liters, or vice-versa
             totalDeduction: newTotalDeduction,
             netTransportFeePaid: newNetTransportFeePaid
          }).eq('id', transport.id);
       }
    }
  }

  return NextResponse.json(sale);
}
