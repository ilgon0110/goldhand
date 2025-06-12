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

type ImagesContextShape = {
  images: ImagesContextFile[] | null;
  setImages: React.Dispatch<React.SetStateAction<ImagesContextFile[] | null>>;
};

const Context: React.Context<ImagesContextShape> = createContext<ImagesContextShape>({
  images: null,
  setImages: () => {
    return;
  },
});

interface ImagesContextFile {
  file: File;
  key: string;
}

export const ImagesContext = ({ children }: { children: ReactNode }): JSX.Element => {
  const [images, setImages] = useState<ImagesContextFile[] | null>(null);

  const contextValue = useMemo(() => {
    return { images, setImages };
  }, [setImages, images]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export const useImagesContext = (): ImagesContextShape => {
  return useContext(Context);
};
