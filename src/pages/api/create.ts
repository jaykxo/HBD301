import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

//  D-day 계산
function daysUntil(dateStr: string): number {
  const nowUTC = new Date();
  const nowKST = new Date(nowUTC.getTime() + 9 * 60 * 60 * 1000); // UTC → KST

  const str = String(dateStr); 
  const target = new Date(`${nowKST.getFullYear()}-${str.slice(5)}`);

  if (target < nowKST) target.setFullYear(nowKST.getFullYear() + 1);

  const diff = target.getTime() - nowKST.getTime();
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

    // 1. 생일자 정보 조회
    const [rows] = await connection.execute('SELECT birth FROM User WHERE user_id = ?', [receiver]);
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // 2. 생일 5일 전부터만 작성 가능 (KST 기준)
    const friendBirth = (rows as any[])[0].birth;
    const diffDays = daysUntil(friendBirth);

    if (diffDays < 0 || diffDays > 5) {
      return res.status(403).json({ error: '생일 5일 전부터만 편지를 보낼 수 있습니다.' });
    }

    // 3. 중복 편지 확인 (author → receiver)
    const [existing] = await connection.execute(
      'SELECT id FROM Letter WHERE author = ? AND receiver = ? AND deleted_at IS NULL',
      [author, receiver]
    );
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ error: '이미 해당 친구에게 편지를 작성했습니다.' });
    }

    // 4. 편지 작성
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
