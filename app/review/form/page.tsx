import { ImagesContext } from '@/src/entities/image/client';

import { ReviewFormPage } from './ui/ReviewFormPage';

// user는 루트 layout이 스트리밍한다(app/layout.tsx).
export default function Page() {
  return (
    <ImagesContext>
      <ReviewFormPage />
    </ImagesContext>
  );
}
