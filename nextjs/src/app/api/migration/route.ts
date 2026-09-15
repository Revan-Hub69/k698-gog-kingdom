import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - public, returns all submissions
export async function GET() {
  try {
    const submissions = await prisma.migrationSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (e) {
    console.error('[migration GET]', e);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST - no auth required, anyone can submit
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, position, power, screenshots, notes } = body;

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Player name required' }, { status: 400 });
    }
    if (!position?.trim()) {
      return NextResponse.json({ error: 'Position required' }, { status: 400 });
    }
    if (!power?.trim()) {
      return NextResponse.json({ error: 'Power required' }, { status: 400 });
    }
    if (!screenshots || !Array.isArray(screenshots) || screenshots.length === 0) {
      return NextResponse.json({ error: 'At least one screenshot required' }, { status: 400 });
    }

    const submission = await prisma.migrationSubmission.create({
      data: {
        playerName: playerName.trim(),
        position: position.trim(),
        power: power.trim(),
        screenshots,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (e) {
    console.error('[migration POST]', e);
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
