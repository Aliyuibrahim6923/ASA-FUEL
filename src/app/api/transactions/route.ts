import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: transactions, error } = await supabase
    .from('Transaction')
    .select('*, client:Client(*), sale:Sale(*), transporter:Transporter(*), order:Order(*)')
    .order('date', { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  return NextResponse.json(transactions || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const data = await request.json();
  const { data: transaction, error } = await supabase
    .from('Transaction')
    .insert([{
      type: data.type,
      category: data.category,
      amount: parseFloat(data.amount),
      currencyCode: data.currencyCode || 'NGN',
      paymentMethod: data.paymentMethod || null,
      paymentPurpose: data.paymentPurpose || null,
      date: new Date(data.date || Date.now()).toISOString(),
      reference: data.reference || null,
      clientId: data.clientId || null,
      saleId: data.saleId || null,
      transporterId: data.transporterId || null,
      orderId: data.orderId || null,
    }])
    .select()
    .single();

  if (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
  
  if (data.type === 'INFLOW' && data.saleId) {
    const { data: sale } = await supabase.from('Sale').select('*').eq('id', data.saleId).single();
    if (sale) {
      const newPayment = sale.paymentReceived + parseFloat(data.amount);
      const status = newPayment >= sale.totalExpectedAmount ? 'CLEARED' : 'PART_PAID';
      await supabase.from('Sale').update({ paymentReceived: newPayment, status }).eq('id', data.saleId);
    }
  }

  return NextResponse.json(transaction, { status: 201 });
}
