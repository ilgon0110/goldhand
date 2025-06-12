/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './ImageNode.css';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useCollaborationContext } from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import type { BaseSelection, LexicalCommand, LexicalEditor, NodeKey } from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGSTART_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { JSX, LegacyRef } from 'react';
import * as React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from '../context/SettingContext';
import { useSharedHistoryContext } from '../context/SharedHistoryContext';
import brokenImage from '../images/image-broken.svg';
import EmojisPlugin from '../plugins/EmojisPlugin';
import KeywordsPlugin from '../plugins/KeywordsPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import ContentEditable from '../ui/ContentEditable';
import ImageResizer from '../ui/ImageResizer';
import { $isImageNode } from './ImageNode';

const imageCache = new Map<string, boolean | Promise<boolean>>();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand('RIGHT_CLICK_IMAGE_COMMAND');

function useSuspenseImage(src: string) {
  let cached = imageCache.get(src);
  if (typeof cached === 'boolean') {
    return cached;
  } else if (!cached) {
    cached = new Promise<boolean>(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(false);
      img.onerror = () => resolve(true);
    }).then(hasError => {
      imageCache.set(src, hasError);
      return hasError;
    });
    imageCache.set(src, cached);
    throw cached;
  }
  throw cached;
}

function isSVG(src: string): boolean {
  return src.toLowerCase().endsWith('.svg');
}

function LazyImage({
  nodeKey,
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError,
}: {
  nodeKey: NodeKey;
  altText: string;
  className: string | null;
  height: number | 'inherit';
  imageRef: { current: HTMLImageElement | null };
  maxWidth: number;
  src: string;
  width: number | 'inherit';
  onError: () => void;
}): JSX.Element {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const isSVGImage = isSVG(src);

  // Set initial dimensions for SVG images
  useEffect(() => {
    if (imageRef.current && isSVGImage) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setDimensions({
        height: naturalHeight,
        width: naturalWidth,
      });
    }
  }, [imageRef, isSVGImage]);

  const hasError = useSuspenseImage(src);

  useEffect(() => {
    if (hasError) {
      onError();
    }
  }, [hasError, onError]);

  if (hasError) {
    return <BrokenImage />;
  }

  // Calculate final dimensions with proper scaling
  const calculateDimensions = () => {
    if (!isSVGImage) {
      return {
        height,
        maxWidth,
        width,
      };
    }

    // Use natural dimensions if available, otherwise fallback to defaults
    const naturalWidth = dimensions?.width || 200;
    const naturalHeight = dimensions?.height || 200;

    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    // Scale down if width exceeds maxWidth while maintaining aspect ratio
    if (finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth;
      finalWidth = maxWidth;
      finalHeight = Math.round(finalHeight * scale);
    }

    // Scale down if height exceeds maxHeight while maintaining aspect ratio
    const maxHeight = 500;
    if (finalHeight > maxHeight) {
      const scale = maxHeight / finalHeight;
      finalHeight = maxHeight;
      finalWidth = Math.round(finalWidth * scale);
    }

    return {
      height: finalHeight,
      maxWidth,
      width: finalWidth,
    };
  };

  const imageStyle = calculateDimensions();

  return (
    <SkeletonImage
      altText={altText}
      className={className || undefined}
      id={nodeKey}
      imageRef={imageRef}
      imageStyle={imageStyle}
      isSVGImage={isSVGImage}
      setDimensions={setDimensions}
      src={src}
      onError={onError}
    />
  );
}

interface SkeletonImageProps {
  id: NodeKey;
  className?: string;
  src: string;
  altText: string;
  imageRef: LegacyRef<HTMLImageElement> | undefined;
  imageStyle: {
    height: number | 'inherit';
    maxWidth: number;
    width: number | 'inherit';
  };
  onError: () => void;
  setDimensions: (
    value: React.SetStateAction<{
      width: number;
      height: number;
    } | null>,
  ) => void;
  isSVGImage: boolean;
}

const SkeletonImage = ({
  id,
  className,
  src,
  altText,
  imageRef,
  imageStyle,
  onError,
  setDimensions,
  isSVGImage = false,
}: SkeletonImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative`}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse rounded-md bg-gray-400"
          style={{
            width: imageStyle.width,
            height: imageStyle.height,
            maxWidth: imageStyle.maxWidth,
            position: 'absolute',
            top: 0,
            inset: 0,
          }}
        />
      )}
      <img
        alt={altText}
        className={className || undefined}
        draggable="false"
        id={id}
        ref={imageRef}
        src={src}
        style={imageStyle}
        onError={onError}
        onLoad={e => {
          setIsLoading(false);
          if (isSVGImage) {
            const img = e.currentTarget;
            setDimensions({
              height: img.naturalHeight,
              width: img.naturalWidth,
            });
          } else {
            // Skeleton loading for non-SVG images
          }
        }}
      />
    </div>
  );
};

function BrokenImage(): JSX.Element {
  return (
    <img
      alt="Broken image"
      draggable="false"
      src={brokenImage}
      style={{
        height: 200,
        opacity: 0.2,
        width: 200,
      }}
    />
  );
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled,
}: {
  altText: string;
  caption: LexicalEditor;
  height: number | 'inherit';
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: number | 'inherit';
  captionsEnabled: boolean;
}): JSX.Element {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const { isCollabActive } = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [isLoadError, setIsLoadError] = useState<boolean>(false);
  const isEditable = useLexicalEditable();

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (isSelected && $isNodeSelection(latestSelection) && latestSelection.getNodes().length === 1) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption],
  );

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (activeEditorRef.current === caption || buttonRef.current === event.target) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected],
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection],
  );

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent);
        }
      });
    },
    [editor],
  );

  useEffect(() => {
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const updatedSelection = editorState.read(() => $getSelection());
        if ($isNodeSelection(updatedSelection)) {
          setSelection(updatedSelection);
        } else {
          setSelection(null);
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand<MouseEvent>(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        event => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW),
    );

    rootElement?.addEventListener('contextmenu', onRightClick);

    return () => {
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    $onEnter,
    $onEscape,
    onClick,
    onRightClick,
    setSelected,
  ]);

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const onResizeEnd = (nextWidth: number | 'inherit', nextHeight: number | 'inherit') => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const { historyState } = useSharedHistoryContext();
  const {
    settings: { showNestedEditorTreeView },
  } = useSettings();

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing;
  const isFocused = (isSelected || isResizing) && isEditable;
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <LazyImage
              altText={altText}
              className={isFocused ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}` : null}
              height={height}
              imageRef={imageRef}
              maxWidth={maxWidth}
              nodeKey={nodeKey}
              src={src}
              width={width}
              onError={() => setIsLoadError(true)}
            />
          )}
        </div>
        {showCaption && (
          <div className="image-caption-container" id={nodeKey}>
            <LexicalNestedComposer initialEditor={caption}>
              <AutoFocusPlugin />
              <LinkPlugin />
              <EmojisPlugin />
              <HashtagPlugin />
              <KeywordsPlugin />
              <HistoryPlugin externalHistoryState={historyState} />
              <RichTextPlugin
                ErrorBoundary={LexicalErrorBoundary}
                contentEditable={
                  <ContentEditable
                    className="ImageNode__contentEditable"
                    placeholder="이미지 자막 입력"
                    placeholderClassName="ImageNode__placeholder"
                  />
                }
              />
            </LexicalNestedComposer>
          </div>
        )}
        {resizable && $isNodeSelection(selection) && isFocused && (
          <ImageResizer
            buttonRef={buttonRef}
            captionsEnabled={!isLoadError && captionsEnabled}
            editor={editor}
            imageRef={imageRef}
            maxWidth={maxWidth}
            setShowCaption={setShowCaption}
            showCaption={showCaption}
            onResizeEnd={onResizeEnd}
            onResizeStart={onResizeStart}
          />
        )}
      </>
    </Suspense>
  );
}
