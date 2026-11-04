import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';

let observerCallback: IntersectionObserverCallback;

const mockTop = (top: number) =>
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ top } as DOMRect);

describe('FadeInWhenVisible', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  const getWrapper = () => screen.getByText('내용').parentElement as HTMLElement;

  it('이미 화면 안에 있는 콘텐츠는 숨기지 않고 그대로 보여준다', () => {
    mockTop(100);
    render(
      <FadeInWhenVisible>
        <p>내용</p>
      </FadeInWhenVisible>,
    );

    expect(getWrapper()).toHaveAttribute('data-phase', 'static');
    expect(getWrapper()).not.toHaveClass('opacity-0');
  });

  it('화면 아래에 있는 콘텐츠는 숨겼다가 스크롤로 들어오면 페이드인한다', () => {
    mockTop(5000);
    render(
      <FadeInWhenVisible delay={0.2}>
        <p>내용</p>
      </FadeInWhenVisible>,
    );

    expect(getWrapper()).toHaveClass('opacity-0');

    act(() => observerCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));

    expect(getWrapper()).toHaveAttribute('data-phase', 'shown');
    expect(getWrapper()).toHaveClass('animate-in');
    expect(getWrapper()).toHaveStyle({ animationDelay: '0.2s' });
  });

  it('동작 줄이기 설정 사용자에게는 애니메이션을 적용하지 않는다', () => {
    mockTop(5000);
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    render(
      <FadeInWhenVisible>
        <p>내용</p>
      </FadeInWhenVisible>,
    );

    expect(getWrapper()).toHaveAttribute('data-phase', 'static');
  });
});
