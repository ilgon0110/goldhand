import { LoadingSpinnerIcon } from "@/src/shared/ui/loadingSpinnerIcon";
import { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Noop, RefCallBack } from "react-hook-form";

type ImageBoxProps = {
  placeholder?: string;
  onBlur: Noop;
  disabled?: boolean;
  name: "images";
  ref?: RefCallBack;
  accept?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewImages: string[];
};

export const ImageBoxRef = forwardRef(
  ({
    placeholder,
    name,
    ref,
    onChange,
    onBlur,
    previewImages,
  }: ImageBoxProps) => {
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          //Do whatever you want with the file contents
          const binaryStr = reader.result;
          console.log(binaryStr);
        };
        reader.readAsArrayBuffer(file);
      });
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });

    return (
      <div
        {...getRootProps()}
        className="w-full border border-gray-300 rounded-md p-4 border-dashed"
      >
        <input
          {...getInputProps()}
          placeholder={placeholder}
          onBlur={onBlur}
          id={name}
          ref={ref}
          style={{ display: "none" }}
          onChange={onChange}
          aria-hidden
        />
        <div className="flex flex-row gap-4">
          {previewImages.map((item) => {
            return (
              <div className="w-24 h-24 border border-slate-500 rounded-md"></div>
            );
          })}
        </div>
        <label htmlFor={name} role="button">
          {isDragActive ? <LoadingSpinnerIcon /> : "이미지 가져오기"}
        </label>
      </div>
    );
  }
);

ImageBoxRef.displayName = "ImageBoxRef";
