'use server';

export async function rejoinAction(userId: string) {
  try {
    const res = await (
      await fetch('/api/user/rejoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
    ).json();

    return res;
  } catch (error) {
    console.error('재가입 중 오류 발생:', error);
    throw new Error('재가입 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}
