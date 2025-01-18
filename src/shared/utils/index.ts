export function truncateString(str: string, maxLength: number = 50): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
}

// 현재 window의 가로 크기를 반환합니다.
export function getWindowWidth(): number {
  // node.js 환경에서는 window가 없으므로 window.innerWidth를 반환할 수 없습니다.
  // 이 경우 0을 반환합니다.
  if (typeof window === "undefined") return 0;

  return window.innerWidth;
}

export function getTodayDate(): string {
  const today = new Date(); // 오늘 날짜 객체 생성
  const year = today.getFullYear(); // 연도 가져오기
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 월 가져오기 (0부터 시작하므로 +1) 및 2자리로 패딩
  const day = String(today.getDate()).padStart(2, "0"); // 날짜 가져오기 및 2자리로 패딩

  return `${year}-${month}-${day}`; // "YYYY-MM-DD" 형식으로 반환
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
    element.textContent = text.slice(0, middle) + "...";

    // 현재 높이 확인
    if (element.scrollHeight > initialHeight) {
      // 줄 수가 증가했으면 텍스트를 더 줄임
      end = middle;
    } else {
      // 줄 수가 유지되면 더 많은 텍스트를 포함해도 됨
      truncatedText = text.slice(0, middle) + "...";
      start = middle + 1;
    }
  }

  // 최종 텍스트를 요소에 적용
  element.textContent = truncatedText;
}
