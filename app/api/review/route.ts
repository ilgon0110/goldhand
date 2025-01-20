import { loadSearchParams } from "@/src/shared/searchParams";
import { NextResponse, type NextRequest } from "next/server";

//export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const useMock = true;
  const { page } = loadSearchParams(request);

  if (useMock) {
    return Response.json({
      status: "success",
      message: "success",
      data: [
        {
          id: "1",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 1",
          thumbnail: null,
          content:
            "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",
          spotSheet: "화성",
        },
        {
          id: "2",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 2",
          thumbnail: "/review_thumbnail.png",
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
        {
          id: "3",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 3",
          thumbnail: "/review_thumbnail.png",
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
        {
          id: "4",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 4",
          thumbnail: "/review_thumbnail.png",
          content:
            "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",
          spotSheet: "화성",
        },
        {
          id: "5",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 5",
          thumbnail: "/review_thumbnail.png",
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
        {
          id: "6",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 6",
          thumbnail: null,
          content:
            "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",

          spotSheet: "화성",
        },
        {
          id: "7",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 7",
          thumbnail: "/review_thumbnail.png",
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
        {
          id: "8",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 8",
          thumbnail: null,
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
        {
          id: "9",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 9",
          thumbnail: "/review_thumbnail.png",
          content:
            "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",
          spotSheet: "화성",
        },
        {
          id: "10",
          author: "김은숙",
          created_at: "2022-01-01",
          updated_at: "2022-01-01",
          title: "문은숙 선생님 감사합니다 10",
          thumbnail: "/review_thumbnail.png",
          content: "ㄱㅅ",
          spotSheet: "화성",
        },
      ].slice((page - 1) * 3, page * 3),
    });
  }

  return Response.json({});
}
