import type { NextRequest } from 'next/server';

import { createComment } from '@/src/entities/comment';

export async function POST(request: NextRequest) {
  const { docId, comment } = await request.json();
  return createComment('reviews', 'review', { docId, comment });
}
