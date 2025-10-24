'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ITruncateTextProps {
  text: string;
  maxLines: number; // 몇 줄까지 허용할지
  className?: string; // 추가 스타일링을 위한 클래스
}

const TruncateText: React.FC<ITruncateTextProps> = ({ text, maxLines, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [truncatedText, setTruncatedText] = useState<string>(text);

  useEffect(() => {
    const truncate = () => {
      const container = containerRef.current;

      if (!container) return;

      // 초기 텍스트 설정
      container.textContent = text;

      // container의 높이를 기준으로 자르기 시작
      const lineHeight = parseFloat(getComputedStyle(container).lineHeight || '0');
      const maxHeight = lineHeight * maxLines;

      if (container.scrollHeight <= maxHeight) {
        // 텍스트가 줄을 넘지 않으면 그대로 둠
        setTruncatedText(text);
        return;
      }

      // 이진 탐색으로 텍스트 줄임
      let start = 0;
      let end = text.length;
      let result = text;

      while (start < end) {
        const middle = Math.floor((start + end) / 2);
        container.textContent = text.slice(0, middle) + '...';

        if (container.scrollHeight > maxHeight) {
          // 초과하면 텍스트를 더 줄임
          end = middle;
        } else {
          // 초과하지 않으면 더 늘림
          result = text.slice(0, middle) + '...';
          start = middle + 1;
        }
      }

      setTruncatedText(result);
    };

    truncate();

    // 윈도우 리사이즈 시에도 다시 계산
    window.addEventListener('resize', truncate);
    return () => window.removeEventListener('resize', truncate);
  }, [text, maxLines]);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: maxLines,
      }}
    >
      {truncatedText}
    </div>
  );
};

export default TruncateText;
