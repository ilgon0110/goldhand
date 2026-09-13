import { describe, expect, it } from 'vitest';

import { generateReviewDescription, generateThumbnailUrl } from '@/src/entities/review/lib/util';

describe('review html util (server rendering safety)', () => {
  it('extracts description text without a browser window/DOMParser', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate a Node.js SSR environment where `window` does not exist
    delete globalThis.window;

    try {
      const html = '<p>산모님 정말 감사했습니다.</p><div>다음에도 이용할게요!</div>';

      expect(generateReviewDescription(html)).toBe('산모님 정말 감사했습니다. 다음에도 이용할게요!');
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('extracts the first image src without a browser window/DOMParser', () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate a Node.js SSR environment where `window` does not exist
    delete globalThis.window;

    try {
      const html = '<p>후기 내용</p><img src="https://example.com/photo.jpg" alt="후기 사진" />';

      expect(generateThumbnailUrl(html)).toBe('https://example.com/photo.jpg');
    } finally {
      globalThis.window = originalWindow;
    }
  });

  it('returns an empty string when there is no image', () => {
    expect(generateThumbnailUrl('<p>이미지 없음</p>')).toBe('');
  });

  it('handles the real HTML shape produced by the Lexical editor (ImageNode.exportDOM)', () => {
    // src/widgets/editor/nodes/ImageNode.tsx exportDOM() always writes attributes on <img>
    // in this exact order: src, alt, width, height, id — this fixture mirrors that output.
    const html =
      '<p class="PlaygroundEditorTheme__paragraph" dir="ltr"><span style="white-space: pre-wrap;">새로운 계정으로 후기남기기</span></p>' +
      '<p class="PlaygroundEditorTheme__paragraph"><div><img src="https://firebasestorage.googleapis.com/v0/b/goldhand-5fd6c.firebasestorage.app/o/reviews%2FgzNS6LQqjoPiJDNB5GftFrTGY7B3%2Fe5e24cb4-cd38-4263-8eb2-a714b9ab2680%2F5?alt=media&token=f876a028-ca44-488e-8550-bc9469897078" alt="" width="inherit" height="inherit" id="5"></div></p>' +
      '<p class="PlaygroundEditorTheme__paragraph" dir="ltr"><span style="white-space: pre-wrap;">부릉</span></p>';

    expect(generateReviewDescription(html)).toBe('새로운 계정으로 후기남기기 부릉');
    expect(generateThumbnailUrl(html)).toBe(
      'https://firebasestorage.googleapis.com/v0/b/goldhand-5fd6c.firebasestorage.app/o/reviews%2FgzNS6LQqjoPiJDNB5GftFrTGY7B3%2Fe5e24cb4-cd38-4263-8eb2-a714b9ab2680%2F5?alt=media&token=f876a028-ca44-488e-8550-bc9469897078',
    );
  });
});
