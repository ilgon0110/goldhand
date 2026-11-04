## 반응형 CSS 규칙

cn utils함수를 import한 후 viewport별로 분리하여 작성한다.

ex)
import { cn } from '@/lib/utils';

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
return <section className={cn('mt-6 px-8', 'md:px-20', 'xl:px-56')}>{children}</section>;
}

## 테스트 코드 import 규칙

테스트 코드(`__test__/**`)는 barrel(`index.ts`)을 거치지 않고 대상 모듈 파일을 직접 import한다. barrel로 import하면 slice의 다른 모듈(서버 전용 모듈, `'use server'` 등)까지 함께 로드되어 barrel import error가 발생한다.

ex)
import { PricingForm } from '@/src/feature/price/ui/PricingForm'; // O
import { PricingForm } from '@/src/feature/price'; // X
