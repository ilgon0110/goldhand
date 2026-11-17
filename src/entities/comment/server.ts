// 서버 전용 public API. firebase-admin·cookies()를 쓰므로 클라이언트용 index.ts와 분리한다.
export { createComment, deleteComment, updateComment } from './lib/commentActions';
