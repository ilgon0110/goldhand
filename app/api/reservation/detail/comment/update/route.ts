import type { NextRequest } from 'next/server';

import { updateComment } from '@/src/entities/comment';

export async function POST(req: NextRequest) {
  const { docId, commentId, comment } = await req.json();
  return updateComment('consults', { docId, commentId, comment });
}
