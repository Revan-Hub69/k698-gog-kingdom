import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const farms = await prisma.farm.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(farms);
}

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const b = await req.json();
  const farm = await prisma.farm.create({
    data: {
      loginType:        b.loginType        ?? 'funplus',
      loginName:        b.loginName        ?? '',
      castleName:       b.castleName       ?? '',
      castleLevel:      b.castleLevel      ?? '',
      m5Cavalry:        Number(b.m5Cavalry)  || 0,
      m5Ranged:         Number(b.m5Ranged)   || 0,
      crystalForge:     Boolean(b.crystalForge),
      crystalForgeNote: b.crystalForgeNote   ?? null,
      pelicano:         Boolean(b.pelicano),
      pelicanoTroops:   Number(b.pelicanoTroops) || 0,
      lastPelicanSent:     b.lastPelicanSent     ? new Date(b.lastPelicanSent)     : null,
      lastPelicanReceived: b.lastPelicanReceived ? new Date(b.lastPelicanReceived) : null,
      nwLastDone:          b.nwLastDone          ? new Date(b.nwLastDone)          : null,
      nwOptimized:         Boolean(b.nwOptimized),
      hospitalCapacity: Number(b.hospitalCapacity) || 0,
      notes:            b.notes ?? null,
      sortOrder:        Number(b.sortOrder) || 0,
    },
  });
  return NextResponse.json(farm);
}
