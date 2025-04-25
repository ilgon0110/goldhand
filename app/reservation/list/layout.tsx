import Image from "next/image";

export default function ReservationListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
