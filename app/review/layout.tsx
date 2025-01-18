import Image from "next/image";

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="w-full h-[15vh] relative">
        <Image
          src="/review-main.jpg"
          alt="리뷰 메인 이미지"
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 50vw, 100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <section className="px-8 md:px-20 xl:px-56 space-y-20 mt-20">
        {children}
      </section>
    </>
  );
}
