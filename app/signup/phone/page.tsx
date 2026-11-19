import { Suspense } from 'react';

import { GET as userGET } from '@/app/api/user/route';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { SignupPhonePage } from '@/src/widgets/SignupPhone';

export default async function Page() {
  const data = await jsonOrThrow<IUserResponseData>(await userGET());
  return (
    <Suspense fallback={<LoadingBar />}>
      <SignupPhonePage userData={data.userData} />
    </Suspense>
  );
}
