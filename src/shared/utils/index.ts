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

export function getTodayDate(): string {
  const today = new Date(); // 오늘 날짜 객체 생성
  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월 가져오기 (0부터 시작하므로 +1) 및 2자리로 패딩
  const day = String(today.getDate()).padStart(2, '0'); // 날짜 가져오기 및 2자리로 패딩

  return `${year}-${month}-${day}`; // "YYYY-MM-DD" 형식으로 반환
}

export function formatDateToYMD(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined): string {
  if (timestamp == null) {
    return '';
  }
  const date = new Date(timestamp.seconds * 1000); // timestamp를 Date 객체로 변환
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // 0~11 → 1~12
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateToHMS(timestamp: { seconds: number; nanoseconds: number }): string {
  const date = new Date(timestamp.seconds * 1000); // timestamp를 Date 객체로 변환
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const seconds = `${date.getSeconds()}`.padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

export function getRelativeTimeFromTimestamp(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'>): string {
  const createdDate = new Date(timestamp.seconds * 1000);
  const now = new Date();

  // 시간 제거: 날짜만 비교하기 위해
  const created = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = today.getTime() - created.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
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

export function toastError(comment: string) {
  return toast.error(comment, {
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

export function toastSuccess(comment: string) {
  return toast.success(comment, {
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

export function validateUrl(url: string): boolean {
  const urlRegExp = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
  );

  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  return url === 'https://' || urlRegExp.test(url);
}

export function generateThumbnailUrl(htmlString: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const imgElement = doc.querySelector('img');

  if (imgElement && imgElement instanceof HTMLImageElement) {
    return imgElement.src;
  }

  return null;
}

export function generateReviewDescription(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const blockTags = new Set(['P', 'DIV', 'BR', 'LI']);

  let result = '';

  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node as Text).textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      if (blockTags.has(el.tagName)) {
        result += ' '; // 혹은 "\n"도 가능 (더 깔끔)
      }

      for (const child of Array.from(el.childNodes)) {
        traverse(child);
      }

      if (blockTags.has(el.tagName)) {
        result += ' '; // 마무리 공백
      }
    }
  }

  traverse(doc.body);

  // Normalize whitespace (replace multiple spaces/newlines with single space)
  return result.replace(/\s+/g, ' ').trim();
}

interface IEnv {
  apikey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  optionalValue?: string;
}

function getOptionalEnv<T = string>(envName: string): T | undefined {
  const value = process.env[envName];

  if (value === null) {
    return undefined;
  }

  return value as T;
}

function getRequiredEnv<T = string>(envName: string): T {
  const value = process.env[envName];

  if (value === null) {
    throw new Error(`Environment variable ${envName} is not defined.`);
  }

  if (value === undefined) {
    throw new Error(`Environment variable ${envName} is undefined.`);
  }

  return value as T;
}

export function getEnv(): IEnv {
  return {
    apikey: getRequiredEnv<IEnv['apikey']>('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getRequiredEnv<IEnv['authDomain']>('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnv<IEnv['projectId']>('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnv<IEnv['storageBucket']>('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnv<IEnv['messagingSenderId']>('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnv<IEnv['appId']>('NEXT_PUBLIC_FIREBASE_APP_ID'),
    optionalValue: getOptionalEnv<IEnv['optionalValue']>('NEXT_PUBLIC_FIREBASE_OPTIONAL_VALUE'),
  };
}
