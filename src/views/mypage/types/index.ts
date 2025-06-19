export interface IMyPageUpdatePost {
  userId: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  email: string;
}

export interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}
