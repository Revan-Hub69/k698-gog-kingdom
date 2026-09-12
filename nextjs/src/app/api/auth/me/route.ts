import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userRecord = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { id: true, email: true, nickname: true, isAdmin: true },
  });

  if (!userRecord) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  return NextResponse.json({
    user: {
      id: userRecord.id,
      email: userRecord.email,
      nickname: userRecord.nickname,
      isAdmin: userRecord.isAdmin,
    },
  });
}
