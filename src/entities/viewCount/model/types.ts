// viewCount 관련 타입 정의
export interface IViewCountData {
  totalViewCount: number;
}

export interface IViewCountResponseData {
  response: 'ng' | 'ok';
  message: string;
  data: IViewCountData | null;
}
