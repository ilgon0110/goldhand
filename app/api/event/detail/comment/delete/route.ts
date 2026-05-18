import type { NextRequest } from 'next/server';

import { deleteComment } from '@/src/entities/comment/lib/commentActions';

export async function DELETE(req: NextRequest) {
  const { userId, docId, commentId } = await req.json();
  return deleteComment('events', { userId, docId, commentId });
}
