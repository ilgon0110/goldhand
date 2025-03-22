import Image from "next/image";

export default function ManagerAboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="px-4 md:px-9">{children}</section>;
}
