import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/local', () => ({ default: () => ({ variable: '--font-pretendard' }) }));
vi.mock('next/script', () => ({ default: () => null }));
vi.mock('nuqs/adapters/next/app', () => ({ NuqsAdapter: ({ children }: React.PropsWithChildren) => children }));
vi.mock('react-toastify', () => ({ ToastContainer: () => <div data-testid="toast" /> }));
vi.mock('@/src/app/providers/query-provider', () => ({
  default: ({ children }: React.PropsWithChildren) => children,
}));
vi.mock('@/src/app/providers/theme-provider', () => ({
  ThemeProvider: ({ children }: React.PropsWithChildren) => children,
}));
vi.mock('@/src/widgets/header', () => ({ Header: () => <header>HEADER_SENTINEL</header> }));
vi.mock('@/src/widgets/footer/ui/footer', () => ({ Footer: () => <footer>FOOTER_SENTINEL</footer> }));
vi.mock('@/src/shared/ui/OAuthSuccessHandler', () => ({
  OAuthSuccessHandler: () => {
    throw new Promise(() => undefined);
  },
}));

import RootLayout from '@/app/layout';

describe('root layout SEO rendering boundary', () => {
  it('keeps public chrome and page content outside the OAuth suspense boundary', async () => {
    const element = await RootLayout({ children: <h1>PAGE_SENTINEL</h1> });
    const html = renderToStaticMarkup(element);

    expect(html).toContain('HEADER_SENTINEL');
    expect(html).toContain('PAGE_SENTINEL');
    expect(html).toContain('FOOTER_SENTINEL');
  });
});
