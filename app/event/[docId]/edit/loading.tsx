export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#728146]" />
      <p className="text-sm text-slate-500">이벤트 수정 페이지를 불러오는 중이에요...</p>
    </div>
  );
}
