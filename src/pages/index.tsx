import Link from "next/link";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function Home() {
  const months = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
  ];

<<<<<<< HEAD
  const [birthdayData, setBirthdayData] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetch("/api/birthdays")
      .then((res) => res.json())
      .then((data) => setBirthdayData(data))
      .catch(() => alert("생일 데이터를 불러올 수 없습니다."));
  }, []);
=======
  const birthdayData: Record<string, string[]> = {
    "12월": ["이윤아"],
    "7월": ["김재현", "이현재"],
    "5월": ["이영준", "최우석"],
    "6월": ["백지원"],
    "8월": ["권민성", "김현준"],
    "4월": ["김별", "박창현", "오주영"],

  };
>>>>>>> f72ef1508e5323122f2ccce916b723e2ea9a63ee

  return (
    <Layout>
      <div style={{ padding: "2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h1 style={{ whiteSpace: "pre-line", fontSize: "3rem", margin: 0 }}> 🎊 🍰 🧁 👑 HBD 💝 💐 🌟 🌈 ✨{'\n'}🎂 🎉 🥳 🎈 🎁  301 🧸 📅 🛍️ 📦 🪅</h1>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            {months.map((month) => (
              <div
                key={month}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  minHeight: "120px",
                  backgroundColor: "#fafafa",
                }}
              >
                <strong style={{ textAlign: "center", display: "block" }}>{month}</strong>
                <ul style={{ marginTop: "0.5rem" }}>
                  {birthdayData[month]?.map((name) => (
                    <li key={name}>
                      <Link href={`/board/${name}`}>{name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
            <Link href="/login">
              <button style={{ padding: "0.5rem 1.2rem", fontSize: "1rem", borderRadius: "6px" }}>로그인</button>
            </Link>
            <Link href="/my/birthday">
              <button style={{ padding: "0.5rem 1.2rem", fontSize: "1rem", borderRadius: "6px" }}>내 생일 편지 보기</button>
            </Link>
            <Link href="/my/letters">
              <button style={{ padding: "0.5rem 1.2rem", fontSize: "1rem", borderRadius: "6px" }}>내가 쓴 편지 보기</button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
    
  );
}