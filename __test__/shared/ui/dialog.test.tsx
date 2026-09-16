import { render, screen } from '@testing-library/react';

import { DeleteConfirmContent } from '@/src/shared/ui/DeleteConfirmContent';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/src/shared/ui/dialog';

describe('DialogContent', () => {
  it('모바일에서는 화면 높이 60%의 중앙 카드로, 데스크톱에서는 기존 중앙 모달로 배치한다', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>테스트 Dialog</DialogTitle>
          <DialogDescription>Dialog 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).toHaveClass(
      'left-[50%]',
      'top-[50%]',
      'max-h-[calc(100dvh-2rem)]',
      'h-[60dvh]',
      'w-[88%]',
      'max-w-none',
      'aspect-auto',
      'translate-x-[-50%]',
      'translate-y-[-50%]',
      'content-start',
      'overflow-y-auto',
      'rounded-3xl',
      'sm:h-auto',
      'sm:w-full',
      'sm:max-w-lg',
      'sm:rounded-lg',
    );
  });

  it('사용자 스타일을 병합하고 닫기가 제한된 동안 닫기 버튼을 비활성화한다', () => {
    render(
      <Dialog open>
        <DialogContent className="bg-red-100 p-4" closeDisabled>
          <DialogTitle>테스트 Dialog</DialogTitle>
          <DialogDescription>Dialog 설명</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole('dialog')).toHaveClass('bg-red-100', 'p-4');
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
  });

  it('삭제 아이콘 아래에 삭제, 취소 버튼을 한 줄씩 전체 너비로 배치한다', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DeleteConfirmContent
            description="삭제한 게시글은 복구할 수 없습니다."
            isPending={false}
            title="게시글을 삭제하시겠습니까?"
            onCancel={() => {}}
            onConfirm={() => {}}
          />
        </DialogContent>
      </Dialog>,
    );

    const deleteButton = screen.getByRole('button', { name: '삭제하기' });
    const cancelButton = screen.getByRole('button', { name: '취소하기' });

    const deleteIcon = screen.getByRole('img', { name: '삭제' });

    expect(deleteIcon).toHaveClass('size-[72px]');
    expect(deleteIcon.parentElement).toHaveClass('size-28', 'rounded-lg');
    expect(deleteIcon.parentElement).not.toHaveClass('rounded-full');
    expect(deleteButton.parentElement).toHaveClass(
      'w-full',
      'flex-col',
      'gap-2',
      'sm:space-x-0',
    );
    expect(deleteButton).toHaveClass('w-full');
    expect(cancelButton).toHaveClass('w-full');
  });
});
