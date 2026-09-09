import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.loginType !== undefined) data.loginType = body.loginType;
  if (body.loginName !== undefined) data.loginName = body.loginName;
  if (body.castleName !== undefined) data.castleName = body.castleName;
  if (body.castleLevel !== undefined) data.castleLevel = body.castleLevel;
  if (body.m5Type !== undefined) data.m5Type = body.m5Type;
  if (body.m5Count !== undefined) data.m5Count = Number(body.m5Count);
  if (body.crystalForge !== undefined) data.crystalForge = Boolean(body.crystalForge);
  if (body.crystalForgeNote !== undefined) data.crystalForgeNote = body.crystalForgeNote;
  if (body.pelicano !== undefined) data.pelicano = Boolean(body.pelicano);
  if (body.pelicanoTroops !== undefined) data.pelicanoTroops = Number(body.pelicanoTroops);
  if (body.nwDone !== undefined) data.nwDone = Boolean(body.nwDone);
  if (body.hospitalCapacity !== undefined) data.hospitalCapacity = Number(body.hospitalCapacity);
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);

  // Special: one-click pelican date update
  if (body.pelicanoSentNow === true) data.lastPelicanSent = new Date();
  if (body.pelicanoReceivedNow === true) data.lastPelicanReceived = new Date();
  if (body.lastPelicanSent !== undefined && body.pelicanoSentNow !== true)
    data.lastPelicanSent = body.lastPelicanSent ? new Date(body.lastPelicanSent) : null;
  if (body.lastPelicanReceived !== undefined && body.pelicanoReceivedNow !== true)
    data.lastPelicanReceived = body.lastPelicanReceived ? new Date(body.lastPelicanReceived) : null;

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
