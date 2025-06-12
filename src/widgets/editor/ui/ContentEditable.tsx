/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import type { JSX } from 'react';
import * as React from 'react';

type Props = {
  id?: string;
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
};

export default function LexicalContentEditable({
  id,
  className,
  placeholder,
  placeholderClassName,
}: Props): JSX.Element {
  return (
    <ContentEditable
      aria-placeholder={placeholder}
      className={className ?? 'ContentEditable__root'}
      placeholder={
        <div className={placeholderClassName ?? 'ContentEditable__placeholder'} id={id}>
          {placeholder}
        </div>
      }
    />
  );
}
