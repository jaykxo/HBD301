// lib/db.ts
import mysql from 'mysql2/promise';
let pool: mysql.Pool;

export function db() {
  if (pool) return pool;     // 핫리로드 대비
  pool = mysql.createPool({
    host: process.env.DB_HOST,           // shuttle.proxy.rlwy.net
    port: Number(process.env.DB_PORT),   // 10366
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 15000,               // 15 초 이상
    ssl: { rejectUnauthorized: true }    // 필수
  });
  return pool;
}
