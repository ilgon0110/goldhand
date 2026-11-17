export function isSafeReservationRedirectPath(path: string | null | undefined): path is string {
  if (!path) return false;

  // 호출부가 실제로 사용하는 문자열(searchParams가 한 번 디코딩한 값)을 그대로 검증한다.
  return /^\/reservation\/list\/[A-Za-z0-9_-]+$/.test(path);
}
