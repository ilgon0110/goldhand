function generateThumbnailUrl(htmlString: string): string {
  if (htmlString == null) {
    return '';
  }

  const match = htmlString.match(/<img[^>]+src=["']([^"']+)["']/i);

  return match?.[1] ?? '';
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
  if (htmlString == null) {
    return '';
  }

  const withBlockSpacing = htmlString.replace(/<\/?(p|div|br|li)[^>]*>/gi, ' ');
  const textOnly = withBlockSpacing.replace(/<[^>]+>/g, '');

  return textOnly.replace(/\s+/g, ' ').trim();
}

export { generateReviewDescription, generateReviewThumbnailSrc, generateThumbnailUrl };
