export interface IReviewData {
  status: string;
  message: string;
  data: {
    id: string;
    author: string;
    created_at: string;
    updated_at: string;
    title: string;
    thumbnail: string | null;
    content: string;
    spotSheet: string;
  }[];
}
