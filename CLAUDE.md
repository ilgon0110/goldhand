## 반응형 CSS 규칙

cn utils함수를 import한 후 viewport별로 분리하여 작성한다.

ex)
import { cn } from '@/lib/utils';

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
return <section className={cn('mt-6 px-8', 'md:px-20', 'xl:px-56')}>{children}</section>;
}
