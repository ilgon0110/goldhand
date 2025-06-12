/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react';
import type { HTMLInputTypeAttribute } from 'react';
import * as React from 'react';

import { Input } from '@/src/shared/ui/input';
import { Label } from '@/src/shared/ui/label';

type Props = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
}>;

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
  type = 'text',
}: Props): JSX.Element {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="alt">{label}</Label>
      <Input
        data-test-id={dataTestId}
        id="alt"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
