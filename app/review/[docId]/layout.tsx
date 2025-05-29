import Image from "next/image";

export default function ReviewDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
