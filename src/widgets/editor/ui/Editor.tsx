/* eslint-disable react/jsx-handler-names */
'use client';

import { $generateNodesFromDOM } from '@lexical/html';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import { CAN_USE_DOM } from '@lexical/utils';
import type { DOMConversionMap, EditorState, LexicalEditor, LexicalNode } from 'lexical';
import { $getRoot, $insertNodes, $isTextNode, TextNode } from 'lexical';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import type { TAliasAny } from '@/src/shared/types';

import { useImagesContext } from '../context/ImagesContext';
import { SettingsContext, useSettings } from '../context/SettingContext';
import { SharedHistoryContext, useSharedHistoryContext } from '../context/SharedHistoryContext';
import { ToolbarContext } from '../context/ToolbarState';
import { ExtendedTextNode } from '../nodes/ExtendTextNode';
import PlaygroundNodes from '../nodes/PlaygroundNodes';
import AutoLinkPlugin from '../plugins/AutoLinkPlugin';
import DragDropPaste from '../plugins/DragDropPastePlugin';
import EmojiPickerPlugin from '../plugins/EmojiPickerPlugin';
import EmojisPlugin from '../plugins/EmojisPlugin';
import { ImagesPlugin } from '../plugins/ImagesPlugin';
import KeywordsPlugin from '../plugins/KeywordsPlugin';
import LinkPlugin from '../plugins/LinkPlugin';
import ShortcutsPlugin from '../plugins/ShortcutsPlugin';
import { ToolbarPlugin } from '../plugins/ToolbarPlugin';
import PlaygroundEditorTheme from '../theme/PlaygroundEditorTheme';
import ContentEditable from './ContentEditable';

function MyOnChangePlugin(props: { onChange: (editorState: EditorState) => void }): null {
  const [editor] = useLexicalComposerContext();
  const { onChange } = props;
  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [onChange, editor]);

  return null;
}

const RichEditor = ({
  editable,
  htmlString,
  onEditorChange,
}: {
  editable: boolean;
  htmlString?: string;
  onEditorChange: (editor: LexicalEditor) => void;
}): JSX.Element => {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      //isAutocomplete,
      //isMaxLength,
      //isCharLimit,
      hasLinkAttributes,
      //isCharLimitUtf8,
      isRichText,
      //showTreeView,
      //showTableOfContents,
      //shouldUseLexicalContextMenu,
      //shouldPreserveNewLinesInMarkdown,
      tableCellMerge,
      tableCellBackgroundColor,
      tableHorizontalScroll,
      //shouldAllowHighlightingWithBrackets,
      selectionAlwaysOnDisplay,
      listStrictIndent,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const placeholder = isCollab
    ? 'Enter some collaborative rich text...'
    : isRichText
      ? '내용을 입력하세요...'
      : 'Enter some plain text...';
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const { setImages } = useImagesContext();

  useEffect(() => {
    const isDev = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';
    if (isDev) {
      try {
        const KEY = 'lexical_editor_content';
        if ((window as TAliasAny)[KEY]) return;
      } catch {
        // ignore
      }
    }
    editor.update(() => {
      if (htmlString) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlString, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);

        $getRoot().select();
        $insertNodes(nodes);
      }
    });
  }, []);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const onChangePlugin = () => {
    onEditorChange(editor);

    // editor에서 삭제된 ImageNode의 key를 찾아서 ImageContext 업데이트
    const currentImageNodeKeys = new Set<string>();
    editor.getEditorState()._nodeMap.forEach((node: LexicalNode) => {
      if (node.getType() === 'image') {
        currentImageNodeKeys.add(node.getKey());
      }
    });

    setImages(prevImages => {
      if (!prevImages) return prevImages;
      return prevImages.filter(image => currentImageNodeKeys.has(image.key));
    });
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      if (typeof window === 'undefined') return;
      const isNextSmallWidthViewport = CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div
      className={cn(
        'relative mt-6',
        editable ? 'h-[500px] overflow-scroll rounded-md border border-slate-200' : 'h-fit',
      )}
    >
      {editable && (
        <ToolbarPlugin
          activeEditor={activeEditor}
          editor={editor}
          setActiveEditor={setActiveEditor}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      )}
      <ShortcutsPlugin editor={activeEditor} setIsLinkEditMode={setIsLinkEditMode} />
      <MyOnChangePlugin onChange={onChangePlugin} />
      <div className={`editor-container`}>
        <DragDropPaste />
        {/* <AutoFocusPlugin /> */}
        {selectionAlwaysOnDisplay && <SelectionAlwaysOnDisplay />}
        <ClearEditorPlugin />
        <EmojiPickerPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />
      </div>
      <HistoryPlugin externalHistoryState={historyState} />
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={
          <div className="editor-scroller">
            <div className="editor" ref={onRef}>
              <ContentEditable placeholder={placeholder} />
            </div>
          </div>
        }
      />
      <ListPlugin hasStrictIndent={listStrictIndent} />
      <CheckListPlugin />
      <TablePlugin
        hasCellBackgroundColor={tableCellBackgroundColor}
        hasCellMerge={tableCellMerge}
        hasHorizontalScroll={tableHorizontalScroll}
      />
      <ImagesPlugin />
      <LinkPlugin hasLinkAttributes={hasLinkAttributes} />
      <ClickableLinkPlugin disabled={isEditable} />
      <HorizontalRulePlugin />
      <TabIndentationPlugin maxIndent={7} />
    </div>
  );
};

export const Editor = ({
  htmlString,
  onEditorChange,
  editable,
}: {
  htmlString?: string;
  onEditorChange: (editor: LexicalEditor) => void;
  editable: boolean;
}): JSX.Element => {
  function buildImportMap(): DOMConversionMap {
    const importMap: DOMConversionMap = {};

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
      importMap[tag] = importNode => {
        const importer = fn(importNode);
        if (!importer) {
          return null;
        }
        return {
          ...importer,
          conversion: element => {
            const output = importer.conversion(element);
            if (
              output === null ||
              output.forChild === undefined ||
              output.after !== undefined ||
              output.node !== null
            ) {
              return output;
            }
            const extraStyles = '';
            if (extraStyles) {
              const { forChild } = output;
              return {
                ...output,
                forChild: (child, parent) => {
                  const textNode = forChild(child, parent);
                  if ($isTextNode(textNode)) {
                    textNode.setStyle(textNode.getStyle() + extraStyles);
                  }
                  return textNode;
                },
              };
            }
            return output;
          },
        };
      };
    }

    return importMap;
  }

  const initialConfig = {
    editorState: null,
    html: { import: buildImportMap() },
    namespace: 'Playground',
    nodes: [
      ...PlaygroundNodes,
      ExtendedTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new ExtendedTextNode(node.__text),
        withKlass: ExtendedTextNode,
      },
    ],
    theme: PlaygroundEditorTheme,
    onError: (error: Error) => {
      console.error('Lexical error', error);
    },
    editable: editable,
  };

  return (
    <SettingsContext>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <ToolbarContext>
            <RichEditor editable={editable} htmlString={htmlString} onEditorChange={onEditorChange} />
          </ToolbarContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </SettingsContext>
  );
};
