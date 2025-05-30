/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import * as React from "react";

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
      className={className ?? "ContentEditable__root"}
      aria-placeholder={placeholder}
      placeholder={
        <div
          id={id}
          className={placeholderClassName ?? "ContentEditable__placeholder"}
        >
          {placeholder}
        </div>
      }
    />
  );
}
