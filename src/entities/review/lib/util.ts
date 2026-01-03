function generateThumbnailUrl(htmlString: string): string {
  if (typeof window === 'undefined' || htmlString == null) {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const imgElement = doc.querySelector('img');

  if (imgElement && imgElement instanceof HTMLImageElement) {
    return imgElement.src;
  }

  return '';
}

function generateReviewThumbnailSrc(htmlString: string) {
  if (typeof window === 'undefined' || htmlString == null) {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const imgElement = doc.querySelector('img');

  if (imgElement != null) {
    return imgElement.getAttribute('src') || '';
  }

  return '';
}

function generateReviewDescription(htmlString: string): string {
  if (typeof window === 'undefined' || htmlString == null) {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const blockTags = new Set(['P', 'DIV', 'BR', 'LI']);

  let result = '';

  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node as Text).textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      if (blockTags.has(el.tagName)) {
        result += ' '; // 혹은 "\n"도 가능 (더 깔끔)
      }

      for (const child of Array.from(el.childNodes)) {
        traverse(child);
      }

      if (blockTags.has(el.tagName)) {
        result += ' '; // 마무리 공백
      }
    }
  }

  traverse(doc.body);

  // Normalize whitespace (replace multiple spaces/newlines with single space)
  return result.replace(/\s+/g, ' ').trim();
}

export { generateReviewDescription, generateReviewThumbnailSrc, generateThumbnailUrl };
