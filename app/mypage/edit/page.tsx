import { getUserLoginData } from '@/src/shared/api/getUserData';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const userData = await getUserLoginData();

  if (userData.response === 'ng') {
    throw new Error(userData.message);
  }

  return <MyPageEditPage userData={userData} />;
}
