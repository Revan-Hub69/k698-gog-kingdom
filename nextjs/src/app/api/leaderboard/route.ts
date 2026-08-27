import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Get leaderboard with total power per user
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        nickname: true,
        castles: {
          select: {
            id: true,
            castleName: true,
            currentPower: true,
            historicalMaxPower: true,
            screenshotUrl: true,
            lastPowerUpdate: true,
          },
        },
      },
    });

    // Calculate totals and rank by HISTORICAL POWER
    const rankedLeaderboard = leaderboard
      .map((user) => ({
        id: user.id,
        nickname: user.nickname,
        totalCastles: user.castles.length,
        totalCurrentPower: user.castles.reduce((sum, c) => sum + c.currentPower, 0),
        totalHistoricalPower: user.castles.reduce((sum, c) => sum + c.historicalMaxPower, 0),
        castles: user.castles,
      }))
      .sort((a, b) => b.totalHistoricalPower - a.totalHistoricalPower)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return NextResponse.json(rankedLeaderboard, { status: 200 });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

