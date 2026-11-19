import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Component, type ReactNode, Suspense } from 'react';

import { renderWithQueryClient } from '@/__test__/utils/render';
import { server } from '@/src/__mock__/node';
import { WithOptionalUser } from '@/src/entities/user/ui/WithOptionalUser';

class Catch extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError = () => ({ error: true });
  render = () => (this.state.error ? <p>page error</p> : this.props.children);
}

const renderBoundary = (body: (user: unknown) => ReactNode) =>
  renderWithQueryClient(
    <Catch>
      <Suspense fallback={null}>
        <WithOptionalUser>{body}</WithOptionalUser>
      </Suspense>
    </Catch>,
  );

describe('WithOptionalUser', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));

  it('user 조회가 실패하면 page를 에러로 바꾸지 않고 비로그인(null)으로 렌더한다', async () => {
    server.use(http.get('/api/user', () => HttpResponse.json({ message: 'fail' }, { status: 500 })));

    renderBoundary(user => <p>{user === null ? 'anon' : 'user'}</p>);

    expect(await screen.findByText('anon')).toBeInTheDocument();
    expect(screen.queryByText('page error')).not.toBeInTheDocument();
  });

  it('본문 에러는 삼키지 않고 상위 에러 경계로 올린다', async () => {
    server.use(
      http.get('/api/user', () => HttpResponse.json({ response: 'ok', message: '', userData: null, isLinked: false })),
    );
    const Body = (): ReactNode => {
      throw new Error('body');
    };

    renderBoundary(() => <Body />);

    expect(await screen.findByText('page error')).toBeInTheDocument();
  });
});
