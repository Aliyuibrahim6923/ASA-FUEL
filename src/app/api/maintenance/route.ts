import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.maintenanceLog.findMany({
      include: { truck: true }
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch maintenance logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const log = await prisma.maintenanceLog.create({
      data: {
        truckId: data.truckId,
        date: new Date(data.date || Date.now()),
        mechanicName: data.mechanicName || null,
        description: data.description,
        cost: parseFloat(data.cost),
        status: data.status || 'COMPLETED',
      }
    });
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Failed to create maintenance log:", error);
    return NextResponse.json({ error: "Failed to create maintenance log" }, { status: 500 });
  }
}
