import type { Metadata } from 'next';

export const noIndexMetadata: Metadata = {
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
