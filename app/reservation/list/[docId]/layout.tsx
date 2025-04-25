import Image from "next/image";

export default function ReservationDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
