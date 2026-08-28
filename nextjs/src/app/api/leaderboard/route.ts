import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { castles: { some: {} } },
      include: { castles: true },
      orderBy: { createdAt: 'desc' },
    });

    const leaderboard = users
      .map(user => {
        // Convert BigInt to Number for all power fields
        const castles = user.castles.map(c => ({
          ...c,
          currentPower: Number(c.currentPower),
          historicalMaxPower: Number(c.historicalMaxPower),
          totalHistoricalPower: Number(c.totalHistoricalPower),
        }));

        const totalHistoricalPower = castles.reduce((s, c) => s + c.historicalMaxPower, 0);
        const totalCurrentPower    = castles.reduce((s, c) => s + c.currentPower, 0);
        const hasScreenshot = castles.some(c => c.screenshotUrl);

        return {
          id: user.id,
          nickname: user.nickname,
          totalCastles: castles.length,
          totalCurrentPower,
          totalHistoricalPower,
          hasScreenshot,
          rank: 0,
          castles,
        };
      })
      .sort((a, b) => b.totalHistoricalPower - a.totalHistoricalPower)
      .map((entry, i) => ({ ...entry, rank: i + 1 }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
