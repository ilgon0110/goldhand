export interface IUploadedPostImage {
  key: string;
  url: string;
}

interface IResolvePostImageFieldsParams {
  htmlString: string;
  images: IUploadedPostImage[] | null;
  previousThumbnail?: string | null;
}

export function resolvePostImageFields({
  htmlString,
  images,
  previousThumbnail = null,
}: IResolvePostImageFieldsParams): { htmlString: string; thumbnail: string | null } {
  const uploadedImages = images ?? [];
  const contentImages = uploadedImages.filter(image => image.key !== 'thumbnail');
  const thumbnail = uploadedImages.find(image => image.key === 'thumbnail' && image.url)?.url ?? previousThumbnail;

  return {
    htmlString: applyUploadedImageSrcs(htmlString, contentImages),
    thumbnail,
  };
}

function applyUploadedImageSrcs(htmlString: string, images: IUploadedPostImage[]): string {
  return htmlString.replace(/<img([^>]*?)id=["']([^"']+)["']([^>]*)>/gi, (match, beforeId, id, afterId) => {
    const image = images.find(candidate => candidate.key === id);
    if (!image?.url) return match;

    if (/src=["'][^"']*["']/.test(match)) {
      return match.replace(/src=["'][^"']*["']/, `src="${image.url}"`);
    }

    return `<img${beforeId} src="${image.url}" id="${id}"${afterId}>`;
  });
}
