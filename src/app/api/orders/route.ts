import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const order = await prisma.order.create({
      data: {
        petroleumType: data.petroleumType,
        litersOrdered: parseFloat(data.litersOrdered),
        orderCost: parseFloat(data.orderCost),
        loadingCost: parseFloat(data.loadingCost),
        transportCost: parseFloat(data.transportCost),
        status: 'PENDING',
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
