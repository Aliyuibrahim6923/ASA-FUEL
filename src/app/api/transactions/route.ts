import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { client: true, sale: true, transporter: true, order: true },
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        currencyCode: data.currencyCode || 'NGN',
        paymentMethod: data.paymentMethod || null,
        paymentPurpose: data.paymentPurpose || null,
        date: new Date(data.date || Date.now()),
        reference: data.reference || null,
        clientId: data.clientId || null,
        saleId: data.saleId || null,
        transporterId: data.transporterId || null,
        orderId: data.orderId || null,
      }
    });
    
    // If it's a client payment linked to a sale, update the sale's paymentReceived and status
    if (data.type === 'INFLOW' && data.saleId) {
      const sale = await prisma.sale.findUnique({ where: { id: data.saleId } });
      if (sale) {
        const newPayment = sale.paymentReceived + parseFloat(data.amount);
        const status = newPayment >= sale.totalExpectedAmount ? 'CLEARED' : 'PART_PAID';
        await prisma.sale.update({
          where: { id: data.saleId },
          data: { paymentReceived: newPayment, status }
        });
      }
    }

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
