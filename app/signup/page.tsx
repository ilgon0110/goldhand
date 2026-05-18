import { getUserData } from '@/src/shared/api/getUserData';

import { SignupPage } from './ui/SignupPage';

export default async function Page() {
  const data = await getUserData();
  return <SignupPage userData={data.userData} />;
}
