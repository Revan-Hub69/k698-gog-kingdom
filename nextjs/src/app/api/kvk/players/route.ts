import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/kvk/players?eventId=X
export async function GET(req: NextRequest) {
  const eventId = Number(req.nextUrl.searchParams.get('eventId'));
  if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

  const players = await prisma.kvkPlayer.findMany({
    where: { eventId },
    orderBy: { pos: 'asc' },
  });
  return NextResponse.json(players.map(p => ({ ...p, score: Number(p.score) })));
}

// POST /api/kvk/players — admin bulk upsert players
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { eventId, players } = await req.json();
  if (!eventId || !Array.isArray(players))
    return NextResponse.json({ error: 'eventId and players[] required' }, { status: 400 });

  // Delete existing and re-insert (bulk replace)
  await prisma.kvkPlayer.deleteMany({ where: { eventId: Number(eventId) } });

  const created = await prisma.kvkPlayer.createMany({
    data: players.map((p: {
      pos?: number; name: string; alliance?: string;
      score?: number | string; notes?: string; under100m?: boolean;
    }, i: number) => ({
      eventId: Number(eventId),
      pos: Number(p.pos ?? i + 1),
      name: String(p.name).trim(),
      alliance: p.alliance ? String(p.alliance).trim() : null,
      score: BigInt(Math.round(Number(p.score ?? 0))),
      notes: p.notes ? String(p.notes).trim() : null,
      under100m: Boolean(p.under100m),
      pack90: 0,
      pack60: 0,
      pack30: 0,
    })),
  });
  return NextResponse.json({ count: created.count });
}
