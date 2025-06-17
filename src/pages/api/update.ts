import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { user_id: string };
    const author = decoded.user_id;
    const { letter_id, title, content } = req.body;

    if (!letter_id || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 권한 확인: 해당 편지가 본인의 것인지?
    const [rows] = await connection.execute(
      'SELECT id FROM Letter WHERE id = ? AND author = ? AND deleted_at IS NULL',
      [letter_id, author]
    );

    if ((rows as any[]).length === 0) {
      await connection.end();
      return res.status(403).json({ error: '수정 권한이 없습니다.' });
    }

    // 실제 업데이트
    await connection.execute(
      'UPDATE Letter SET title = ?, content = ? WHERE id = ?',
      [title, content, letter_id]
    );

    await connection.end();
    return res.status(200).json({ message: '편지 수정 완료' });
  } catch (error: any) {
    console.error('편지 수정 오류:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}