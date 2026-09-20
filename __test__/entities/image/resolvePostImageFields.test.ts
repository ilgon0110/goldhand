import { describe, expect, it } from 'vitest';

import { resolvePostImageFields } from '@/src/entities/image/api/resolvePostImageFields';

describe('resolvePostImageFields', () => {
  it('새 썸네일과 본문 이미지 URL을 적용한다', () => {
    const result = resolvePostImageFields({
      htmlString: '<p><img id="content-image" src="data:image/png;base64,old"></p>',
      images: [
        { key: 'thumbnail', url: 'https://example.com/thumbnail.webp' },
        { key: 'content-image', url: 'https://example.com/content.webp' },
      ],
    });

    expect(result).toEqual({
      htmlString: '<p><img id="content-image" src="https://example.com/content.webp"></p>',
      thumbnail: 'https://example.com/thumbnail.webp',
    });
  });

  it('새 썸네일이 없으면 수정 전 썸네일을 유지한다', () => {
    const result = resolvePostImageFields({
      htmlString: '<p>수정된 내용</p>',
      images: null,
      previousThumbnail: 'https://example.com/previous.webp',
    });

    expect(result.thumbnail).toBe('https://example.com/previous.webp');
  });

  it('썸네일 업로드가 실패해 URL이 비어 있으면 기존 썸네일을 유지한다', () => {
    const result = resolvePostImageFields({
      htmlString: '<p>수정된 내용</p>',
      images: [{ key: 'thumbnail', url: '' }],
      previousThumbnail: 'https://example.com/previous.webp',
    });

    expect(result.thumbnail).toBe('https://example.com/previous.webp');
  });

  it('생성 시 썸네일이 없으면 null을 반환한다', () => {
    const result = resolvePostImageFields({ htmlString: '<p>내용</p>', images: [] });

    expect(result.thumbnail).toBeNull();
  });
});
