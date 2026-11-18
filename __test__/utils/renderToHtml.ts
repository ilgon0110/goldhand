import { Writable } from 'node:stream';

import type { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

// 스트리밍 SSR 결과 HTML. renderToStaticMarkup은 Suspense 뒤의 내용(pending 쿼리)을 기다리지 않으므로,
// 모든 경계가 resolve될 때까지(onAllReady) 기다린 최종 HTML로 SEO 텍스트를 검사한다.
export const renderToHtml = (node: ReactNode) =>
  new Promise<string>((resolve, reject) => {
    let html = '';
    const { pipe } = renderToPipeableStream(node, {
      onAllReady() {
        pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString();
              callback();
            },
            final(callback) {
              resolve(html);
              callback();
            },
          }),
        );
      },
      onShellError: reject,
      // 경계 안의 에러도 실패로 드러낸다(없으면 fallback으로 끝나 원인 없이 텍스트만 빠진다).
      onError: reject,
    });
  });
