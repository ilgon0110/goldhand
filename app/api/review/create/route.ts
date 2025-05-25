import { typedJson } from "@/src/shared/utils";
import { cookies } from "next/headers";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseApp } from "@/src/shared/config/firebase";
import { getFirestore, setDoc, doc } from "firebase/firestore";

interface ReviewPost {
  title: string;
  name: string;
  franchisee: string;
  htmlString: string;
  docId: string;
  images: { key: string; url: string }[] | null;
}

interface ResponseBody {
  response: "ok" | "ng" | "expired" | "unAuthorized";
  message: string;
  docId?: string;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ReviewPost;
  const { title, name, franchisee, htmlString, images } = body;
  console.log("body", body);
  if (!title || !htmlString || !name || !franchisee) {
    return typedJson<ResponseBody>(
      { response: "ng", message: "필수로 입력해야하는 필드를 입력해주세요." },
      { status: 400 }
    );
  }

  // 회원인지 확인
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  try {
    if (!accessToken) {
      return typedJson<ResponseBody>(
        { response: "ng", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { uid } = await getAdminAuth().verifyIdToken(accessToken?.value);
    if (uid) {
      return createReviewPost(uid, body);
    }
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      console.log("토큰 만료됨");
      return typedJson<ResponseBody>(
        { response: "ng", message: "expired" },
        { status: 401 }
      );
    }

    console.error("Error verifying token:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "Unauthorized" },
      { status: 401 }
    );
  }
}

const createReviewPost = async (uid: string, body: ReviewPost) => {
  const { title, name, franchisee, htmlString, docId, images } = body;

  // htmlString 중 img 태그는 유지하면서 src의 속성만 제거
  const cleanedHtmlString = htmlString.replace(
    /<img\s+[^>]*src=["']data:image\/[^"']*["'][^>]*>/gi,
    (match) => {
      // src 속성을 ""로 바꾼 새로운 img 태그를 반환
      return match.replace(/src=["']data:image\/[^"']*["']/, 'src=""');
    }
  );
  const imageSrcAppliedHtmlString = applyFireImageSrc(
    cleanedHtmlString,
    images || []
  );
  console.log("imageSrcAppliedHtmlString", imageSrcAppliedHtmlString);
  console.log("images", images);

  const app = firebaseApp;
  const db = getFirestore(app);

  try {
    await setDoc(doc(db, "reviews", docId), {
      title,
      name,
      franchisee,
      userId: uid,
      htmlString: imageSrcAppliedHtmlString,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return typedJson<ResponseBody>(
      { response: "ok", message: "리뷰가 성공적으로 작성되었습니다.", docId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating review post:", error);
    return typedJson<ResponseBody>(
      { response: "ng", message: "리뷰 작성에 실패했습니다." },
      { status: 500 }
    );
  }
};
function applyFireImageSrc(
  html: string,
  fireImage: { key: string; url: string }[]
) {
  return html.replace(
    /<img([^>]*?)id=["']([^"']+)["']([^>]*)>/gi,
    (match, beforeId, id, afterId) => {
      const image = fireImage.find((img) => img.key === id);
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
    }
  );
}
