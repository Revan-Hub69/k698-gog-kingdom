import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword || newPassword.length < 6)
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
  if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, dbUser.password);
  if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.userId }, data: { password: hashed } });

  return NextResponse.json({ message: 'Password updated' });
}
