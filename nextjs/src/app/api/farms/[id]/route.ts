import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  const b = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  if (b.loginType        !== undefined) data.loginType        = b.loginType;
  if (b.loginName        !== undefined) data.loginName        = b.loginName;
  if (b.castleName       !== undefined) data.castleName       = b.castleName;
  if (b.castleLevel      !== undefined) data.castleLevel      = b.castleLevel;
  if (b.m5Cavalry        !== undefined) data.m5Cavalry        = Number(b.m5Cavalry);
  if (b.m5Ranged         !== undefined) data.m5Ranged         = Number(b.m5Ranged);
  if (b.crystalForge     !== undefined) data.crystalForge     = Boolean(b.crystalForge);
  if (b.crystalForgeNote !== undefined) data.crystalForgeNote = b.crystalForgeNote;
  if (b.pelicano         !== undefined) data.pelicano         = Boolean(b.pelicano);
  if (b.pelicanoTroops   !== undefined) data.pelicanoTroops   = Number(b.pelicanoTroops);
  if (b.nwOptimized      !== undefined) data.nwOptimized      = Boolean(b.nwOptimized);
  if (b.talentoCura      !== undefined) data.talentoCura      = Boolean(b.talentoCura);
  if (b.hospitalCapacity !== undefined) data.hospitalCapacity = Number(b.hospitalCapacity);
  if (b.notes            !== undefined) data.notes            = b.notes;
  if (b.sortOrder        !== undefined) data.sortOrder        = Number(b.sortOrder);

  // One-click pelican updates
  if (b.pelicanoSentNow     === true) data.lastPelicanSent     = new Date();
  if (b.pelicanoReceivedNow === true) data.lastPelicanReceived = new Date();
  if (b.lastPelicanSent     !== undefined && !b.pelicanoSentNow)
    data.lastPelicanSent = b.lastPelicanSent ? new Date(b.lastPelicanSent) : null;
  if (b.lastPelicanReceived !== undefined && !b.pelicanoReceivedNow)
    data.lastPelicanReceived = b.lastPelicanReceived ? new Date(b.lastPelicanReceived) : null;

  // One-click NW done
  if (b.nwDoneNow === true)  data.nwLastDone = new Date();
  if (b.nwResetNow === true) data.nwLastDone = null;
  if (b.nwLastDone !== undefined && !b.nwDoneNow && !b.nwResetNow)
    data.nwLastDone = b.nwLastDone ? new Date(b.nwLastDone) : null;

  const farm = await prisma.farm.update({ where: { id: Number(id) }, data });
  return NextResponse.json(farm);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  await prisma.farm.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
