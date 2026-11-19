import type { Timestamp } from 'firebase/firestore';
import { Bounce, toast } from 'react-toastify';

export function truncateString(str: string, maxLength: number = 50): string {
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

// 현재 window의 가로 크기를 반환합니다.
export function getWindowWidth(): number {
  // node.js 환경에서는 window가 없으므로 window.innerWidth를 반환할 수 없습니다.
  // 이 경우 0을 반환합니다.
  if (typeof window === 'undefined') return 0;

  return window.innerWidth;
}

// 날짜·시각은 실행 환경 timezone이 아니라 KST로 고정한다. 운영 서버(Docker)는 UTC, 브라우저는 KST라
// getDate() 등을 쓰면 KST 00~09시 데이터가 서버와 브라우저에서 다른 날짜로 렌더돼 hydration 에러가 난다(#117).
const KST_PARTS = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const toKstParts = (date: Date) =>
  Object.fromEntries(KST_PARTS.formatToParts(date).map(p => [p.type, p.value])) as Record<Intl.DateTimeFormatPartTypes, string>;

/** Date(또는 ISO 문자열)를 KST 기준 "YYYY-MM-DD"로 만든다. */
export function formatKstYMD(date: string | Date): string {
  const { year, month, day } = toKstParts(new Date(date));
  return `${year}-${month}-${day}`;
}

export function formatDateToYMD(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined): string {
  if (timestamp == null) {
    return '';
  }
  return formatKstYMD(new Date(timestamp.seconds * 1000));
}

export function isTimestampUpdated(
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined,
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined,
): boolean {
  if (createdAt == null || updatedAt == null) return false;
  return createdAt.seconds !== updatedAt.seconds || createdAt.nanoseconds !== updatedAt.nanoseconds;
}

export function formatDateToHMS(timestamp: { seconds: number; nanoseconds: number }): string {
  const { hour, minute, second } = toKstParts(new Date(timestamp.seconds * 1000));
  return `${hour}:${minute}:${second}`;
}

export function formatPrice(price: number | string | undefined): string {
  if (price === undefined) {
    return '';
  }

  const priceNumber = typeof price === 'string' ? parseInt(price, 10) : price;

  if (isNaN(priceNumber)) {
    return '';
  }

  return priceNumber.toLocaleString('ko-KR') + '원';
}

export function getRelativeTimeFromTimestamp(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'>): string {
  // KST 달력 날짜끼리 비교한다(시각은 버림).
  const kstDayNumber = (date: Date) => {
    const { year, month, day } = toKstParts(date);
    return Date.UTC(Number(year), Number(month) - 1, Number(day)) / (1000 * 60 * 60 * 24);
  };
  const diffDays = kstDayNumber(new Date()) - kstDayNumber(new Date(timestamp.seconds * 1000));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears >= 1) {
    return `${diffYears}년 전`;
  } else if (diffMonths >= 1) {
    return `${diffMonths}달 전`;
  } else {
    if (diffDays === 0) {
      return '오늘';
    } else if (diffDays === 1) {
      return '어제';
    } else {
      return `${diffDays}일 전`;
    }
  }
}
export function truncateTextToSingleLine(element: HTMLElement, text: string) {
  // 1. 요소에 텍스트를 설정
  element.textContent = text;

  // 2. 초기 상태에서 줄 수 확인
  const initialHeight = element.clientHeight;

  // 3. 텍스트를 잘라내는 함수
  let start = 0;
  let end = text.length;
  let truncatedText = text;

  while (start < end) {
    const middle = Math.floor((start + end) / 2);
    element.textContent = text.slice(0, middle) + '...';

    // 현재 높이 확인
    if (element.scrollHeight > initialHeight) {
      // 줄 수가 증가했으면 텍스트를 더 줄임
      end = middle;
    } else {
      // 줄 수가 유지되면 더 많은 텍스트를 포함해도 됨
      truncatedText = text.slice(0, middle) + '...';
      start = middle + 1;
    }
  }

  // 최종 텍스트를 요소에 적용
  element.textContent = truncatedText;
}

export function typedJson<T>(body: T, init?: ResponseInit): Response {
  return Response.json(body, init);
}

export function toastInfo(comment: string) {
  return toast.info(comment, {
    position: 'top-center',
    autoClose: 3000,
    transition: Bounce,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
}

export function toastError(comment: string) {
  return toast.error(comment, {
    position: 'top-right',
    autoClose: 3000,
    transition: Bounce,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
}

export function toastSuccess(comment: string) {
  return toast.success(comment, {
    position: 'top-right',
    autoClose: 3000,
    transition: Bounce,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  });
}

export function validateUrl(url: string): boolean {
  const urlRegExp = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
  );

  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  return url === 'https://' || urlRegExp.test(url);
}

export function formatPhoneNumber(phoneNumber: number | string | undefined): string {
  if (phoneNumber === undefined) {
    return '';
  }

  const phoneNumberString = typeof phoneNumber === 'number' ? phoneNumber.toString() : phoneNumber;
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumberString;
}
