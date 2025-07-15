import { useEffect } from 'react';

import { apiUrl } from '../config';

const getOrCreateUUID = (): string => {
  const key = 'goldhand:viewer_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const useTrackView = (docId: string, type: 'consult' | 'review') => {
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const viewerId = getOrCreateUUID();

        const res = await (
          await fetch(type === 'consult' ? `${apiUrl}/api/consultDetail/view` : `${apiUrl}/api/review/detail/view`, {
            method: 'POST',
            body: JSON.stringify({ docId, viewerId }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ).json();
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    fetchPost();
  }, [docId, type]);
};
