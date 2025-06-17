import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

const verifyToken = (token: string) => jwt.verify(token, process.env.JWT_SECRET!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const commentId = req.query.id;
  if (!commentId || Array.isArray(commentId)) {
    return res.status(400).json({ error: 'Invalid comment ID' });
  }

  let conn;
  try {
    const decoded: any = verifyToken(token);
    const userId = decoded.user_id;

    conn = await mysql.createConnection({ uri: process.env.DATABASE_URL });

    // 댓글 + 편지 receiver 확인
    const [[comment]]: any = await conn.execute(
      `SELECT c.comment_author, l.receiver 
       FROM Comment c 
       JOIN Letter l ON c.letter_id = l.id 
       WHERE c.no = ?`,
      [commentId]
    );

    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.comment_author !== userId || comment.receiver !== userId) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    // PUT - 댓글 수정
    if (req.method === 'PUT') {
      const { content } = req.body;
      if (!content || content.length < 1 || content.length > 300) {
        return res.status(400).json({ error: '댓글 내용이 유효하지 않습니다.' });
      }

      await conn.execute(
        'UPDATE Comment SET content = ? WHERE no = ?',
        [content, commentId]
      );
      return res.status(200).json({ message: '댓글 수정 완료' });
    }

    // DELETE - 댓글 삭제
    if (req.method === 'DELETE') {
      await conn.execute('DELETE FROM Comment WHERE no = ?', [commentId]);
      return res.status(200).json({ message: '댓글 삭제 완료' });
    }

    // 그 외 method
    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (err: any) {
    return res.status(500).json({ error: '서버 오류', detail: err.message });
  } finally {
    if (conn) await conn.end();
  }
}
