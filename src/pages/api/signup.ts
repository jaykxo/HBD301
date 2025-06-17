import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

// JWT 토큰 생성 함수
const make_token = (user: { user_id: string; user_nickname: string; birth: string }) => {
    return jwt.sign(
    {
      user_id: user.user_id,
      user_nickname: user.user_nickname,
      user_birth: user.birth,
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '15m' }
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id, user_nickname, user_pw, birth } = req.body;

  if (!user_id || !user_nickname || !user_pw) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // DB 연결
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    //  중복 아이디 체크
    const [rows] = await connection.execute(
      'SELECT * FROM User WHERE user_id = ?',
      [user_id]
    );

    if ((rows as any[]).length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // 유저 삽입
    await connection.execute(
        'INSERT INTO User (user_id, user_pw, user_nickname, birth) VALUES (?, ?, ?, ?)',
        [user_id, user_pw, user_nickname, birth]
      );
      

    const token = make_token({ user_id, user_nickname, birth });
    return res.status(201).json({ access_token: token });
  } catch (error: any) {
    console.error('서버 내부 오류입니다. 관리자에게 문의하세요:', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}