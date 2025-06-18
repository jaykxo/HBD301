import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. SQL 파일 읽기
    const sqlFilePath = path.join(process.cwd(), 'sql', 'spongebob.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    // 2. MySQL 연결
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true, // <-- 중요!
    });

    // 3. SQL 실행
    await connection.query(sql);
    await connection.end();

    res.status(200).json({ message: 'DB import completed ✅' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
