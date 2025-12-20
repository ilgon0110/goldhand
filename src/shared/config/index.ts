export const franchiseeList = ['전체', '화성동탄점', '수원점'];
export type TFranchiseeList = (typeof franchiseeList)[number];
export const apiUrl =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_URL;
export const NOTI_LIMIT = 3;
