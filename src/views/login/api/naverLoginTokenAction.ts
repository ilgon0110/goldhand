'use server';

interface IResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

export async function naverLoginTokenAction(code: string): Promise<IResponse> {
  try {
    const tokenData: IResponse = await (
      await fetch(
        `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&state=${process.env.NEXT_PUBLIC_STATE_STRING}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    ).json();

    return tokenData;
  } catch (error) {
    console.error('Error fetching post data:', error);
    throw error;
  }
}
