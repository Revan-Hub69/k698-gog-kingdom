import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/kvk/events/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.kvkEvent.findUnique({
    where: { id: Number(id) },
    include: {
      players: { orderBy: { pos: 'asc' } },
    },
  });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // serialize BigInt
  const serialized = {
    ...event,
    players: event.players.map(p => ({
      ...p,
      score: Number(p.score),
    })),
  };
  return NextResponse.json(serialized);
}

// PATCH /api/kvk/events/[id] — admin updates event settings
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.kvkEvent.update({
    where: { id: Number(id) },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.date !== undefined && { date: body.date }),
      ...(body.pack90Total !== undefined && { pack90Total: Number(body.pack90Total) }),
      ...(body.pack60Total !== undefined && { pack60Total: Number(body.pack60Total) }),
      ...(body.pack30Total !== undefined && { pack30Total: Number(body.pack30Total) }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  });
  return NextResponse.json(updated);
}

// DELETE /api/kvk/events/[id] — admin deletes event
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await prisma.kvkEvent.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
