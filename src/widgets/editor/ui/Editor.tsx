'use client';

import { $generateNodesFromDOM } from '@lexical/html';
import { $createLinkNode } from '@lexical/link';
import { $createListItemNode, $createListNode } from '@lexical/list';
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
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { CAN_USE_DOM } from '@lexical/utils';
import type { DOMConversionMap, EditorState, LexicalEditor, LexicalNode } from 'lexical';
import { $createParagraphNode, $createTextNode, $getRoot, $insertNodes, $isTextNode, TextNode } from 'lexical';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

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

const theme = {
  // Theme styling goes here
  //...
};

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
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      hasLinkAttributes,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      shouldPreserveNewLinesInMarkdown,
      tableCellMerge,
      tableCellBackgroundColor,
      tableHorizontalScroll,
      shouldAllowHighlightingWithBrackets,
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
  function $prepopulatedRichText() {
    const root = $getRoot();
    if (root.getFirstChild() === null) {
      const heading = $createHeadingNode('h1');
      heading.append($createTextNode('Welcome to the playground'));
      root.append(heading);
      const quote = $createQuoteNode();
      quote.append(
        $createTextNode(
          `In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
            `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`,
        ),
      );
      root.append(quote);
      const paragraph = $createParagraphNode();
      paragraph.append(
        $createTextNode('The playground is a demo environment built with '),
        $createTextNode('@lexical/react').toggleFormat('code'),
        $createTextNode('.'),
        $createTextNode(' Try typing in '),
        $createTextNode('some text').toggleFormat('bold'),
        $createTextNode(' with '),
        $createTextNode('different').toggleFormat('italic'),
        $createTextNode(' formats.'),
      );
      root.append(paragraph);
      const paragraph2 = $createParagraphNode();
      paragraph2.append(
        $createTextNode(
          'Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!',
        ),
      );
      root.append(paragraph2);
      const paragraph3 = $createParagraphNode();
      paragraph3.append($createTextNode(`If you'd like to find out more about Lexical, you can:`));
      root.append(paragraph3);
      const list = $createListNode('bullet');
      list.append(
        $createListItemNode().append(
          $createTextNode(`Visit the `),
          $createLinkNode('https://lexical.dev/').append($createTextNode('Lexical website')),
          $createTextNode(` for documentation and more information.`),
        ),
        $createListItemNode().append(
          $createTextNode(`Check out the code on our `),
          $createLinkNode('https://github.com/facebook/lexical').append($createTextNode('GitHub repository')),
          $createTextNode(`.`),
        ),
        $createListItemNode().append(
          $createTextNode(`Playground code can be found `),
          $createLinkNode('https://github.com/facebook/lexical/tree/main/packages/lexical-playground').append(
            $createTextNode('here'),
          ),
          $createTextNode(`.`),
        ),
        $createListItemNode().append(
          $createTextNode(`Join our `),
          $createLinkNode('https://discord.com/invite/KmG4wQnnD9').append($createTextNode('Discord Server')),
          $createTextNode(` and chat with the team.`),
        ),
      );
      root.append(list);
      const paragraph4 = $createParagraphNode();
      paragraph4.append(
        $createTextNode(
          `Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`,
        ),
      );
      root.append(paragraph4);
    }
  }
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
