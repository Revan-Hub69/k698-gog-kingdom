import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, nickname: true, kvkPackage: true },
    orderBy: { nickname: 'asc' },
  });
  return NextResponse.json(users);
}

export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, kvkPackage } = await req.json();
  if (!userId || !['gold', 'silver', 'bronze', 'none'].includes(kvkPackage))
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { kvkPackage: kvkPackage === 'none' ? null : kvkPackage },
    select: { id: true, nickname: true, kvkPackage: true },
  });
  return NextResponse.json(updated);
}
