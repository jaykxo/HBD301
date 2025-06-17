import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

// JWT 검증 함수
const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded: any = verifyToken(token);
    const userId = decoded.user_id;

    const { letterId, content } = req.body;

    // 1. 댓글 길이 확인
    if (!content || content.length !== 1) {
      return res.status(400).json({ error: '댓글은 반드시 1자만 입력되어야 합니다.' });
    }

    // 2. DB 연결
    const conn = await mysql.createConnection({
      uri: process.env.DATABASE_URL,
    });

    // 3. 해당 편지의 receiver가 현재 유저인지 확인
    const [[letter]]: any = await conn.execute(
      'SELECT receiver FROM Letter WHERE id = ?',
      [letterId]
    );

    if (!letter) {
      await conn.end();
      return res.status(404).json({ error: '해당 편지를 찾을 수 없습니다.' });
    }

    if (letter.receiver !== userId) {
      await conn.end();
      return res.status(403).json({ error: '생일자 본인만 댓글 작성이 가능합니다.' });
    }

    // 4. 이미 댓글 작성했는지 확인
    const [[existing]]: any = await conn.execute(
      'SELECT COUNT(*) AS count FROM Comment WHERE letter_id = ? AND comment_author = ?',
      [letterId, userId]
    );

    if (existing.count > 0) {
      await conn.end();
      return res.status(409).json({ error: '이미 댓글을 작성하였습니다.' });
    }

    // 5. 댓글 작성
    await conn.execute(
      'INSERT INTO Comment (letter_id, content, comment_author) VALUES (?, ?, ?)',
      [letterId, content, userId]
    );

    await conn.end();
    return res.status(201).json({ message: '댓글 작성 완료' });
  } catch (err: any) {
    console.error('댓글 작성 오류:', err.message);
    return res.status(500).json({ error: '서버 내부 오류' });
  }
}
