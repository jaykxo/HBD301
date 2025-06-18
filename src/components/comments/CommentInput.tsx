import { useState } from "react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
}

export default function CommentInput({ onSubmit }: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (Array.from(content.trim()).length !== 1) return;
    onSubmit(content);
    setContent(""); // 입력창 초기화
  };

  return (
    <div style={{ marginTop: "1rem", display: "flex", alignItems: "center" }}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글은 이모지 하나로 작성해주세요!"
        style={{
          width: "18rem",
          height: "2.5rem",
          textAlign: "center",
          padding: "0.2rem",
          marginRight: "0.5rem",
          fontSize: "0.8rem"
        }}
      />
      <button onClick={handleSubmit} style={{ height: "2rem" }}>
        댓글 작성
      </button>
    </div>
  );
}
