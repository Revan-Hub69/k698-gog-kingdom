import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/kvk/events — public list
export async function GET() {
  const events = await prisma.kvkEvent.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { players: true } },
    },
  });
  return NextResponse.json(events);
}

// POST /api/kvk/events — admin creates event
export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { name, date, pack90Total, pack60Total, pack30Total } = await req.json();
  if (!name || !date) return NextResponse.json({ error: 'name and date required' }, { status: 400 });

  const event = await prisma.kvkEvent.create({
    data: {
      name,
      date,
      pack90Total: Number(pack90Total) || 0,
      pack60Total: Number(pack60Total) || 0,
      pack30Total: Number(pack30Total) || 0,
    },
  });
  return NextResponse.json(event);
}
