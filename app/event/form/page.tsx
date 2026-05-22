'use client';

import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { EventFormPage } from './ui/EventFormPage';

export default function Page() {
  return (
    <ImagesContext>
      <EventFormPage />
    </ImagesContext>
  );
}
