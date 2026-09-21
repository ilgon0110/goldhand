import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { registerRichText } from '@lexical/rich-text';
import { render, screen, waitFor } from '@testing-library/react';
import {
  $createNodeSelection,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isElementNode,
  $isTextNode,
  $setSelection,
  createEditor,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { ToolbarContext } from '@/src/widgets/editor/context/ToolbarState';
import { $createImageNode, $isImageNode, ImageNode } from '@/src/widgets/editor/nodes/ImageNode';
import { ToolbarPlugin } from '@/src/widgets/editor/plugins/ToolbarPlugin';

function createTestEditor() {
  return createEditor({
    namespace: 'alignment-test',
    nodes: [ImageNode],
    onError: error => {
      throw error;
    },
  });
}

function ToolbarHarness({ selectCenteredImage = false }: { selectCenteredImage?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  useEffect(() => {
    if (!selectCenteredImage) return;

    editor.update(() => {
      const paragraph = $createParagraphNode();
      const image = $createImageNode({ altText: '선택 이미지', src: 'https://example.com/selected.jpg' });
      paragraph.setFormat('center').append(image);
      $getRoot().append(paragraph);

      const selection = $createNodeSelection();
      selection.add(image.getKey());
      $setSelection(selection);
    });
  }, [editor, selectCenteredImage]);

  return (
    <ToolbarContext>
      <ToolbarPlugin
        activeEditor={activeEditor}
        editor={editor}
        setActiveEditor={setActiveEditor}
        setIsLinkEditMode={() => {}}
      />
    </ToolbarContext>
  );
}

describe('Editor alignment', () => {
  it('renders left, center, and right alignment toolbar buttons', () => {
    render(
      <LexicalComposer
        initialConfig={{
          namespace: 'toolbar-alignment-test',
          nodes: [ImageNode],
          onError: error => {
            throw error;
          },
        }}
      >
        <ToolbarHarness />
      </LexicalComposer>,
    );

    expect(screen.getByRole('button', { name: 'Left Align' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Center Align' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Right Align' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Justify Align' })).not.toBeInTheDocument();
  });

  it('shows the parent alignment as active when an image is selected', async () => {
    render(
      <LexicalComposer
        initialConfig={{
          namespace: 'image-selection-toolbar-test',
          nodes: [ImageNode],
          onError: error => {
            throw error;
          },
        }}
      >
        <ToolbarHarness selectCenteredImage={true} />
      </LexicalComposer>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Center Align' })).toHaveClass('active');
    });
  });

  it.each(['left', 'center', 'right'] as const)('formats a selected text paragraph as %s', format => {
    const editor = createTestEditor();
    const unregister = registerRichText(editor);

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode('정렬할 문장'));
        $getRoot().append(paragraph);
        const text = paragraph.getFirstChildOrThrow();
        if (!$isTextNode(text)) throw new Error('Expected a text node');
        text.select();
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
      },
      { discrete: true },
    );

    editor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error('Expected an element node');
      expect(paragraph.getFormatType()).toBe(format);
    });

    unregister();
  });

  it('aligns a selected image through its parent paragraph and preserves it through HTML round-trip', () => {
    const editor = createTestEditor();
    const unregister = registerRichText(editor);

    editor.update(
      () => {
        const paragraph = $createParagraphNode();
        const image = $createImageNode({ altText: '후기 이미지', src: 'https://example.com/review.jpg' });
        paragraph.append(image);
        $getRoot().append(paragraph);

        const selection = $createNodeSelection();
        selection.add(image.getKey());
        $setSelection(selection);
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
      },
      { discrete: true },
    );

    let html = '';
    editor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error('Expected an element node');
      expect(paragraph.getFormatType()).toBe('center');
      html = $generateHtmlFromNodes(editor);
    });

    expect(html).toContain('text-align: center');
    expect(html).toContain('<span><img');

    const reloadedEditor = createTestEditor();
    reloadedEditor.update(
      () => {
        const dom = new DOMParser().parseFromString(html, 'text/html');
        $getRoot().append(...$generateNodesFromDOM(reloadedEditor, dom));
      },
      { discrete: true },
    );

    reloadedEditor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChildOrThrow();
      if (!$isElementNode(paragraph)) throw new Error('Expected an element node');
      expect(paragraph.getFormatType()).toBe('center');
      expect($isImageNode(paragraph.getFirstChild())).toBe(true);
    });

    unregister();
  });
});
