import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// Middleware to verify JWT
function verifyToken(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SESSION_SECRET!) as { userId: number };
  } catch {
    return null;
  }
}

// GET user's castles
export async function GET(req: NextRequest) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const castles = await prisma.castle.findMany({
      where: { userId: decoded.userId },
      orderBy: { currentPower: 'desc' },
    });

    return NextResponse.json(castles, { status: 200 });
  } catch (error) {
    console.error('Get castles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch castles' },
      { status: 500 }
    );
  }
}

// POST create castle
export async function POST(req: NextRequest) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { castleName, currentPower = 0 } = await req.json();

    if (!castleName) {
      return NextResponse.json(
        { error: 'Castle name required' },
        { status: 400 }
      );
    }

    // Check if castle name already exists for this user
    const existing = await prisma.castle.findUnique({
      where: {
        userId_castleName: {
          userId: decoded.userId,
          castleName,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Castle name already exists' },
        { status: 400 }
      );
    }

    const castle = await prisma.castle.create({
      data: {
        userId: decoded.userId,
        castleName,
        currentPower,
        historicalMaxPower: currentPower,
      },
    });

    return NextResponse.json(castle, { status: 201 });
  } catch (error) {
    console.error('Create castle error:', error);
    return NextResponse.json(
      { error: 'Failed to create castle' },
      { status: 500 }
    );
  }
}
