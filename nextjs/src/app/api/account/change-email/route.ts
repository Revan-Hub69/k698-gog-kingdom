import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists && exists.id !== user.userId)
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

  await prisma.user.update({ where: { id: user.userId }, data: { email } });
  return NextResponse.json({ message: 'Email updated' });
}
