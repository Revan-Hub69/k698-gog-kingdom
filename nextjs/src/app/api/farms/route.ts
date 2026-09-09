import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const farms = await prisma.farm.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(farms.map(f => ({ ...f })));
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const farm = await prisma.farm.create({
    data: {
      loginType: body.loginType ?? 'funplus',
      loginName: body.loginName ?? '',
      castleName: body.castleName ?? '',
      castleLevel: body.castleLevel ?? '',
      m5Type: body.m5Type ?? 'no',
      m5Count: Number(body.m5Count) || 0,
      crystalForge: Boolean(body.crystalForge),
      crystalForgeNote: body.crystalForgeNote ?? null,
      pelicano: Boolean(body.pelicano),
      pelicanoTroops: Number(body.pelicanoTroops) || 0,
      lastPelicanSent: body.lastPelicanSent ? new Date(body.lastPelicanSent) : null,
      lastPelicanReceived: body.lastPelicanReceived ? new Date(body.lastPelicanReceived) : null,
      nwDone: Boolean(body.nwDone),
      hospitalCapacity: Number(body.hospitalCapacity) || 0,
      notes: body.notes ?? null,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  return NextResponse.json(farm);
}
