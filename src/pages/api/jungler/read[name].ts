// pages/api/letter/r.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { receiver } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!receiver) {
    return res.status(400).json({ error: 'Receiver ID is required' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      'SELECT * FROM Letter WHERE receiver = ? AND deleted_at IS NULL ORDER BY created_at DESC',
      [receiver]
    );

    return res.status(200).json(rows);
  } catch (error: any) {
    console.error('편지 조회 오류:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
