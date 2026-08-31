export type TSerializedTimestamp = { seconds: number; nanoseconds: number };

type TTimestampLike = { seconds: number; nanoseconds: number };

/**
 * Admin SDK의 Timestamp는 JSON.stringify 시 {seconds, nanoseconds}가 아니라
 * 내부 필드 {_seconds, _nanoseconds}로 직렬화된다. 클라이언트 표시 로직(formatDateToYMD 등)이
 * 기대하는 {seconds, nanoseconds} 형태로 명시적으로 변환한다.
 * (client/admin 양쪽 Timestamp 모두 .seconds/.nanoseconds getter를 공개하므로 구조적으로 받는다.)
 */
export function serializeAdminTimestamp(value: TTimestampLike | null | undefined): TSerializedTimestamp | null {
  if (value == null) return null;
  return { seconds: value.seconds, nanoseconds: value.nanoseconds };
}
