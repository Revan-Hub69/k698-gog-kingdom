import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Only users WITH at least one castle
    const users = await prisma.user.findMany({
      where: {
        castles: { some: {} },
      },
      include: { castles: true },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to leaderboard entries ranked by historical power
    const leaderboard = users
      .map((user, index) => {
        const totalHistoricalPower = user.castles.reduce(
          (sum, castle) => sum + castle.historicalMaxPower,
          0
        );
        const totalCurrentPower = user.castles.reduce(
          (sum, castle) => sum + castle.currentPower,
          0
        );

        return {
          id: user.id,
          nickname: user.nickname || `User_${user.id}`,
          totalCastles: user.castles.length,
          totalCurrentPower,
          totalHistoricalPower,
          rank: index + 1,
          castles: user.castles,
        };
      })
      .sort((a, b) => b.totalHistoricalPower - a.totalHistoricalPower)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    // Return ALL players (no limit)
    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
