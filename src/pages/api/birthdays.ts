// pages/api/birthdays.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

type BirthdayMap = Record<string, string[]>;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `SELECT user_nickname, birth FROM User`
    );

    await connection.end();

    const result: BirthdayMap = {};

    (rows as any[]).forEach(({ user_nickname, birth }) => {
      const month = new Date(birth).getMonth() + 1 + '월';
      if (!result[month]) result[month] = [];
      result[month].push(user_nickname);
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('생일 목록 조회 오류:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}