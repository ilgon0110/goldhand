import Image from "next/image";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
