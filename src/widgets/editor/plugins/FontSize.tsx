/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor } from 'lexical';
import * as React from 'react';

import { SHORTCUTS } from '../config/shortcuts';
import { MAX_ALLOWED_FONT_SIZE, MIN_ALLOWED_FONT_SIZE } from '../context/ToolbarState';
import { updateFontSize, updateFontSizeInSelection, UpdateFontSizeType } from '../utils';

export function parseAllowedFontSize(input: string): string {
  const match = input.match(/^(\d+(?:\.\d+)?)px$/);
  if (match) {
    const n = Number(match[1]);
    if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
      return input;
    }
  }
  return '';
}

export default function FontSize({
  selectionFontSize,
  disabled,
  editor,
}: {
  selectionFontSize: string;
  disabled: boolean;
  editor: LexicalEditor;
}) {
  const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
  const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValueNumber = Number(inputValue);

    if (e.key === 'Tab') {
      return;
    }
    if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
      e.preventDefault();
      setInputValue('');
      return;
    }
    setInputChangeFlag(true);
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();

      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const handleInputBlur = () => {
    if (inputValue !== '' && inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      updateFontSizeByInputValue(inputValueNumber);
    }
  };

  const updateFontSizeByInputValue = (inputValueNumber: number) => {
    let updatedFontSize = inputValueNumber;
    if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
      updatedFontSize = MAX_ALLOWED_FONT_SIZE;
    } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
      updatedFontSize = MIN_ALLOWED_FONT_SIZE;
    }

    setInputValue(String(updatedFontSize));
    updateFontSizeInSelection(editor, String(updatedFontSize) + 'px', null);
    setInputChangeFlag(false);
  };

  React.useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  return (
    <>
      <button
        aria-label="Decrease font size"
        className="toolbar-item font-decrement"
        disabled={disabled || (selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE)}
        title={`Decrease font size (${SHORTCUTS.DECREASE_FONT_SIZE})`}
        type="button"
        onClick={() => updateFontSize(editor, UpdateFontSizeType.decrement, inputValue)}
      >
        <i className="format minus-icon" />
      </button>

      <input
        className="toolbar-item font-size-input flex w-6 items-center justify-center bg-transparent text-center"
        disabled={disabled}
        max={MAX_ALLOWED_FONT_SIZE}
        min={MIN_ALLOWED_FONT_SIZE}
        title="Font size"
        type="number"
        value={inputValue}
        onBlur={handleInputBlur}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <button
        aria-label="Increase font size"
        className="toolbar-item font-increment"
        disabled={disabled || (selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE)}
        title={`Increase font size (${SHORTCUTS.INCREASE_FONT_SIZE})`}
        type="button"
        onClick={() => updateFontSize(editor, UpdateFontSizeType.increment, inputValue)}
      >
        <i className="format add-icon" />
      </button>
    </>
  );
}
