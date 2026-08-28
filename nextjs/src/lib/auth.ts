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
    return jwt.verify(token, process.env.SESSION_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
}
