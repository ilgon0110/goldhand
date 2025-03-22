import Image from "next/image";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
