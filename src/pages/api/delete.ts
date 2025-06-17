import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as {
      user_id: string;
    };
    const author = decoded.user_id;
    const { letter_id } = req.body;

    if (!letter_id) {
      return res.status(400).json({ error: 'Missing letter_id' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    //  트랜잭션 시작 
    await connection.beginTransaction();

    // 편지 소프트 삭제
    const [result] = await connection.execute(
      'UPDATE Letter SET deleted_at = NOW() WHERE id = ? AND author = ? AND deleted_at IS NULL',
      [letter_id, author]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: '삭제할 편지를 찾을 수 없습니다.' });
    }

    // 로그 기록
    await connection.execute(
      'INSERT INTO ActivityLog (user_id, action, target_table, target_id, metadata) VALUES (?, ?, ?, ?, ?)',
      [
        author,
        'delete_letter',
        'Letter',
        letter_id,
        JSON.stringify({ message: '사용자가 편지를 삭제' }),
      ]
    );

    await connection.commit();

    return res.status(200).json({ message: '편지 삭제 및 로그 기록 완료' });
  } catch (error: any) {
    console.error('편지 삭제 오류:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
