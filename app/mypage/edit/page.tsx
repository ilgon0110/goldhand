import { getUserData } from '@/src/shared/api/getUserData';

import { MyPageEditPage } from './ui/MyPageEditPage';

export default async function Page() {
  const userData = await getUserData();

  if (userData.response === 'ng') {
    throw new Error(userData.message);
  }

  return <MyPageEditPage userData={userData} />;
}
