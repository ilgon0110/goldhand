'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX, ReactNode } from 'react';
import * as React from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

interface IImagesContextFile {
  file: File;
  key: string;
}

type TImagesContextShape = {
  images: IImagesContextFile[] | null;
  setImages: React.Dispatch<React.SetStateAction<IImagesContextFile[] | null>>;
};

const Context: React.Context<TImagesContextShape> = createContext<TImagesContextShape>({
  images: null,
  setImages: () => {
    return;
  },
});

export const ImagesContext = ({ children }: { children: ReactNode }): JSX.Element => {
  const [images, setImages] = useState<IImagesContextFile[] | null>(null);

  const contextValue = useMemo(() => {
    return { images, setImages };
  }, [setImages, images]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useImagesContext = (): TImagesContextShape => {
  return useContext(Context);
};
