const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (userId: string) => [...notificationKeys.lists(), { userId }] as const,
  detail: (userId: string, notificationId: string) =>
    [...notificationKeys.list(userId), 'detail', { notificationId }] as const,
};

const authKeys = {
  all: ['auth'] as const,
  pathname: (pathname: string) => [...authKeys.all, { pathname }] as const,
  searchParams: (pathname: string, searchParams: string) => [...authKeys.pathname(pathname), { searchParams }] as const,
};

const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (params: { page: number; franchisee: string }) => [...reviewKeys.lists(), params] as const,
  carousel: () => [...reviewKeys.all, 'carousel'] as const,
  detail: (docId: string) => [...reviewKeys.all, 'detail', { docId }] as const,
};

const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params: { page: number; status: string }) => [...eventKeys.lists(), params] as const,
  detail: (docId: string) => [...eventKeys.all, 'detail', { docId }] as const,
};

const myPageKeys = {
  all: ['myPage'] as const,
};

const userKeys = {
  all: ['user'] as const,
};

const reservationKeys = {
  all: ['reservations'] as const,
  lists: () => [...reservationKeys.all, 'list'] as const,
  list: (params: { page: number; hideSecret: string }) => [...reservationKeys.lists(), params] as const,
  detail: (docId: string) => [...reservationKeys.all, 'detail', { docId }] as const,
};

const viewCountKeys = {
  all: ['viewCount'] as const,
  detail: (docId: string) => [...viewCountKeys.all, 'detail', { docId }] as const,
};

export { authKeys, eventKeys, myPageKeys, notificationKeys, reservationKeys, reviewKeys, userKeys, viewCountKeys };
