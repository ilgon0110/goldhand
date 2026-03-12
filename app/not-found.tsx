import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-balance text-xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            className="shadow-xs rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            href="/"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
