import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// Helper: convert BigInt fields to Number for JSON serialization
function serializeCastle(c: Record<string, unknown>) {
  return {
    ...c,
    currentPower: Number(c.currentPower),
    historicalMaxPower: Number(c.historicalMaxPower),
    totalHistoricalPower: Number(c.totalHistoricalPower ?? 0),
  };
}

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const castles = await prisma.castle.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json(castles.map(serializeCastle));
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { castleName } = await req.json();
  if (!castleName?.trim()) return NextResponse.json({ error: 'Castle name required' }, { status: 400 });
  const count = await prisma.castle.count({ where: { userId: user.userId } });
  if (count >= 20) return NextResponse.json({ error: 'Maximum 20 castles per account' }, { status: 400 });
  const castle = await prisma.castle.create({
    data: { userId: user.userId, castleName: castleName.trim() },
  });
  return NextResponse.json(serializeCastle(castle as unknown as Record<string, unknown>), { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, currentPower, historicalMaxPower } = await req.json();
  if (!id) return NextResponse.json({ error: 'Castle ID required' }, { status: 400 });
  const castle = await prisma.castle.findFirst({ where: { id, userId: user.userId } });
  if (!castle) return NextResponse.json({ error: 'Castle not found' }, { status: 404 });
  const updated = await prisma.castle.update({
    where: { id },
    data: {
      ...(currentPower !== undefined && { currentPower: BigInt(Math.round(Number(currentPower))) }),
      ...(historicalMaxPower !== undefined && { historicalMaxPower: BigInt(Math.round(Number(historicalMaxPower))) }),
      lastPowerUpdate: new Date(),
    },
  });
  return NextResponse.json(serializeCastle(updated as unknown as Record<string, unknown>));
}

export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = parseInt(req.nextUrl.searchParams.get('id') || '');
  if (!id) return NextResponse.json({ error: 'Castle ID required' }, { status: 400 });
  const castle = await prisma.castle.findFirst({ where: { id, userId: user.userId } });
  if (!castle) return NextResponse.json({ error: 'Castle not found' }, { status: 404 });
  await prisma.castle.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}
