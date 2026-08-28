import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET — list all users (admin only)
export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, nickname: true, isAdmin: true, createdAt: true, _count: { select: { castles: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(users);
}

// PATCH — toggle admin or update user (admin only)
export async function PATCH(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, isAdmin } = await req.json();
  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  if (userId === user.userId) return NextResponse.json({ error: 'Cannot modify own admin status' }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isAdmin },
    select: { id: true, email: true, nickname: true, isAdmin: true },
  });
  return NextResponse.json(updated);
}

// DELETE — delete user (admin only)
export async function DELETE(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const userId = parseInt(req.nextUrl.searchParams.get('userId') || '');
  if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  if (userId === user.userId) return NextResponse.json({ error: 'Cannot delete own account' }, { status: 400 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ message: 'User deleted' });
}
