// test-utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function renderWithQueryClient(
  ui: React.ReactElement,
  {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    }),
    wrapper: CustomWrapper,
  }: {
    queryClient?: QueryClient;
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  } = {},
) {
  const DefaultWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const CombinedWrapper = CustomWrapper
    ? ({ children }: { children: React.ReactNode }) => (
        <CustomWrapper>
          <DefaultWrapper>{children}</DefaultWrapper>
        </CustomWrapper>
      )
    : DefaultWrapper;

  return render(ui, { wrapper: CombinedWrapper });
}
