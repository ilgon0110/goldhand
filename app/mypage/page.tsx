import { getMyPageData } from './api';
import { MyPagePage } from './ui/MyPagePage';

export default async function Page() {
  const data = await getMyPageData();

  if (data.response !== 'ok') {
    throw new Error(data.message || '마이페이지 데이터를 불러오는 중 오류가 발생했습니다.');
  }

  return <MyPagePage myPageData={data} />;
}
