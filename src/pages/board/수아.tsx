/* pages/board/[name].tsx */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CommentInput from '@/components/comments/CommentInput';

type Letter  = { author: string; content: string };
type Comment = { id: number; postId: string; author: string; content: string };

export default function BoardPage() {
  const router = useRouter();
  const { name } = router.query;                 // ex) /board/수아

  /* 0️⃣ 라우터가 준비되지 않았으면 아무것도 렌더링하지 않음 */
  if (!router.isReady) return null;

  /* 1️⃣ name 이 '수아'가 아니라면 404 대체 화면(또는 리다이렉트) */
  if (name !== '수아') {
    return <p style={{ padding: 40 }}>잘못된 접근입니다.</p>;
    // 또는 router.push('/404');
  }

  /* ── 게시판 로직 ───────────────────────────── */

  const currentUser = '김재현';          // 임시 로그인 사용자

  const [letters, setLetters] = useState<Letter[]>([
    { author: '이윤아', content: 'ㅊㅊ' },
    { author: '박준식', content: 'oops' },
  ]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const [newLetter, setNewLetter] = useState({ content: '' });

  const [editIndex, setEditIndex]     = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const [commentEditId, setCommentEditId]           = useState<number | null>(null);
  const [commentEditContent, setCommentEditContent] = useState('');

  /* ---------- 편지 작성 ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetter.content.trim()) return;

    setLetters((prev) => [
      { author: currentUser, content: newLetter.content },
      ...prev,
    ]);
    setNewLetter({ content: '' });
  };

  /* ---------- 편지 수정 ---------- */
  const confirmEdit = () => {
    if (editIndex === null) return;
    setLetters((prev) =>
      prev.map((l, i) => (i === editIndex ? { ...l, content: editContent } : l)),
    );
    setEditIndex(null);
    setEditContent('');
  };

  /* ---------- 편지 삭제 ---------- */
  const handleDelete = (index: number) =>
    setLetters((prev) => prev.filter((_, i) => i !== index));

  /* ---------- 댓글 ---------- */
  const handleCommentInputChange = (i: number, v: string) =>
    setCommentInputs((p) => ({ ...p, [i]: v }));

  const handleCommentSubmit = (i: number, v: string) => {
    if (!v.trim()) return;
    const c: Comment = {
      id: Date.now(),
      postId: `수아-${i}`,
      author: currentUser,
      content: v,
    };
    setComments((prev) => [...prev, c]);
    handleCommentInputChange(i, '');
  };

  const confirmCommentEdit = (id: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: commentEditContent } : c)),
    );
    setCommentEditId(null);
    setCommentEditContent('');
  };

  const deleteComment = (id: number) =>
    setComments((prev) => prev.filter((c) => c.id !== id));

  /* ---------- 렌더 ---------- */
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{name}의 생일 편지 게시판 🎉</h1>

      {/* 새 편지 작성 */}
      {currentUser !== name && (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <textarea
            value={newLetter.content}
            onChange={(e) => setNewLetter({ content: e.target.value })}
            placeholder="내용을 입력하세요"
            required
            style={{ width: '100%', marginBottom: '1rem' }}
          />
          <button>작성 완료</button>
        </form>
      )}

      {/* 편지 목록 */}
      <section style={{ marginTop: '2rem' }}>
        {letters.map((l, idx) => (
          <div
            key={idx}
            style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}
          >
            <p><strong>From:</strong> {l.author}</p>

            {editIndex === idx ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                />
                <button onClick={confirmEdit}>수정 완료</button>
                <button onClick={() => setEditIndex(null)} style={{ marginLeft: '0.5rem' }}>
                  취소
                </button>
              </>
            ) : (
              <p>{l.content}</p>
            )}

            {l.author === currentUser && editIndex !== idx && (
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => (setEditIndex(idx), setEditContent(l.content))}>수정</button>
                <button onClick={() => handleDelete(idx)} style={{ marginLeft: '0.5rem' }}>삭제</button>
              </div>
            )}

            {currentUser === name && (
              <>
                <CommentInput
                  value={commentInputs[idx] ?? ''}
                  onChange={(v) => handleCommentInputChange(idx, v)}
                  onSubmit={(v) => handleCommentSubmit(idx, v)}
                />
                {comments
                  .filter((c) => c.postId === `수아-${idx}`)
                  .map((c) => (
                    <div key={c.id} style={{ marginTop: '0.5rem' }}>
                      {commentEditId === c.id ? (
                        <>
                          <input
                            value={commentEditContent}
                            onChange={(e) => setCommentEditContent(e.target.value)}
                          />
                          <button onClick={() => confirmCommentEdit(c.id)}>저장</button>
                          <button onClick={() => setCommentEditId(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          <p>💬 {c.content} (by {c.author})</p>
                          <button onClick={() => {
                            setCommentEditId(c.id);
                            setCommentEditContent(c.content);
                          }}>수정</button>
                          <button onClick={() => deleteComment(c.id)}>삭제</button>
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}