'use client';

import { useLanguage } from '@/lib/LanguageProvider';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Castle {
  id: number;
  castleName: string;
  currentPower: number;
  historicalMaxPower: number;
  screenshotUrl?: string;
  lastPowerUpdate: string;
}

interface LeaderboardEntry {
  id: number;
  nickname: string;
  totalCastles: number;
  totalCurrentPower: number;
  totalHistoricalPower: number;
  rank: number;
  castles: Castle[];
}

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    checkAuth();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaderboard(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">{t('leaderboardDesc')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t('leaderboardTitle')}</h1>
          <div className="flex gap-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={fetchLeaderboard}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                >
                  {t('refreshLeaderboard')}
                </button>
                <button
                  onClick={() => setShowAccountSheet(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  {t('myAccount')}
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                  {t('signIn')}
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                  {t('signUp')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-4">
        {!isLoggedIn ? (
          <div className="my-20 text-center">
            <p className="text-xl text-slate-400 mb-6">{t('loginToView')}</p>
            <div className="blur-sm pointer-events-none">
              <table className="w-full border border-purple-500/20 rounded-lg">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-4 py-3 text-left">{t('rank')}</th>
                    <th className="px-4 py-3 text-left">{t('castleName')}</th>
                    <th className="px-4 py-3 text-right">{t('historicalPower')}</th>
                    <th className="px-4 py-3 text-right">{t('currentPower')}</th>
                    <th className="px-4 py-3 text-center">{t('screenshot')}</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        ) : (
          <div className="my-10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-purple-500/30 bg-slate-800/40">
                  <th className="px-4 py-4 text-left text-purple-300 font-bold">{t('rank')}</th>
                  <th className="px-4 py-4 text-left text-purple-300 font-bold">{t('castleName')}</th>
                  <th className="px-4 py-4 text-right text-purple-300 font-bold">{t('historicalPower')}</th>
                  <th className="px-4 py-4 text-right text-purple-300 font-bold">{t('currentPower')}</th>
                  <th className="px-4 py-4 text-center text-purple-300 font-bold">{t('screenshot')}</th>
                  <th className="px-4 py-4 text-left text-purple-300 font-bold">{t('lastUpdated')}</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition">
                    <td className="px-4 py-4 text-white font-bold">#{entry.rank}</td>
                    <td className="px-4 py-4 text-white">{entry.nickname}</td>
                    <td className="px-4 py-4 text-right text-green-400 font-semibold">
                      {entry.totalHistoricalPower.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right text-blue-400 font-semibold">
                      {entry.totalCurrentPower.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {entry.castles.some((c) => c.screenshotUrl) ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm">
                      {entry.castles[0]?.lastPowerUpdate
                        ? new Date(entry.castles[0].lastPowerUpdate).toLocaleDateString()
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACCOUNT SHEET PLACEHOLDER */}
      {showAccountSheet && isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowAccountSheet(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl border-t border-purple-500/20 p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-white mb-6">{t('myKingdom')}</h2>
              <p className="text-slate-400">{t('myAccount')} Sheet - Coming Soon</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
