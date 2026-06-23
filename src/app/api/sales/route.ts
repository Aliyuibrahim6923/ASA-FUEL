import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: { client: true, truck: true, transactions: true }
    });
    return NextResponse.json(sales);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const sale = await prisma.sale.create({
      data: {
        clientId: data.clientId,
        truckId: data.truckId,
        litersDespatched: parseFloat(data.litersDespatched),
        litersReceived: parseFloat(data.litersReceived),
        amountPerLiter: parseFloat(data.amountPerLiter),
        paymentReceived: parseFloat(data.paymentReceived || 0),
        totalExpectedAmount: parseFloat(data.litersReceived) * parseFloat(data.amountPerLiter),
        status: 'UNPAID',
      }
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Failed to create sale:", error);
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 });
  }
}
