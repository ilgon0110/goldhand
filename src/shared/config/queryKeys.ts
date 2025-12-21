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
  carousel: () => [...reviewKeys.all, 'carousel'] as const,
  detail: (docId: string) => [...reviewKeys.all, 'detail', { docId }] as const,
  editDetail: (docId: string) => [...reviewKeys.all, 'editDetail', { docId }] as const,
};

const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (category: string) => [...eventKeys.lists(), { category }] as const,
  detail: (docId: string) => [...eventKeys.all, 'detail', { docId }] as const,
  editDetail: (docId: string) => [...eventKeys.all, 'editDetail', { docId }] as const,
};

export { authKeys, eventKeys, notificationKeys, reviewKeys };
