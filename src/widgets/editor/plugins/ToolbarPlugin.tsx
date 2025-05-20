/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/ui/popover";
import type { JSX } from "react";

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from "@lexical/selection";
import { $isTableNode, $isTableSelection } from "@lexical/table";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  IS_APPLE,
  mergeRegister,
} from "@lexical/utils";
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  HISTORIC_TAG,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { Dispatch, useCallback, useEffect, useState } from "react";
import * as React from "react";

import {
  INSERT_IMAGE_COMMAND,
  InsertImageDialog,
  InsertImagePayload,
} from "./ImagesPlugin";
import DropDown, { DropDownItem } from "../ui/DropDown";
import { blockTypeToBlockName, useToolbarState } from "../context/ToolbarState";
import {
  clearFormatting,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
  getSelectedNode,
  sanitizeUrl,
} from "../utils";
import { SHORTCUTS } from "../config/shortcuts";
import useModal from "../hooks/useModal";
import FontSize from "./FontSize";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

const rootTypeToRootName = {
  root: "Root",
  table: "Table",
};

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, "">]: {
    icon: string;
    iconRTL: string;
    name: string;
  };
} = {
  center: {
    icon: "center-align",
    iconRTL: "center-align",
    name: "Center Align",
  },
  end: {
    icon: "right-align",
    iconRTL: "left-align",
    name: "End Align",
  },
  justify: {
    icon: "justify-align",
    iconRTL: "justify-align",
    name: "Justify Align",
  },
  left: {
    icon: "left-align",
    iconRTL: "left-align",
    name: "Left Align",
  },
  right: {
    icon: "right-align",
    iconRTL: "right-align",
    name: "Right Align",
  },
  start: {
    icon: "left-align",
    iconRTL: "right-align",
    name: "Start Align",
  },
};

function dropDownActiveClass(active: boolean) {
  if (active) {
    return "active dropdown-item-active";
  } else {
    return "";
  }
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  return (
    <DropDown
      disabled={disabled}
      buttonClassName="toolbar-item block-controls"
      buttonIconClassName={"icon block-type " + blockType}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style"
    >
      <DropDownItem
        className={
          "item wide " + dropDownActiveClass(blockType === "paragraph")
        }
        onClick={() => formatParagraph(editor)}
      >
        <div className="icon-text-container">
          <i className="icon paragraph" />
          <span className="text">Normal</span>
        </div>
        <span className="shortcut">{SHORTCUTS.NORMAL}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "h1")}
        onClick={() => formatHeading(editor, blockType, "h1")}
      >
        <div className="icon-text-container">
          <i className="icon h1" />
          <span className="text">Heading 1</span>
        </div>
        <span className="shortcut">{SHORTCUTS.HEADING1}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "h2")}
        onClick={() => formatHeading(editor, blockType, "h2")}
      >
        <div className="icon-text-container">
          <i className="icon h2" />
          <span className="text">Heading 2</span>
        </div>
        <span className="shortcut">{SHORTCUTS.HEADING2}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "h3")}
        onClick={() => formatHeading(editor, blockType, "h3")}
      >
        <div className="icon-text-container">
          <i className="icon h3" />
          <span className="text">Heading 3</span>
        </div>
        <span className="shortcut">{SHORTCUTS.HEADING3}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "bullet")}
        onClick={() => formatBulletList(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon bullet-list" />
          <span className="text">Bullet List</span>
        </div>
        <span className="shortcut">{SHORTCUTS.BULLET_LIST}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "number")}
        onClick={() => formatNumberedList(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon numbered-list" />
          <span className="text">Numbered List</span>
        </div>
        <span className="shortcut">{SHORTCUTS.NUMBERED_LIST}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "check")}
        onClick={() => formatCheckList(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon check-list" />
          <span className="text">Check List</span>
        </div>
        <span className="shortcut">{SHORTCUTS.CHECK_LIST}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "quote")}
        onClick={() => formatQuote(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon quote" />
          <span className="text">Quote</span>
        </div>
        <span className="shortcut">{SHORTCUTS.QUOTE}</span>
      </DropDownItem>
      <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "code")}
        onClick={() => formatCode(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon code" />
          <span className="text">Code Block</span>
        </div>
        <span className="shortcut">{SHORTCUTS.CODE_BLOCK}</span>
      </DropDownItem>
    </DropDown>
  );
}

export function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [modal, showModal] = useModal();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const { toolbarState, updateToolbarState } = useToolbarState();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          "isImageCaption",
          !!rootElement?.parentElement?.classList.contains(
            "image-caption-container"
          )
        );
      } else {
        updateToolbarState("isImageCaption", false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState("isRTL", $isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState("isLink", isLink);

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        updateToolbarState("rootType", "table");
      } else {
        updateToolbarState("rootType", "root");
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState("blockType", type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              "blockType",
              type as keyof typeof blockTypeToBlockName
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              "codeLanguage",
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      updateToolbarState(
        "fontColor",
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      updateToolbarState(
        "bgColor",
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      updateToolbarState(
        "fontFamily",
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        "elementFormat",
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState("isBold", selection.hasFormat("bold"));
      updateToolbarState("isItalic", selection.hasFormat("italic"));
      updateToolbarState("isUnderline", selection.hasFormat("underline"));
      updateToolbarState(
        "isStrikethrough",
        selection.hasFormat("strikethrough")
      );
      updateToolbarState("isSubscript", selection.hasFormat("subscript"));
      updateToolbarState("isSuperscript", selection.hasFormat("superscript"));
      updateToolbarState("isHighlight", selection.hasFormat("highlight"));
      updateToolbarState("isCode", selection.hasFormat("code"));
      updateToolbarState(
        "fontSize",
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      updateToolbarState("isLowercase", selection.hasFormat("lowercase"));
      updateToolbarState("isUppercase", selection.hasFormat("uppercase"));
      updateToolbarState("isCapitalize", selection.hasFormat("capitalize"));
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState("canUndo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState("canRedo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState("canUndo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState("canRedo", payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, $updateToolbar]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: HISTORIC_TAG } : {}
      );
    },
    [activeEditor]
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://")
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
  const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const onChangeImageModalOpen = useCallback((open: boolean) => {
    setImageModalOpen(open);
  }, []);
  return (
    <div className="toolbar top-0 sticky z-10 shadow-sm">
      <button
        disabled={!toolbarState.canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? "Undo (⌘Z)" : "Undo (Ctrl+Z)"}
        type="button"
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!toolbarState.canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              rootType={toolbarState.rootType}
              editor={activeEditor}
            />
            <Divider />
          </>
        )}
      <>
        <FontSize
          selectionFontSize={toolbarState.fontSize.slice(0, -2)}
          editor={activeEditor}
          disabled={!isEditable}
        />
      </>
      <Divider />
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "toolbar-item spaced " + (toolbarState.isBold ? "active" : "")
        }
        title={`Bold (${SHORTCUTS.BOLD})`}
        type="button"
        aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}
      >
        <i className="format bold" />
      </button>
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "toolbar-item spaced " + (toolbarState.isItalic ? "active" : "")
        }
        title={`Italic (${SHORTCUTS.ITALIC})`}
        type="button"
        aria-label={`Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`}
      >
        <i className="format italic" />
      </button>
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "toolbar-item spaced " + (toolbarState.isUnderline ? "active" : "")
        }
        title={`Underline (${SHORTCUTS.UNDERLINE})`}
        type="button"
        aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`}
      >
        <i className="format underline" />
      </button>
      <Divider />
      <Popover open={imageModalOpen} onOpenChange={onChangeImageModalOpen}>
        <PopoverTrigger asChild>
          <button className="toolbar-item" aria-label="Add Image">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="currentColor"
            >
              <path d="M480-480ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h312v72H216v528h528v-312h72v312q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm48-144h432L552-480 444-336l-72-96-108 144Zm408-312v-72h-72v-72h72v-72h72v72h72v72h-72v72h-72Z" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <InsertImageDialog
            activeEditor={editor}
            onClose={() => onChangeImageModalOpen(false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
