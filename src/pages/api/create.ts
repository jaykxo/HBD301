import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

function daysUntil(dateStr: string): number {
  const today = new Date();
  const target = new Date(`${today.getFullYear()}-${dateStr.slice(5)}`);
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { user_id: string };
    const author = decoded.user_id;
    const { receiver, title, content } = req.body;

    if (!receiver || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute('SELECT birth FROM User WHERE user_id = ?', [receiver]);
    if ((rows as any[]).length === 0) return res.status(404).json({ error: 'Receiver not found' });

    const friendBirth = (rows as any[])[0].birth as string;
    const diffDays = daysUntil(friendBirth);
    if (diffDays < 0 || diffDays > 5) {
      return res.status(403).json({ error: '생일 5일 전부터만 편지를 보낼 수 있습니다.' });
    }

    await connection.execute(
      'INSERT INTO Letter (title, content, author, receiver) VALUES (?, ?, ?, ?)',
      [title, content, author, receiver]
    );

    return res.status(201).json({ message: '편지 작성 완료' });
  } catch (error: any) {
    console.error('편지 작성 오류:', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
