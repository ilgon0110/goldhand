import { forwardRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { Noop, RefCallBack } from 'react-hook-form';

import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

type ImageBoxProps = {
  placeholder?: string;
  onBlur: Noop;
  disabled?: boolean;
  name: 'images';
  ref?: RefCallBack;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewImages: string[];
};

export const ImageBoxRef = forwardRef(({ placeholder, name, ref, onChange, onBlur, previewImages }: ImageBoxProps) => {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        //Do whatever you want with the file contents
        const binaryStr = reader.result;
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div {...getRootProps()} className="w-full rounded-md border border-dashed border-gray-300 p-4">
      <input
        {...getInputProps()}
        aria-hidden
        id={name}
        placeholder={placeholder}
        ref={ref}
        style={{ display: 'none' }}
        onBlur={onBlur}
        onChange={onChange}
      />
      <div className="flex flex-row gap-4">
        {previewImages.map(item => {
          return <div className="h-24 w-24 rounded-md border border-slate-500"></div>;
        })}
      </div>
      <label htmlFor={name} role="button">
        {isDragActive ? <LoadingSpinnerIcon /> : '이미지 가져오기'}
      </label>
    </div>
  );
});

ImageBoxRef.displayName = 'ImageBoxRef';
