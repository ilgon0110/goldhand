/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import type { JSX } from 'react';
import * as React from 'react';

import { validateUrl } from '@/src/shared/utils';

type TProps = {
  hasLinkAttributes?: boolean;
};

export default function LinkPlugin({ hasLinkAttributes = false }: TProps): JSX.Element {
  return (
    <LexicalLinkPlugin
      attributes={
        hasLinkAttributes
          ? {
              rel: 'noopener noreferrer',
              target: '_blank',
            }
          : undefined
      }
      validateUrl={validateUrl}
    />
  );
}
