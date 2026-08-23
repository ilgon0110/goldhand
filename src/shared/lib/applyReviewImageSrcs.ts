export function applyReviewImageSrcs(htmlString: string, images: { key: string; url: string }[] | null) {
  // thumbnail 제외한 이미지 src 적용
  const filteredImages = (images || []).filter(image => image.key !== 'thumbnail');
  const imageSrcAppliedHtmlString = applyFireImageSrc(htmlString, filteredImages);
  const thumbnailImage = (images || []).find(image => image.key === 'thumbnail');

  return { imageSrcAppliedHtmlString, thumbnailUrl: thumbnailImage ? thumbnailImage.url : null };
}

function applyFireImageSrc(html: string, fireImage: { key: string; url: string }[]) {
  return html.replace(/<img([^>]*?)id=["']([^"']+)["']([^>]*)>/gi, (match, beforeId, id, afterId) => {
    const image = fireImage.find(img => img.key === id);
    if (image && image.url) {
      // src 속성이 이미 있다면 교체
      if (/src=["'][^"']*["']/.test(match)) {
        return match.replace(/src=["'][^"']*["']/, `src="${image.url}"`);
      } else {
        // src 속성이 없으면 추가
        return `<img${beforeId} src="${image.url}" id="${id}"${afterId}>`;
      }
    }
    return match; // 매칭 안 되면 원본 유지
  });
}
