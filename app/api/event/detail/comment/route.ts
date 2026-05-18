import type { NextRequest } from 'next/server';

import { createComment } from '@/src/entities/comment/lib/commentActions';

export async function POST(request: NextRequest) {
  const { docId, comment } = await request.json();
  return createComment('events', 'event', { docId, comment });
}
