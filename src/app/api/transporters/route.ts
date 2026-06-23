import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const transporters = await prisma.transporter.findMany({
      include: {
        trucks: true,
      },
    });
    return NextResponse.json(transporters);
  } catch (error) {
    console.error("Failed to fetch transporters:", error);
    return NextResponse.json({ error: "Failed to fetch transporters" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In a real scenario, you'd validate 'data' with Zod or similar here.
    const transporter = await prisma.transporter.create({
      data: {
        name: data.name,
        kycDocuments: data.kycDocuments || "[]", // Defaulting to stringified empty array since schema uses Json
        isActive: true,
        trucks: {
          create: {
            truckNameId: data.truckNameId,
            capacityLiters: parseFloat(data.capacityLiters),
            driverName: data.driverName,
            driverPhone: data.driverPhone,
            isActive: true,
          }
        }
      },
      include: {
        trucks: true,
      }
    });

    return NextResponse.json(transporter, { status: 201 });
  } catch (error) {
    console.error("Failed to create transporter:", error);
    return NextResponse.json({ error: "Failed to create transporter" }, { status: 500 });
  }
}
