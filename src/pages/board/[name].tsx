import { useRouter } from "next/router";
import { useState } from "react";

type Letter = {
  author: string;
  content: string;
  comment?: string;
};

export default function BoardPage() {
  const router = useRouter();
  const { name } = router.query;

  const currentUser = "김재현";

  const [letters, setLetters] = useState<Letter[]>([
    {
      author: "최우석",
      content: "놀러왔어?",
    },
    {
      author: "권민성",
      content: "올해도 좋은 일만 가득하길!",
    },
  ]);

  const [commentInputs, setCommentInputs] = useState<{ [index: number]: string }>({});

  const [newLetter, setNewLetter] = useState({
    content: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleChange = (e) => {
    setNewLetter({ content: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLetter.content) {
      setLetters([...letters, { author: currentUser, content: newLetter.content }]);
      setNewLetter({ content: "" });
    }
  };

  const handleDelete = (index: number) => {
    setLetters(letters.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setEditContent(letters[index].content);
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditContent("");
  };

  const confirmEdit = () => {
    if (editIndex !== null) {
      const updated = [...letters];
      updated[editIndex] = {
        ...updated[editIndex],
        content: editContent,
      };
      setLetters(updated);
      setEditIndex(null);
      setEditContent("");
    }
  };

  const handleCommentInputChange = (index: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [index]: value }));
  };

  const handleCommentSubmit = (index: number) => {
    const value = commentInputs[index] ?? "";
    if (value.trim().length >= 1) {
      setLetters((prevLetters) =>
        prevLetters.map((letter, i) =>
          i === index ? { ...letter, comment: value } : letter
        )
      );
      setCommentInputs((prev) => ({ ...prev, [index]: "" }));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{name}의 생일 편지 게시판 🎉</h1>

      {/* 편지 작성 폼 */}
      {currentUser !== name && (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
          <h2>편지 쓰기</h2>
          <textarea
            name="content"
            placeholder="내용을 입력하세요"
            value={newLetter.content}
            onChange={handleChange}
            required
            style={{ display: "block", marginBottom: "1rem", width: "100%" }}
          />
          <button type="submit">작성 완료</button>
        </form>
      )}

      {/* 편지 목록 */}
      <div style={{ marginTop: "2rem" }}>
        {letters.map((letter, index) => (
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
            {editIndex === index ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button onClick={confirmEdit}>수정 완료</button>
                <button onClick={cancelEdit} style={{ marginLeft: "0.5rem" }}>취소</button>
              </>
            ) : (
              <p>{letter.content}</p>
            )}
            {letter.author === currentUser && editIndex !== index && (
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => startEdit(index)}>수정</button>
                <button onClick={() => handleDelete(index)} style={{ marginLeft: "0.5rem" }}>
                  삭제
                </button>
              </div>
            )}
            {currentUser === name && (
              <>
                <input
                  type="text"
                  maxLength={1}
                  value={commentInputs[index] ?? ""}
                  onChange={(e) => handleCommentInputChange(index, e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ marginRight: "0.5rem" }}
                />
                <button onClick={() => handleCommentSubmit(index)}>댓글 달기</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}