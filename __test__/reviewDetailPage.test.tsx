import { QueryClient } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RecaptchaVerifier } from 'firebase/auth';
import { signInWithPhoneNumber } from 'firebase/auth';
import { http, HttpResponse } from 'msw';
import { Suspense } from 'react';

import { ReviewDetailPage } from '@/app/review/[docId]/ui/ReviewDetailPage';
import { server } from '@/src/__mock__/node';
import { reviewKeys, userKeys, viewCountKeys } from '@/src/shared/config/queryKeys';
import type { IReviewResponseData, IUserResponseData, IViewCountResponseData, TAliasAny } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const pushMock = vi.fn();
const replaceMock = vi.fn();
const refreshMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    refresh: refreshMock,
  }),
}));

vi.mock('@/src/entities/comment', () => ({
  Comment: () => <div>Comment Mock Component</div>,
  useComments: () => ({ comments: [], loading: false }),
}));

vi.mock('@/src/widgets/editor/ui/Editor', () => ({
  Editor: () => <div>Editor Mock Component</div>,
}));

vi.mock('@/src/shared/utils', async () => {
  const actual = await vi.importActual('@/src/shared/utils');
  return { ...actual, toastSuccess: vi.fn(), toastError: vi.fn() };
});

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/auth');

  return {
    getAuth: vi.fn(() => ({ languageCode: null })),
    RecaptchaVerifier: vi.fn(() => ({
      render: vi.fn(() => Promise.resolve(1)),
      clear: vi.fn(),
    })) as unknown as typeof RecaptchaVerifier,
    signInWithPhoneNumber: vi.fn(() =>
      Promise.resolve({
        confirm: vi.fn(() =>
          Promise.resolve({
            user: { getIdToken: () => Promise.resolve('mock-phone-id-token') },
          } as TAliasAny),
        ),
      }),
    ),
    PhoneAuthProvider: actual.PhoneAuthProvider,
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
  firebaseAnalyticsPromise: Promise.resolve(null),
}));

beforeAll(() => {
  function createMockPointerEvent(type: string, props: PointerEventInit = {}): PointerEvent {
    const event = new Event(type, props) as PointerEvent;
    Object.assign(event, {
      button: props.button ?? 0,
      ctrlKey: props.ctrlKey ?? false,
      pointerType: props.pointerType ?? 'mouse',
    });
    return event;
  }
  window.PointerEvent = createMockPointerEvent as TAliasAny;
});

afterEach(() => {
  vi.clearAllMocks();
});

const mockViewCountData: IViewCountResponseData = {
  response: 'ok',
  message: '성공',
  data: { totalViewCount: 100 },
};

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

async function renderReviewDetail(reviewData: IReviewResponseData, userData: IUserResponseData) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(reviewKeys.detail('docId'), reviewData);
  queryClient.setQueryData(userKeys.all, userData);
  queryClient.setQueryData(viewCountKeys.detail('docId'), mockViewCountData);
  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReviewDetailPage docId="docId" />
    </Suspense>,
    { queryClient },
  );
}

describe('ReviewDetailPage 컴포넌트 테스트', () => {
  it('렌더링 테스트', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    await renderReviewDetail(reviewData, userData);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('수정하기 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 수정 페이지로 이동한다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    await renderReviewDetail(reviewData, userData);

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(screen.getByText('게시글 수정')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(pushMock).toHaveBeenCalledWith('/review/docId/edit');
  });

  it('삭제하기 버튼을 눌렀을 때 확인 모달이 뜨고, 취소를 누르면 모달이 닫힌다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    await renderReviewDetail(reviewData, userData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '취소하기' }));
    expect(screen.queryByText('삭제된 게시글은 복구할 수 없습니다.')).not.toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('[회원 본인] 삭제하기 버튼을 눌렀을 때 인증 없이 바로 삭제 확인 모달이 뜨고, 확인을 누르면 삭제 요청이 보내진다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '삭제 성공' }));
    server.use(http.delete('/api/review/delete', handler));
    await renderReviewDetail(reviewData, userData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.docId).toBe('docId');
      expect(body.phoneIdToken).toBeUndefined();
    });
    expect(signInWithPhoneNumber).not.toHaveBeenCalled();
  });

  it('게시글 삭제가 성공하면 리뷰 목록 페이지로 이동한다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    server.use(http.delete('/api/review/delete', async () => HttpResponse.json({ response: 'ok', message: '삭제 성공' })));
    await renderReviewDetail(reviewData, userData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/review');
    });
  });

  it('게시글 삭제가 실패하면 api의 에러 메시지가 표시된다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    server.use(
      http.delete('/api/review/delete', async () =>
        HttpResponse.json({ response: 'ng', message: '게시글 정보와 유저 정보가 일치하지 않습니다.' }, { status: 400 }),
      ),
    );
    await renderReviewDetail(reviewData, userData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith(
        '게시글 삭제에 실패하였습니다.\n게시글 정보와 유저 정보가 일치하지 않습니다.',
      );
    });
  });

  it('[비회원 글] 비로그인 방문자에게도 수정/삭제 버튼이 보인다.', async () => {
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const guestReviewData: IReviewResponseData = { ...reviewData, data: { ...reviewData.data, userId: null } };
    await renderReviewDetail(guestReviewData, mockNonUserData);

    expect(screen.getByRole('button', { name: '수정하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제하기' })).toBeInTheDocument();
  });

  it('[비회원 글] 비로그인 방문자가 삭제하기를 누르면 휴대폰 재인증 모달이 먼저 뜬다.', async () => {
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const guestReviewData: IReviewResponseData = { ...reviewData, data: { ...reviewData.data, userId: null } };
    await renderReviewDetail(guestReviewData, mockNonUserData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(screen.getByText('본인 확인을 위해 휴대폰 인증을 진행해주세요.')).toBeInTheDocument();
    expect(screen.queryByText('게시글을 삭제하시겠습니까?')).not.toBeInTheDocument();
  });

  it('[비회원 글] 휴대폰 재인증에 성공하면 phoneIdToken을 포함해 삭제 요청이 보내진다.', async () => {
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const guestReviewData: IReviewResponseData = { ...reviewData, data: { ...reviewData.data, userId: null } };
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '삭제 성공' }));
    server.use(http.delete('/api/review/delete', handler));
    await renderReviewDetail(guestReviewData, mockNonUserData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await userEvent.type(screen.getByLabelText(/휴대폰번호/), '01012345678');
    await userEvent.click(screen.getByRole('button', { name: '인증받기' }));
    expect(signInWithPhoneNumber).toHaveBeenCalled();

    const authCodeInput = await screen.findByLabelText(/인증코드/);
    await userEvent.type(authCodeInput, '123456');
    await userEvent.click(screen.getByRole('button', { name: '인증하기' }));

    // 인증 성공 시 자동으로 삭제 확인 모달로 전환된다.
    await screen.findByText('게시글을 삭제하시겠습니까?');
    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.phoneIdToken).toBe('mock-phone-id-token');
    });
  });

  it('[관리자] 다른 사람(회원)의 글도 인증 없이 삭제 확인 모달이 바로 뜬다.', async () => {
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const otherMemberReviewData: IReviewResponseData = {
      ...reviewData,
      data: { ...reviewData.data, userId: 'someone-else-uid' },
    };
    const adminUserData: IUserResponseData = {
      response: 'ok',
      message: '성공',
      accessToken: 'token',
      isLinked: false,
      userData: {
        userId: 'admin-uid',
        email: 'admin@example.com',
        name: '관리자',
        phoneNumber: '01000000000',
        grade: 'admin',
        createdAt: { nanoseconds: 0, seconds: 0 },
        nickname: 'admin',
        updatedAt: { nanoseconds: 0, seconds: 0 },
        isDeleted: false,
        deletedAt: null,
        provider: 'kakao',
        kakaoId: null,
        kakaoEmail: null,
        kakaoAlarmSettings: {
          alarmComment: false,
          alarmNews: false,
          alarmNewPost: false,
          alarmEditPost: false,
          alarmNewComment: false,
          alarmEditComment: false,
        },
      },
    };
    await renderReviewDetail(otherMemberReviewData, adminUserData);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();
    expect(screen.queryByText('본인 확인을 위해 휴대폰 인증을 진행해주세요.')).not.toBeInTheDocument();
  });
});
