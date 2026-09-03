import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/src/shared/ui/FadeInWhenVisible', () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
}));

import { MainTitle } from '@/src/feature/home/mainTitle/ui/MainTitle';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

describe('SEO heading semantics', () => {
  it('uses h1 by default for standalone page heroes', () => {
    render(<SectionTitleHero label="이용요금" />);

    expect(screen.getByRole('heading', { level: 1, name: /이용요금/ })).toBeInTheDocument();
  });

  it('supports h2 for subordinate home sections', () => {
    render(<SectionTitleHero label="자주 묻는 질문" level="h2" />);

    expect(screen.getByRole('heading', { level: 2, name: /자주 묻는 질문/ })).toBeInTheDocument();
  });

  it('gives the home introduction its primary h1', () => {
    render(<MainTitle />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
