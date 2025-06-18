

import Link from "next/link";

const currentUser = "김재현";

const mockLetters = [
  { recipient: "김재현", author: "정연", content: "생일 축하해 🎂" },
  { recipient: "수아", author: "김재현", content: "하하 고마워!" },
  { recipient: "김재현", author: "민지", content: "올해도 행복하자 😊" },
];

export default function MyBirthdayPage() {
  const receivedLetters = mockLetters.filter((letter) => letter.recipient === currentUser);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎉 내 생일에 받은 편지</h1>
      {receivedLetters.length === 0 ? (
        <p>아직 받은 편지가 없어요.</p>
      ) : (
        receivedLetters.map((letter, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p><strong>From:</strong> {letter.author}</p>
            <p>{letter.content}</p>
          </div>
        ))
      )}
    </div>
  );
}