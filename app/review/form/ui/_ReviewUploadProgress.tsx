/* eslint-disable react/jsx-handler-names */
'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/shared/ui/alert-dialog';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

type TReviewUploadProgressProps = {
  isOptimizing: boolean;
  imageProgress: { key: string; progress: number } | undefined;
  onReset: () => void;
};

export const ReviewUploadProgress = ({ isOptimizing, imageProgress, onReset }: TReviewUploadProgressProps) => (
  <>
    {isOptimizing && <LoadingSpinnerOverlay text="이미지 최적화 중..." />}
    <AlertDialog open={imageProgress !== undefined} onOpenChange={onReset}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>업로드 진행 상황</AlertDialogTitle>
          <AlertDialogDescription>
            {imageProgress ? (
              <div className="w-full">
                <div className="mb-2 text-sm">
                  {imageProgress.key} 업로드 진행률: {imageProgress.progress}%
                </div>
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="h-4 rounded-full bg-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${imageProgress.progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm">업로드 진행 상황이 없습니다.</div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>닫기</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
