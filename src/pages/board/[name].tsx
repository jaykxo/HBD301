/* pages/board/[name].tsx */
import { useRouter } from 'next/router';
import { useState } from 'react';
import CommentInput from '@/components/comments/CommentInput';

type Letter  = { author: string; content: string };
type Comment = { id: number; postId: string; author: string; content: string };

export default function BoardPage() {
  const { query, isReady } = useRouter();
  const name = String(query.name ?? '');

  /* ① 초기 편지 */
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

  /* ② 모든 Hook은 무조건 호출 */
  const [letters, setLetters]          = useState<Letter[]>(initialLetters);
  const [comments, setComments]        = useState<Comment[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [newLetter, setNewLetter]      = useState({ content: '' });

  const [editIndex, setEditIndex]      = useState<number | null>(null);
  const [editContent, setEditContent]  = useState('');

  const [commentEditId, setCommentEditId]          = useState<number | null>(null);
  const [commentEditContent, setCommentEditContent] = useState('');

  /* ---------- 편지·댓글 핸들러 (기존과 동일) ---------- */
  // ... (생략)

  /* ③ 렌더 */
  if (!isReady) return <div />;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{name}의 생일 편지 게시판 🎉</h1>

      {/* 수아 전용 안내문 예시 */}
      {name !== '수아' && (
        <p style={{ color: 'gray' }}>수아가 아니어도 편지를 남길 수 있어요!</p>
      )}

      {/* 이하 기존 JSX 유지 */}
    </div>
  );
}
