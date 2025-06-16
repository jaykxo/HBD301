import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

// ✅ JWT 토큰 생성 함수 (birth 추가)
const make_token = (user: { user_id: string; user_nickname: string; birth: string }) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      user_nickname: user.user_nickname,
      birth: user.birth,
    },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '15m' }
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id, user_pw } = req.body;

  if (!user_id || !user_pw) {
    return res.status(400).json({ error: 'Missing user_id or user_pw' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // 유저 조회
    const [rows] = await connection.execute(
      'SELECT * FROM User WHERE user_id = ?',
      [user_id]
    );

    const user = (rows as any[])[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid user_id or password' });
    }

    // 비밀번호 비교 (평문 비교, 해싱 안 했을 경우)
    if (user.user_pw !== user_pw) {
      return res.status(401).json({ error: 'Invalid user_id or password' });
    }

    // ✅ JWT 발급 (birth 포함)
    const token = make_token({
      user_id: user.user_id,
      user_nickname: user.user_nickname,
      birth: user.birth, // DATE 타입일 경우 문자열로 들어옴 (예: "2001-12-05")
    });

    return res.status(200).json({ access_token: token });
  } catch (error: any) {
    console.error('서버내부에서 오류가 발생했습니다. 관리자에게 문의해주세요', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}