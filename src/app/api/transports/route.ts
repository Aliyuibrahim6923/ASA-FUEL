import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transports = await prisma.transport.findMany({
      include: { order: true, truck: true, transporter: true }
    });
    return NextResponse.json(transports);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const transport = await prisma.transport.create({
      data: {
        orderId: data.orderId,
        truckId: data.truckId,
        transporterId: data.transporterId,
        destination: data.destination,
        transportType: data.transportType,
        ratePerLiter: parseFloat(data.ratePerLiter),
        litersCarried: parseFloat(data.litersCarried),
        status: 'IN_TRANSIT',
      }
    });
    return NextResponse.json(transport, { status: 201 });
  } catch (error) {
    console.error("Failed to create transport:", error);
    return NextResponse.json({ error: "Failed to create transport" }, { status: 500 });
  }
}
