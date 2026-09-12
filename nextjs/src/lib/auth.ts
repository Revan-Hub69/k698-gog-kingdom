import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: number;
  email: string;
  nickname: string;
  isAdmin: boolean;
}

export function verifyToken(req: NextRequest): JWTPayload | null {
  try {
    const auth = req.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const token = auth.slice(7);
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      console.error('[verifyToken] SESSION_SECRET env var is not set');
      return null;
    }
    return jwt.verify(token, secret) as JWTPayload;
  } catch (e) {
    console.error('[verifyToken] token verification failed:', e instanceof Error ? e.message : String(e));
    return null;
  }
}
