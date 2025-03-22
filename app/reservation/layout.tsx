import Image from "next/image";

export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="px-4 md:px-[10vw] mt-14">{children}</section>;
}
