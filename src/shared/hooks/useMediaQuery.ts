// hooks/useMediaQuery.ts
'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };

  const [matches, setMatches] = useState<boolean>(getInitial());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    // 이벤트 핸들러는 이전 값과 비교해서 실제로 변경이 필요할 때만 setState 호출
    const updateMatch = (e?: MediaQueryListEvent) => {
      const next = e ? e.matches : media.matches;
      setMatches(prev => (prev === next ? prev : next));
    };

    // 초기 동기값 보장(안정성)
    updateMatch();
    media.addEventListener('change', updateMatch);

    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}
