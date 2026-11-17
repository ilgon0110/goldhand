import type { Timestamp } from 'firebase/firestore';

// 댓글(Comment) 관련 타입 정의
export interface ICommentData {
  id: string;
  comment: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  userId: string;
  docId: string; // 댓글이 달린 문서의 ID (Consult 또는 Review)
  docType: 'consult' | 'event' | 'manager' | 'review'; // 댓글이 달린 문서의 타입
}
