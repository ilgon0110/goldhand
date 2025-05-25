/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cn } from "@/lib/utils";
import { Button } from "@/src/shared/ui/button";
import Image from "next/image";
import { Dispatch, SetStateAction, useState, type JSX } from "react";
import * as React from "react";
import Dropzone, { FileError, useDropzone } from "react-dropzone";

type Props = Readonly<{
  "data-test-id"?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
  onSubmit: () => void;
  setFile: Dispatch<SetStateAction<File | undefined>>;
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  onSubmit,
  setFile,
  "data-test-id": dataTestId,
}: Props): JSX.Element {
  const [contentImageUrl, setContentImageUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const dataTransfer = new DataTransfer();
    acceptedFiles.forEach((file) => dataTransfer.items.add(file));
    onChange(dataTransfer.files);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const binaryStr = reader.result;
        setContentImageUrl(String(binaryStr));
      };
      //reader.readAsArrayBuffer(file);
      reader.readAsDataURL(file);
      console.log("image onDrop", file);
      setFile(file);
    });
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        setContentImageUrl(String(binaryStr));
      };
      //reader.readAsArrayBuffer(file);
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.items;

    const hasOnlyImages = Array.from(files).every(
      (item) => item.kind === "file" && item.type.startsWith("image/")
    );

    e.dataTransfer.dropEffect = hasOnlyImages ? "copy" : "none";
  };

  const imageValidator = (
    file: File
  ): FileError | readonly FileError[] | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    if (file.size > maxSize) {
      return {
        code: "file-too-large",
        message: `파일이 너무 큽니다. ${
          maxSize / 1024 / 1024
        }MB 이하의 파일을 업로드 해주세요.`,
      };
    }
    if (!validTypes.includes(file.type)) {
      return {
        code: "file-invalid-type",
        message: `지원하지 않는 파일 형식입니다. ${validTypes.join(
          ", "
        )} 형식의 파일을 업로드 해주세요.`,
      };
    }
    return null;
  };
  return (
    <Dropzone
      onDrop={onDrop}
      onDragOver={onDragOver}
      accept={{
        "image/png": [],
        "image/jpeg": [],
        "image/jpg": [],
        "image/gif": [],
        "image/webp": [],
      }}
      validator={imageValidator}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragAccept }) => (
        <section className="w-full">
          <div
            {...getRootProps()}
            className={cn(
              "flex flex-col justify-center gap-4 items-center w-full h-[200px] transition-all ease-in-out duration-200 hover:cursor-pointer",
              isDragActive &&
                isDragAccept &&
                "border-2 border-dashed border-blue-300 bg-blue-100"
            )}
          >
            <input
              {...getInputProps()}
              accept={accept}
              onChange={(e) => onChangeInput(e)}
              data-test-id={dataTestId}
            />
            {contentImageUrl ? (
              <Image
                alt="이미지 미리보기"
                src={contentImageUrl}
                width={0}
                height={0}
                style={{
                  objectFit: "contain",
                  width: "auto",
                  maxWidth: "250px",
                  height: "150px",
                }}
                sizes="100vw"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="currentColor"
                >
                  <path d="M480-480ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h312v72H216v528h528v-312h72v312q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm48-144h432L552-480 444-336l-72-96-108 144Zm408-312v-72h-72v-72h72v-72h72v72h72v72h-72v72h-72Z" />
                </svg>
                <span>최대 10mb 이하 이미지 첨부 가능</span>
              </div>
            )}
            {contentImageUrl ? (
              <Button
                className="mx-16"
                data-test-id="image-modal-file-upload-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmit();
                }}
              >
                업로드 완료
              </Button>
            ) : (
              <Button className="mx-16">이미지 업로드</Button>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
}
