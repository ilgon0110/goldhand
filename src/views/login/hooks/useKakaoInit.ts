import { useEffect } from 'react';

export const useKakaoInit = () => {
  useEffect(() => {
    const kakao = (window as any).kakao;
    if (kakao) {
      kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY);
    } else {
      console.error('Kakao SDK is not loaded.');
    }
  }, []);
};
