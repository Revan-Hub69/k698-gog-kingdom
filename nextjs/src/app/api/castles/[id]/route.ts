import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

function verifyToken(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SESSION_SECRET!) as { userId: number };
  } catch {
    return null;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const castleId = parseInt(params.id);
    const { currentPower, screenshotUrl } = await req.json();

    // Verify ownership
    const castle = await prisma.castle.findUnique({
      where: { id: castleId },
    });

    if (!castle || castle.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Update castle
    const historicalMax = Math.max(
      castle.historicalMaxPower,
      currentPower || castle.currentPower
    );

    const updated = await prisma.castle.update({
      where: { id: castleId },
      data: {
        currentPower: currentPower !== undefined ? currentPower : castle.currentPower,
        historicalMaxPower: historicalMax,
        ...(screenshotUrl && {
          screenshotUrl,
          screenshotUpdatedAt: new Date(),
        }),
        lastPowerUpdate: new Date(),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Update castle error:', error);
    return NextResponse.json(
      { error: 'Failed to update castle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const castleId = parseInt(params.id);

    // Verify ownership
    const castle = await prisma.castle.findUnique({
      where: { id: castleId },
    });

    if (!castle || castle.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.castle.delete({
      where: { id: castleId },
    });

    return NextResponse.json(
      { message: 'Castle deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete castle error:', error);
    return NextResponse.json(
      { error: 'Failed to delete castle' },
      { status: 500 }
    );
  }
}
