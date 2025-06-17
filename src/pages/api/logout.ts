import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    // Refresh Token 유효성 확인
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { user_id: string };
    const userId = payload.user_id;

    // DB 연결
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // DB에서 해당 Refresh Token 삭제
    const [result] = await connection.execute(
      'DELETE FROM JWT_Token WHERE user_id = ? AND refresh_token = ?',
      [userId, token]
    );

    await connection.end();

    return res.status(200).json({ message: '로그아웃 완료' });
  } catch (err: any) {
    return res.status(403).json({ error: 'Invalid or expired token', detail: err.message });
  }
}