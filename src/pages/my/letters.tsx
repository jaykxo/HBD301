import Link from "next/link";

const currentUser = "김재현";

const mockLetters = [
  { recipient: "정연", author: "김재현", content: "생일 축하해~" },
  { recipient: "수아", author: "김재현", content: "올해도 좋은 일만 가득하길!" },
  { recipient: "현서", author: "권민성", content: "즐거운 생일 보내!" },
];

export default function MyLettersPage() {
  const myLetters = mockLetters.filter((letter) => letter.author === currentUser);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>📬 내가 쓴 편지</h1>
      {myLetters.length === 0 ? (
        <p style={{ textAlign: "center" }}>아직 쓴 편지가 없어요.</p>
      ) : (
        myLetters.map((letter, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              margin: "1rem auto",
              maxWidth: "600px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p><strong>To:</strong> {letter.recipient}</p>
            <p>{letter.content}</p>
            <Link href={`/board/${letter.recipient}`}>📨 해당 게시판으로 이동</Link>
          </div>
        ))
      )}
    </div>
  );
}
