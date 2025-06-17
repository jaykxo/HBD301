import Link from "next/link";

export default function Home() {
  const months = [
    "1월", "2월", "3월",
    "4월", "5월", "6월",
    "7월", "8월", "9월",
    "10월", "11월", "12월"
  ];

  const birthdayData: Record<string, string[]> = {
    "3월": ["이윤아"],
    "6월": ["김재현"],
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link href="/login">
          <button>로그인</button>
        </Link>
      </div>
      <h1 style={{ textAlign: "center" }}>🎂 생일 편지 게시판</h1>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
        <Link href="/my/birthday">
          <button style={{ marginTop: "2rem" }}>내 생일 편지 보기</button>
        </Link>
        <Link href="/my/letters">
          <button style={{ marginTop: "1rem" }}>내가 쓴 편지 보기</button>
        </Link>
      </div>
    </div>
  );
}
