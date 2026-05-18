'use client';

import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { ReviewFormPage } from './ui/ReviewFormPage';

export default function Page() {
  return (
    <ImagesContext>
      <ReviewFormPage />
    </ImagesContext>
  );
}
