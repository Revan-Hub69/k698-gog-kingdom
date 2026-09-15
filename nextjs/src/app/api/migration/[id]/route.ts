import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// PATCH — admin only: edit playerName, position, power, notes
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    const b = await req.json();
    const updated = await prisma.migrationSubmission.update({
      where: { id: Number(id) },
      data: {
        ...(b.playerName !== undefined && { playerName: b.playerName }),
        ...(b.position !== undefined && { position: b.position }),
        ...(b.power !== undefined && { power: b.power }),
        ...(b.notes !== undefined && { notes: b.notes }),
        ...(b.screenshots !== undefined && { screenshots: b.screenshots }),
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('[migration PATCH]', e);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = verifyToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!user.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;
    await prisma.migrationSubmission.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[migration DELETE]', e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
