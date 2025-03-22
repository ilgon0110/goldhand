import Image from "next/image";

export default function ManagerWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
