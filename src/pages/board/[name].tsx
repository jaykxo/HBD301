/* pages/board/[name].tsx */
import { useRouter } from 'next/router';
import { useState } from 'react';
import CommentInput from '@/components/comments/CommentInput';

type Letter  = { author: string; content: string };
type Comment = { id: number; postId: string; author: string; content: string };

export default function BoardPage() {
  const { query, isReady } = useRouter();
  const name = String(query.name ?? '');

  /* ① 이름별 시드 편지 + 기본 편지 */
  const lettersByName: Record<string, Letter[]> = {
    수아: [
      { author: '최우석', content: '놀러왔어?' },
      { author: '김재현', content: '생일 축하해~' },
    ],
    이영준: [
      { author: '석재민', content: '축하해!' },
      { author: '이현재', content: '생일 축하해!!' },
    ],
    백지원: [
      { author: '장지민', content: '축하드려요!' },
      { author: '이유민', content: ':)' },
    ],
  };
  const defaultLetters: Letter[] = [
    { author: '김재현', content: '굿굿' },
    { author: '박준식', content: 'oooops' },
    { author: '이윤아', content: '...!' },
  ];
  const initialLetters = lettersByName[name] ?? defaultLetters;

  const currentUser = '김재현';

  /* ② state */
  const [letters, setLetters]          = useState<Letter[]>(initialLetters);
  const [comments, setComments]        = useState<Comment[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [newLetter, setNewLetter]      = useState({ content: '' });

  const [editIndex, setEditIndex]      = useState<number | null>(null);
  const [editContent, setEditContent]  = useState('');

  const [commentEditId, setCommentEditId]          = useState<number | null>(null);
  const [commentEditContent, setCommentEditContent] = useState('');

  /* ---------- 편지 작성 ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetter.content.trim()) return;

    setLetters(prev => [
      { author: currentUser, content: newLetter.content },
      ...prev,
    ]);
    setNewLetter({ content: '' });
  };

  /* ---------- 편지 수정 ---------- */
  const confirmEdit = () => {
    if (editIndex === null) return;
    setLetters(prev =>
      prev.map((l, i) => (i === editIndex ? { ...l, content: editContent } : l)),
    );
    setEditIndex(null);
    setEditContent('');
  };

  /* ---------- 편지 삭제 ---------- */
  const handleDelete = (idx: number) =>
    setLetters(prev => prev.filter((_, i) => i !== idx));

  /* ---------- 댓글 ---------- */
  const handleCommentInputChange = (i: number, v: string) =>
    setCommentInputs(p => ({ ...p, [i]: v }));

  const handleCommentSubmit = (i: number, v: string) => {
    if (!v.trim()) return;

    const c: Comment = {
      id: Date.now(),
      postId: `${name}-${i}`,
      author: currentUser,
      content: v,
    };
    setComments(prev => [...prev, c]);
    handleCommentInputChange(i, '');
  };

  const confirmCommentEdit = (id: number) => {
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, content: commentEditContent } : c)),
    );
    setCommentEditId(null);
    setCommentEditContent('');
  };

  const deleteComment = (id: number) =>
    setComments(prev => prev.filter(c => c.id !== id));

  /* ③ 라우터 준비 전엔 빈 div */
  if (!isReady) return <div />;

  /* ---------- 렌더 ---------- */
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{name}의 생일 편지 게시판 🎉</h1>

      {/* 새 편지 작성 */}
      {currentUser !== name && (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <h2>편지 쓰기</h2>
          <textarea
            value={newLetter.content}
            onChange={e => setNewLetter({ content: e.target.value })}
            placeholder="내용을 입력하세요"
            required
            style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
          />
          <button type="submit">작성 완료</button>
        </form>
      )}

      {/* 편지 목록 */}
      <section style={{ marginTop: '2rem' }}>
        {letters.map((l, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              background: '#f9f9f9',
            }}
          >
            <p>
              <strong>From:</strong> {l.author}
            </p>

            {editIndex === idx ? (
              <>
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
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
                  onChange={v => handleCommentInputChange(idx, v)}
                  onSubmit={v => handleCommentSubmit(idx, v)}
                />

                {comments
                  .filter(c => c.postId === `${name}-${idx}`)
                  .map(c => (
                    <div key={c.id} style={{ marginTop: '0.5rem' }}>
                      {commentEditId === c.id ? (
                        <>
                          <input
                            value={commentEditContent}
                            onChange={e => setCommentEditContent(e.target.value)}
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
