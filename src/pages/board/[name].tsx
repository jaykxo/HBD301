import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CommentInput from '../../components/comments/CommentInput';

type Letter = { id: number; author: string; content: string };
type Comment = { id: number; postId: string; author: string; content: string };

export default function BoardPage() {
  const { name } = useRouter().query as { name?: string };

  const currentUser = '김재현';

  /* ---------- state ---------- */
  const [letters, setLetters] = useState<Letter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [newLetter, setNewLetter] = useState({ content: '' });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [commentEditId, setCommentEditId] = useState<number | null>(null);
  const [commentEditContent, setCommentEditContent] = useState('');

  /* ---------- 1. 편지 목록 로드 ---------- */
  useEffect(() => {
    if (!name) return;
    (async () => {
      try {
        const res = await fetch(`/api/letters/${name}`);
        if (!res.ok) throw new Error(`${res.status}`);
        setLetters(await res.json());
      } catch (e) {
        console.error('편지 목록 조회 오류', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [name]);

  /* ---------- 2. 새 편지 작성 ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetter.content.trim() || !name) return;

    try {
      const r = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiver: name, author: currentUser, content: newLetter.content }),
      });
      if (!r.ok) throw new Error('작성 실패');

      setNewLetter({ content: '' });
      setLetters(await (await fetch(`/api/letters/${name}`)).json());
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- 3. 편지 수정 ---------- */
  const confirmEdit = async () => {
    if (editIndex === null || !name) return;
    try {
      await fetch('/api/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: letters[editIndex].id, content: editContent }),
      });
      setLetters(await (await fetch(`/api/letters/${name}`)).json());
    } catch (e) {
      console.error('수정 오류', e);
    } finally {
      setEditIndex(null);
      setEditContent('');
    }
  };

  /* ---------- 4. 편지 삭제 ---------- */
  const handleDelete = async (index: number) => {
    if (!name) return;
    try {
      await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: letters[index].id }),
      });
      setLetters((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      console.error('삭제 오류', e);
    }
  };

  /* ---------- 5. 댓글 ---------- */
  const handleCommentInputChange = (i: number, v: string) =>
    setCommentInputs((p) => ({ ...p, [i]: v }));

  const handleCommentSubmit = async (i: number, v: string) => {
    if (!name || !v.trim()) return;
    try {
      const r = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: `${name}-${i}`, author: currentUser, content: v }),
      });
      if (!r.ok) throw new Error('댓글 작성 실패');
      const c = await r.json();
      setComments((prev) => [...prev, c]);
      handleCommentInputChange(i, '');
    } catch (e) {
      console.error(e);
    }
  };

  const confirmCommentEdit = async (id: number) => {
    try {
      await fetch('/api/comment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content: commentEditContent }),
      });
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: commentEditContent } : c)),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setCommentEditId(null);
      setCommentEditContent('');
    }
  };

  const deleteComment = async (id: number) => {
    try {
      await fetch('/api/comment', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  /* ---------- 6. UI ---------- */
  if (loading) return <p>loading…</p>;

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
          <div key={l.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
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
                <button onClick={() => handleDelete(idx)} style={{ marginLeft: '0.5rem' }}>
                  삭제
                </button>
              </div>
            )}

            {/* 댓글 */}
            {currentUser === name && (
              <>
                <CommentInput
                  value={commentInputs[idx] ?? ''}
                  onChange={(v) => handleCommentInputChange(idx, v)}
                  onSubmit={(v) => handleCommentSubmit(idx, v)}
                />
                {comments
                  .filter((c) => c.postId === `${name}-${idx}`)
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
