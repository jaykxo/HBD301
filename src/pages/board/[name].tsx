import { useRouter } from "next/router";
import { useState } from "react";
import CommentInput from "../../components/comments/CommentInput";

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
  const [comments, setComments] = useState<any[]>([]);

  const [newLetter, setNewLetter] = useState({
    content: "",
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Comment edit state
  const [commentEditId, setCommentEditId] = useState<number | null>(null);
  const [commentEditContent, setCommentEditContent] = useState("");
  // Comment edit handlers
  const startCommentEdit = (id: number, content: string) => {
    setCommentEditId(id);
    setCommentEditContent(content);
  };

  const cancelCommentEdit = () => {
    setCommentEditId(null);
    setCommentEditContent("");
  };

  const confirmCommentEdit = (id: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: commentEditContent } : c))
    );
    setCommentEditId(null);
    setCommentEditContent("");
  };

  const deleteComment = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

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

  const handleCommentSubmit = async (index: number, value: string) => {
    if (!name || Array.from(value.trim()).length !== 1) return;
    try {
      const response = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: value,
          author: currentUser,
          postId: `${name}-${index}`,
        }),
      });

      if (!response.ok) throw new Error("댓글 작성 실패");

      const newComment = await response.json();
      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.error("댓글 작성 중 오류:", error);
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
                <CommentInput onSubmit={(value) => handleCommentSubmit(index, value)} />
                {comments
                  .filter((c) => c.postId === `${name}-${index}`)
                  .map((c) => (
                    <div key={c.id} style={{ marginTop: "0.5rem" }}>
                      {commentEditId === c.id ? (
                        <>
                          <input
                            value={commentEditContent}
                            onChange={(e) => setCommentEditContent(e.target.value)}
                          />
                          <button onClick={() => confirmCommentEdit(c.id)}>저장</button>
                          <button onClick={cancelCommentEdit}>취소</button>
                        </>
                      ) : (
                        <>
                          <p>💬 {c.content} (by {c.author})</p>
                          <button onClick={() => startCommentEdit(c.id, c.content)}>수정</button>
                          <button onClick={() => deleteComment(c.id)}>삭제</button>
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}