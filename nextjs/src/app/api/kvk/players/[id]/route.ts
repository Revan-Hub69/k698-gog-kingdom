import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/kvk/players/[id] — admin updates single player (packs or data)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.kvkPlayer.update({
    where: { id: Number(id) },
    data: {
      ...(body.pack90 !== undefined && { pack90: Math.max(0, Number(body.pack90)) }),
      ...(body.pack60 !== undefined && { pack60: Math.max(0, Number(body.pack60)) }),
      ...(body.pack30 !== undefined && { pack30: Math.max(0, Number(body.pack30)) }),
      ...(body.name !== undefined && { name: String(body.name).trim() }),
      ...(body.alliance !== undefined && { alliance: body.alliance ? String(body.alliance).trim() : null }),
      ...(body.score !== undefined && { score: BigInt(Math.round(Number(body.score))) }),
      ...(body.notes !== undefined && { notes: body.notes ? String(body.notes).trim() : null }),
      ...(body.under100m !== undefined && { under100m: Boolean(body.under100m) }),
      ...(body.pos !== undefined && { pos: Number(body.pos) }),
    },
  });
  return NextResponse.json({ ...updated, score: Number(updated.score) });
}

// DELETE /api/kvk/players/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await prisma.kvkPlayer.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
